const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateContent(code) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key is missing in .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 'gemini-pro' is the safest bet for free tier
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Review this code and output ONLY valid JSON. 
    Do not write introductions like "Here is the JSON". 
    Required format:
    {
      "bugs": [{"title": "", "severity": "Low|Medium|High|Critical", "description": "", "line": "", "suggestion": ""}],
      "improvements": [{"title": "", "severity": "", "description": "", "line": "", "suggestion": ""}],
      "security": [{"title": "", "severity": "", "description": "", "line": "", "suggestion": ""}]
    }

    Code to review:
    ${code}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // --- DEBUG LOG: See what the AI actually sent ---
        console.log("🔴 Raw AI Response:", text); 

        // --- ROBUST CLEANING: Find the first '{' and last '}' ---
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("AI did not return a JSON object");
        }

        const cleanJson = text.substring(jsonStart, jsonEnd + 1);
        
        // Verify it parses before sending
        JSON.parse(cleanJson); 

        return cleanJson;

    } catch (error) {
        console.error("❌ AI Service Error:", error);
        
        // Fallback: If AI fails, return a valid empty JSON so frontend doesn't crash
        return JSON.stringify({
            bugs: [{ title: "Analysis Error", severity: "High", description: "AI response format error. Check backend logs.", suggestion: "Try again." }],
            improvements: [],
            security: []
        });
    }
}

module.exports = { generateContent };