const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/inscription', authController.getRegister);   // بدل register
router.post('/inscription', authController.postInscription);

router.get('/verification', authController.getVerification);
router.post('/verification', authController.postVerification);

router.get('/logout', authController.logout);

module.exports = router;