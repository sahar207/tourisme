const express = require('express');
const router = express.Router();
const abonnementController = require('../controllers/abonnementController');
const { verifGuide } = require('../middlewares/auth');

router.use(verifGuide);

router.get('/abonnement', abonnementController.getSubscription);
router.post('/abonnement/activate', abonnementController.activateSubscription);
router.get('/paiement', abonnementController.getPayment);
router.post('/paiement', abonnementController.processPayment);
router.post('/abonnement/cancel', abonnementController.cancelSubscription);
router.get('/abonnement/history', abonnementController.getSubscriptionHistory);

module.exports = router;
