const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verifGuide, verifTouriste, checkGuideValidated } = require('../middlewares/auth');
const { planImage, planImageOptional } = require('../middlewares/upload');

// Public routes
router.get('/', planController.getAllPlans);
router.get('/public', planController.getAllPlans);
router.get('/public/:id', planController.getPlanDetails);

// Guide routes
router.get('/guide/plans', verifGuide, checkGuideValidated, planController.getGuidePlans);

// garder les 2 URLs pour éviter le 404 définitivement
router.get('/guide/create-plan', verifGuide, checkGuideValidated, planController.getNewPlan);
router.get('/guide/plans/new', verifGuide, checkGuideValidated, planController.getNewPlan);

router.post('/guide/create-plan', planImage.single('image'), planController.createPlan);
router.post('/guide/plans', planImage.single('image'), planController.createPlan);

router.put('/guide/plans/:id', verifGuide, checkGuideValidated, planController.updatePlan);
router.delete('/guide/plans/:id', verifGuide, checkGuideValidated, planController.deletePlan);

// Edit plan form route
router.get('/guide/plans/:id/edit', verifGuide, checkGuideValidated, planController.getEditPlan);
router.get('/guide/plans/:id/details', verifGuide, checkGuideValidated, planController.getPlanDetails);

// Public plan details
router.get('/plans/:id', planController.getPlanForView);

// Tourist routes
router.get('/touriste/plans', verifTouriste, planController.getAllPlans);
router.get('/touriste/plans/:id', planController.getPlanDetails);

module.exports = router;
