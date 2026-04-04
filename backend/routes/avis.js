const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const { verifTouriste, verifGuide } = require('../middlewares/auth');

// Tourist routes
router.get('/touriste/avis', verifTouriste, avisController.getTouristAvis);
router.post('/avis', verifTouriste, avisController.createAvis);
router.put('/avis/:id', verifTouriste, avisController.updateAvis);
router.delete('/avis/:id', verifTouriste, avisController.deleteAvis);

// Guide routes
router.get('/guide/avis', verifGuide, avisController.getGuideAvis);

// Public routes
router.get('/plans/:planId/avis', avisController.getPlanAvis);

module.exports = router;
