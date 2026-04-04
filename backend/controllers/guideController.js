const Guide = require('../models/Guide');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const path = require('path');
const fs = require('fs');

exports.getDashboard = async (req, res) => {
  const userId = req.session.user.id;
  try {
    let guide = await Guide.findByUserId(userId);
    if (!guide) {
      await Guide.create(userId);
      guide = await Guide.findByUserId(userId);
    }
    const user = await User.findById(userId);
    
    // 🔥 AJOUTE CES LOGS
    console.log('=== DASHBOARD GUIDE ===');
    console.log('userId:', userId);
    console.log('guide trouvé :', guide);
    console.log('abonnement_fin (brut) :', guide.abonnement_fin);
    console.log('abonnement_actif :', guide.abonnement_actif);
    
    res.render('guide/dashboard', {
      user,
      guide,
      cv_approved: guide.cv_approved || 0,
      abonnement_actif: guide.abonnement_actif || 0,
      abonnement_fin: guide.abonnement_fin,
      statut: guide.statut || 'ATTENTE',
      hideNavbar: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};

exports.uploadDocs = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cvFile = req.files['cv'] ? `uploads/cv/${req.files['cv'][0].filename}` : null;
    const diplomeFile = req.files['diplome'] ? `uploads/diplome/${req.files['diplome'][0].filename}` : null;

    await Guide.update(userId, {
      cv: cvFile,
      diplome: diplomeFile,
      cv_approved: 0,
      diplome_approved: 0,
      date_soumission: new Date()
    });

    await Notification.create({
      id_utilisateur: 13,
      type: 'CV',
      contenu: 'Nouveau dossier guide à valider'
    });

    res.redirect('/guide/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur upload');
  }
};

exports.getUploadDocs = (req, res) => {
  res.render('guide/upload-cv');
};

/**
 * Affiche le profil du guide connecté.
 */
exports.getProfile = async (req, res) => {
  const userId = req.session.user.id;
  try {
    // Récupérer les infos utilisateur
    const user = await User.findById(userId);
    // Récupérer les infos spécifiques au guide
    const guide = await Guide.findByUserId(userId);
    console.log('🔍 guide complet :', guide);
    console.log('🔍 abonnement_fin :', guide.abonnement_fin);
    res.render('guide/profile', {
      user,
      guide,
      telephone: user.telephone || '',
      bio: user.bio || '',
      photo_profil: user.photo_profil || '/images/default-avatar.png'
    });
  } catch (err) {
    console.error('Erreur profil guide:', err);
    res.status(500).send('Erreur serveur');
  }
};
/**
 * Met à jour les informations du profil (nom, téléphone, bio) et la photo.
 */
exports.updateProfile = async (req, res) => {
  const userId = req.session.user.id;
  const { nom_complet, telephone, bio } = req.body;

  try {
    // 1. Mise à jour des champs texte
    await User.update(userId, { nom_complet, telephone, bio });

    // 2. Gestion de la photo si un fichier a été uploadé (grâce au middleware upload.photo)
    if (req.file) {
      const photoPath = `/uploads/photos-profil/${req.file.filename}`;
      await User.update(userId, { photo_profil: photoPath });
      // Mettre à jour la session pour que la nouvelle photo s'affiche immédiatement
      req.session.user.photo_profil = photoPath;
    }

    // Mettre à jour le nom dans la session si modifié
    req.session.user.nom_complet = nom_complet;

    // Rediriger vers la page de profil avec un message de succès (optionnel)
    res.redirect('/guide/profile');
  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).send('Erreur serveur');
  }
};
/**
 * Upload de la photo de profil (appelé en AJAX depuis le formulaire dédié).
 */
exports.uploadPhoto = async (req, res) => {
  try {
    // Vérifier qu'un fichier a bien été envoyé
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Construire le chemin public de la photo
    const photoPath = `/uploads/photos-profil/${req.file.filename}`;
    const userId = req.session.user.id;

    // Mettre à jour l'utilisateur en base de données
    await User.update(userId, { photo_profil: photoPath });

    // Mettre à jour la session pour que la nouvelle photo s'affiche immédiatement
    req.session.user.photo_profil = photoPath;

    // Répondre avec un JSON de succès (attendu par le frontend)
    res.json({ success: true, photoPath });
  } catch (err) {
    console.error('Erreur upload photo:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Plan functionality moved to planController
/**
 * Affiche la conversation entre le guide et l'administrateur.
 */
exports.getMessages = async (req, res) => {
  const guideId = req.session.user.id;
  try {
    const admin = await User.findAdmin();
    if (!admin) {
      return res.status(500).send('Aucun administrateur trouvé.');
    }
    const adminId = admin.id;

    await Message.markAsRead(adminId, guideId);
    const messages = await Message.findConversation(guideId, adminId);

    res.render('guide/messages', {
      user: req.session.user,
      messages,
      adminId
    });
  } catch (err) {
    console.error('❌ Erreur dans getMessages:', err);
    res.status(500).send('Erreur serveur : ' + err.message);
  }
};
/**
 * Envoie un message du guide à l'administrateur.
 */
exports.sendMessage = async (req, res) => {
  const guideId = req.session.user.id;
  const { contenu } = req.body;

  if (!contenu || contenu.trim() === '') {
    return res.redirect('/guide/messages');
  }

  try {
    const admin = await User.findAdmin();
    if (!admin) {
      return res.status(500).send('Aucun administrateur trouvé.');
    }
    const adminId = admin.id;

    await Message.create({
      id_expediteur: guideId,
      id_destinataire: adminId,
      contenu: contenu.trim()
    });

    await Notification.create({
      id_utilisateur: adminId,
      type: 'MESSAGE',
      contenu: `Nouveau message de ${req.session.user.nom_complet}`
    });

    res.redirect('/guide/messages');
  } catch (err) {
    console.error('❌ Erreur envoi message:', err);
    res.status(500).send('Erreur serveur : ' + err.message);
  }
};
exports.markNotificationsRead = async (req, res) => {
  res.send('Marquer notifications lues - à implémenter');
};
exports.refreshNotifications = async (req, res) => {
  res.send('Rafraîchir notifications - à implémenter');
};
// ... toutes les autres fonctions : getProfile, updateProfile, uploadPhoto, getAbonnement, getPaiement, postPaiement, getPlans, getNewPlan, postPlan, getMessages, sendMessage, markNotificationsRead, refreshNotifications, etc.