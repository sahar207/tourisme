const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/search-suggestions', homeController.getSearchSuggestions);

module.exports = router;
