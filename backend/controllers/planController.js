const Plan = require('../models/Plan');
const Guide = require('../models/Guide');
const PlanLieu = require('../models/PlanLieu');
const Delegation = require('../models/Delegation');
const Gouvernorat = require('../models/Gouvernorat');
const User = require('../models/User');
const db = require('../config/db');

/**
 * Get all plans for a guide
 */
exports.getGuidePlans = async (req, res) => {
  const guideId = req.session.user.id;

  try {
    const plans = await Plan.findByGuide(guideId);
    
    res.render('guide/plans', {
      user: req.session.user,
      plans,
      layout: 'minimal'
    });
  } catch (err) {
    console.error('Error getting guide plans:', err);
    res.status(500).send('Server error');
  }
};

/**
 * Get form to create a new plan
 */
exports.getNewPlan = async (req, res) => {
  try {
    // Get delegations with governorat names for the form
    const delegations = await db.query(`
      SELECT d.*, g.nom as gouvernorat_nom 
      FROM delegations d 
      LEFT JOIN gouvernorats g ON d.id_gouvernorat = g.id 
      ORDER BY d.nom
    `);

    res.render('guide/create-plan', {
      user: req.session.user,
      delegations: delegations[0]
    });
  } catch (err) {
    console.error('Error getting new plan form:', err);
    res.status(500).send('Server error');
  }
};

/**
 * Create a new plan
 */
exports.createPlan = async (req, res) => {
  const guideId = req.session.user.id;
  const { titre, description, date_debut, date_fin, prix, lieux } = req.body;

  try {
    // Get guide info
    const guide = await Guide.findByUserId(guideId);
    
    // Create the plan
    const planId = await Plan.create({
      id_guide: guide.id,
      titre,
      description,
      date_debut,
      date_fin,
      prix
    });

    // Add lieux if provided
    if (lieux && Array.isArray(lieux)) {
      for (const lieuId of lieux) {
        await PlanLieu.create({
          id_plan: planId,
          id_delegation: lieuId
        });
      }
    }

    // Redirect to plans page with success message
    res.redirect('/guide/plans?success=Plan créé avec succès');
  } catch (err) {
    console.error('Error creating plan:', err);
    res.redirect('/guide/create-plan?error=Erreur lors de la création du plan');
  }
};

/**
 * Get plan details
 */
exports.getPlanDetails = async (req, res) => {
  const planId = req.params.id;

  try {
    const plan = await Plan.getFullDetails(planId);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (err) {
    console.error('Error getting plan details:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update a plan
 */
exports.updatePlan = async (req, res) => {
  const planId = req.params.id;
  const { titre, description, date_debut, date_fin, prix } = req.body;
  const userId = req.session.user.id;

  try {
    // Check if user owns this plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const guide = await Guide.findById(plan.id_guide);
    if (guide.id_utilisateur !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Plan.update(planId, { titre, description, date_debut, date_fin, prix });
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating plan:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete a plan
 */
exports.deletePlan = async (req, res) => {
  const planId = req.params.id;
  const userId = req.session.user.id;

  try {
    // Check if user owns this plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const guide = await Guide.findById(plan.id_guide);
    if (guide.id_utilisateur !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Plan.delete(planId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting plan:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all available plans (for tourists and public)
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAllWithDetails();
    
    // Use public view for non-authenticated users, tourist view for logged-in users
    const template = req.session.user ? 'touriste/plans' : 'plans';
    
    res.render(template, {
      user: req.session.user,
      plans
    });
  } catch (err) {
    console.error('Error getting all plans:', err);
    res.status(500).send('Server error');
  }
};
