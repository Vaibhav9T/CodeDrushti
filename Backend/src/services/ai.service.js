const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateContent(code) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this code and return ONLY a valid JSON object. Do not include markdown formatting or explanation outside the JSON.
    Format:
    {
      "bugs": [{"title": "", "severity": "Critical|High|Medium|Low", "description": "", "line": "", "suggestion": ""}],
      "improvements": [{"title": "", "severity": "Info", "description": "", "line": "", "suggestion": ""}],
      "security": [{"title": "", "severity": "Critical|High", "description": "", "line": "", "suggestion": ""}]
    }
    Code:
    ${code}
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) throw new Error("INVALID_AI_RESPONSE");

        const cleanJson = text.substring(jsonStart, jsonEnd + 1);
        JSON.parse(cleanJson);
        return cleanJson;
    } catch (error) {
        console.error(error);
        return JSON.stringify({
            bugs: [{ title: "Analysis Failed", severity: "High", description: "The AI engine failed to process the request.", suggestion: "Check syntax and retry." }],
            improvements: [],
            security: []
        });
    }
}

module.exports = { generateContent };