const express = require('express');
const router = express.Router();
const gouvernoratController = require('../controllers/gouvernoratController');

router.get('/', gouvernoratController.getAllGovernorats);
router.get('/:id', gouvernoratController.getGovernorat);
router.get('/:id/delegations', gouvernoratController.getGovernoratWithDelegations);
router.post('/', gouvernoratController.createGovernorat);
router.put('/:id', gouvernoratController.updateGovernorat);
router.delete('/:id', gouvernoratController.deleteGovernorat);

module.exports = router;
