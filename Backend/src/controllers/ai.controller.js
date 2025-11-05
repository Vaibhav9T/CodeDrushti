// ...existing code...
const aiService = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
    console.log('headers:', req.headers);
    console.log('body:', req.body);

    let code = (req.body && req.body.code) || (req.query && req.query.code);

    // if body arrived as raw text, try to parse JSON or use it directly
    if (!code && typeof req.body === 'string') {
        try {
            const parsed = JSON.parse(req.body);
            code = parsed.code;
        } catch {
            // treat raw body as the code itself
            code = req.body;
        }
    }

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const response = await aiService.generateContent(code);
        return res.status(200).json({ data: response });
    } catch (err) {
        console.error('ai.controller.getReview error:', err);
        return res.status(500).json({ error: 'Failed to generate content' });
    }
};