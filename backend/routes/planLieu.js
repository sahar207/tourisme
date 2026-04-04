const express = require('express');
const router = express.Router();
const planLieuController = require('../controllers/planLieuController');

router.get('/plan-lieux', planLieuController.getAllPlanLieux);
router.get('/plan-lieux/:id', planLieuController.getPlanLieu);
router.get('/plans/:planId/lieux', planLieuController.getLieuxByPlan);
router.post('/plan-lieux', planLieuController.createPlanLieu);
router.put('/plan-lieux/:id', planLieuController.updatePlanLieu);
router.delete('/plan-lieux/:id', planLieuController.deletePlanLieu);

module.exports = router;
