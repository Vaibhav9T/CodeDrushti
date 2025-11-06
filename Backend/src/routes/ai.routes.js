const express= require('express');
const aiController=require('../controllers/ai.controller');

const router= express.Router();

router.post('https://ai-powered-code-review-5fz0.onrender.com/get-review', aiController.getReview);

module.exports = router;