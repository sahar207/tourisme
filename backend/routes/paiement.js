const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

router.get('/paiements', paiementController.getAllPaiements);
router.get('/paiements/:id', paiementController.getPaiement);
router.get('/guides/:guideId/paiements', paiementController.getPaiementsByGuide);
router.post('/paiements', paiementController.createPaiement);
router.put('/paiements/:id/status', paiementController.updatePaiementStatus);
router.delete('/paiements/:id', paiementController.deletePaiement);

module.exports = router;
