const aiService = require('../services/ai.service');

module.exports.getResponse = async (req, res) => {
    const prompt = req.query.prompt ?? req.body?.prompt;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    try {
        const response = await aiService.generateContent(prompt);
        return res.status(200).json({ data: response });
    } catch (err) {
        console.error('ai.controller.getResponse error:', err);
        return res.status(500).json({ error: 'Failed to generate content' });
    }
};

