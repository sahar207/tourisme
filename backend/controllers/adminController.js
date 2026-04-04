const User = require('../models/User');
const Guide = require('../models/Guide');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Plan = require('../models/Plan');

/**
 * Affiche le tableau de bord administrateur avec statistiques et listes.
 */
exports.getDashboard = async (req, res) => {
  const adminId = req.session.user.id;
  try {
    // Statistiques : requêtes parallèles pour optimisation
    const [guidesActifs, guidesEnAttente, notificationsNonLues, totalPlans] = await Promise.all([
      Guide.findAll('ACTIF'),                      // guides avec statut ACTIF
      Guide.findPending(),                          // guides avec documents en attente
      Notification.getUnreadCount(adminId),
      Plan.findAll().then(plans => plans.length)    // nombre total de plans
    ]);

    // 10 derniers guides actifs (avec leurs plans)
    const actifsAvecPlans = await Promise.all(
      guidesActifs.slice(0, 10).map(async (guide) => {
        const plans = await Plan.findByGuide(guide.id);
        return { ...guide, nb_plans: plans.length };
      })
    );

    // Notifications récentes
    const notifications = await Notification.findByUser(adminId, 10);
    const fixedGuidesAttente = guidesEnAttente.map(g => ({
  ...g,
  id: g.id_utilisateur
}));
    res.render('admin/dashboard', {
      user: req.session.user,
      stats: {
        guides_actifs: guidesActifs.length,
        guides_en_attente: guidesEnAttente.length,
        notifications_non_lues: notificationsNonLues,
        total_plans: totalPlans
      },
      guides_actifs: actifsAvecPlans,
      guides_attente: fixedGuidesAttente,
      notifications,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Erreur dashboard admin:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Liste des CV en attente (ancienne route, peut être fusionnée avec guides-docs).
 */
exports.getCvAttente = async (req, res) => {
  try {
    const cvs = await Guide.findPending();
    res.render('admin/cv-attente', {
      user: req.session.user,
      cvs,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Erreur cv-attente:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Approuve le CV d'un guide et active son compte.
 */
exports.approveCv = async (req, res) => {
  const guideId = req.params.id;
  try {
    await Guide.approveDocuments(guideId);
    // Notification au guide
    await Notification.create({
      id_utilisateur: guideId,
      type: 'CV',
      contenu: 'Votre CV a été approuvé !'
    });
    res.redirect('/admin/cv-attente');
  } catch (err) {
    console.error('Erreur approbation CV:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Liste des guides ayant soumis leurs documents (CV et diplôme) en attente.
 */
exports.getGuidesDocs = async (req, res) => {
  try {
    const list = await Guide.findPending(); // déjà fait
    res.render('admin/guides_docs', { 
      list,
      layout: 'minimal' 
    });
  } catch (err) {
    console.error('Erreur guides-docs:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Accepte les documents (CV + diplôme) d'un guide.
 */
exports.acceptDocs = async (req, res) => {
  const guideId = req.params.id;
  try {
    await Guide.approveDocuments(guideId);
    await Notification.create({
      id_utilisateur: guideId,
      type: 'VALIDATION',
      contenu: 'Félicitations ! Vos documents ont été approuvés. Vous êtes maintenant guide actif.'
    });
    res.redirect('/admin/guides-docs');
  } catch (err) {
    console.error('Erreur acceptation docs:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Refuse les documents d'un guide.
 */
exports.refuseDocs = async (req, res) => {
  const guideId = req.params.id;
  try {
    await Guide.refuseDocuments(guideId);
    await Notification.create({
      id_utilisateur: guideId,
      type: 'VALIDATION',
      contenu: 'Vos documents ont été refusés. Veuillez les corriger et les renvoyer.'
    });
    res.redirect('/admin/guides-docs');
  } catch (err) {
    console.error('Erreur refus docs:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Bascule le statut d'un guide (bloquer / activer).
 */
exports.toggleGuideStatus = async (req, res) => {
  const guideId = req.params.id;
  const action = req.params.action; // 'bloquer' ou 'activer'
  const newStatut = action === 'bloquer' ? 'BLOQUE' : 'ACTIF';
  try {
    await Guide.update(guideId, { statut: newStatut });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Erreur changement statut:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Liste des conversations (derniers messages) pour l'admin.
 */
exports.getMessagesList = async (req, res) => {
  const adminId = req.session.user.id;
  try {
    const messages = await Message.getLastMessagesForUser(adminId);
    // Enrichir avec le statut du guide
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const otherId = msg.other_user_id;
        const user = await User.findById(otherId);
        if (user && user.role === 'GUIDE') {
          const guide = await Guide.findByUserId(otherId);
          return { ...msg, guide_status: guide ? guide.statut : null };
        }
        return msg;
      })
    );
    res.render('admin/messages', {
      messages: enriched,
      user: req.session.user,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Erreur liste messages:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche la conversation avec un guide spécifique.
 */
exports.getConversation = async (req, res) => {
  const adminId = req.session.user.id;
  const guideId = req.params.guideId;

  try {
    // Marquer les messages de ce guide comme lus
    await Message.markAsRead(guideId, adminId);

    // Récupérer les messages
    const messages = await Message.findConversation(adminId, guideId);

    // Récupérer les infos du guide
    const guide = await User.findById(guideId);

    res.render('admin/conversation', {
      user: req.session.user,
      guide,
      messages,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Erreur conversation:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Envoie un message de l'admin vers un guide.
 */
exports.sendMessage = async (req, res) => {
  const adminId = req.session.user.id;
  const guideId = req.params.guideId;
  const { contenu } = req.body;

  try {
    await Message.create({
      id_expediteur: adminId,
      id_destinataire: guideId,
      contenu
    });

    // Notification au guide
    await Notification.create({
      id_utilisateur: guideId,
      type: 'MESSAGE',
      contenu: 'Nouveau message de l\'admin'
    });

    res.redirect(`/admin/messages/${guideId}`);
  } catch (err) {
    console.error('Erreur envoi message admin:', err);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Rafraîchit la conversation (AJAX) – renvoie les messages au format JSON.
 */
exports.refreshConversation = async (req, res) => {
  const adminId = req.session.user.id;
  const guideId = req.params.guideId;

  try {
    const messages = await Message.findConversation(adminId, guideId);
    res.json(messages);
  } catch (err) {
    console.error('Erreur rafraîchissement conversation:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};