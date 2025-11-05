const express= require('express');
const aiController=require('../controllers/ai.controller');

const router= express.Router();

router.get('/get-ai-response', aiController.getResponse);

module.exports = router;