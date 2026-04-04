const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifAdmin } = require('../middlewares/auth');

router.use(verifAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/cv-attente', adminController.getCvAttente);
router.post('/cv/:id/approve', adminController.approveCv);
router.get('/guides-docs', adminController.getGuidesDocs);
router.get('/accept-docs/:id', adminController.acceptDocs);
router.get('/refuse-docs/:id', adminController.refuseDocs);
router.post('/guide/:id/:action', adminController.toggleGuideStatus);
router.get('/messages', adminController.getMessagesList);
router.get('/messages/:guideId', adminController.getConversation);
router.post('/messages/:guideId', adminController.sendMessage);
router.get('/messages/:guideId/refresh', adminController.refreshConversation);

module.exports = router;