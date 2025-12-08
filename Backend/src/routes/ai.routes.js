const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// URL will be: http://localhost:5000/ai/get-review
router.post('/get-review', aiController.getReview);

module.exports = router;