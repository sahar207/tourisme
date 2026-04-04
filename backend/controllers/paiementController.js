const paiement = require('../models/paiement');

/**
 * Get all paiements
 */
exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await paiement.findAll();
    res.json(paiements);
  } catch (err) {
    console.error('Error getting paiements:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get paiements by guide
 */
exports.getPaiementsByGuide = async (req, res) => {
  const guideId = req.params.guideId;

  try {
    const paiements = await paiement.findByGuide(guideId);
    res.json(paiements);
  } catch (err) {
    console.error('Error getting paiements by guide:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get single paiement
 */
exports.getPaiement = async (req, res) => {
  const paiementId = req.params.id;

  try {
    const paiementData = await paiement.findById(paiementId);
    if (!paiementData) {
      return res.status(404).json({ error: 'Paiement not found' });
    }
    res.json(paiementData);
  } catch (err) {
    console.error('Error getting paiement:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Create new paiement
 */
exports.createPaiement = async (req, res) => {
  const { id_guide, montant, methode_paiement, statut } = req.body;

  try {
    const paiementId = await paiement.create({
      id_guide,
      montant,
      methode_paiement,
      statut: statut || 'EN_ATTENTE'
    });
    res.json({ success: true, paiementId });
  } catch (err) {
    console.error('Error creating paiement:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update paiement status
 */
exports.updatePaiementStatus = async (req, res) => {
  const paiementId = req.params.id;
  const { statut } = req.body;

  try {
    await paiement.update(paiementId, { statut });
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating paiement status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete paiement
 */
exports.deletePaiement = async (req, res) => {
  const paiementId = req.params.id;

  try {
    await paiement.delete(paiementId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting paiement:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
