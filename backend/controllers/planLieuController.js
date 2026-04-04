const PlanLieu = require('../models/PlanLieu');

/**
 * Get all plan lieux
 */
exports.getAllPlanLieux = async (req, res) => {
  try {
    const planLieux = await PlanLieu.findAll();
    res.json(planLieux);
  } catch (err) {
    console.error('Error getting plan lieux:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get lieux by plan
 */
exports.getLieuxByPlan = async (req, res) => {
  const planId = req.params.planId;

  try {
    const lieux = await PlanLieu.findByPlan(planId);
    res.json(lieux);
  } catch (err) {
    console.error('Error getting lieux by plan:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get single plan lieu
 */
exports.getPlanLieu = async (req, res) => {
  const planLieuId = req.params.id;

  try {
    const planLieu = await PlanLieu.findById(planLieuId);
    if (!planLieu) {
      return res.status(404).json({ error: 'Plan lieu not found' });
    }
    res.json(planLieu);
  } catch (err) {
    console.error('Error getting plan lieu:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Create new plan lieu
 */
exports.createPlanLieu = async (req, res) => {
  const { id_plan, id_delegation } = req.body;

  try {
    const planLieuId = await PlanLieu.create({
      id_plan,
      id_delegation
    });
    res.json({ success: true, planLieuId });
  } catch (err) {
    console.error('Error creating plan lieu:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update plan lieu
 */
exports.updatePlanLieu = async (req, res) => {
  const planLieuId = req.params.id;
  const { id_plan, id_delegation } = req.body;

  try {
    await PlanLieu.update(planLieuId, { id_plan, id_delegation });
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating plan lieu:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete plan lieu
 */
exports.deletePlanLieu = async (req, res) => {
  const planLieuId = req.params.id;

  try {
    await PlanLieu.delete(planLieuId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting plan lieu:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
