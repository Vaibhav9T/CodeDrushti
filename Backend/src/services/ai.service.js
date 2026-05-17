const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateContent(code) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("CRITICAL: GEMINI_API_KEY is not defined in environment variables.");
        throw new Error("API_KEY_MISSING");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // FORCE Gemini to output strict, machine-readable JSON
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
    Analyze this code and return ONLY a valid JSON object matching this exact schema. Do not add markdown.
    {
      "bugs": [{"title": "", "severity": "Critical|High|Medium|Low", "description": "", "line": "", "suggestion": ""}],
      "improvements": [{"title": "", "severity": "Info", "description": "", "line": "", "suggestion": ""}],
      "security": [{"title": "", "severity": "Critical|High", "description": "", "line": "", "suggestion": ""}]
    }
    Code to analyze:
    ${code}
    `;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Remove markdown formatting if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Because we used responseMimeType, 'text' is guaranteed to be clean JSON
        const parsedData = JSON.parse(text);
        
        // Return the actual object (Express will automatically format it as JSON)
        return parsedData; 

    } catch (error) {
        console.error("AI Generation Failed:", error.message || error);
        
        // Return an object instead of a stringified string for consistency
        return {
            bugs: [{ 
                title: "Analysis Failed", 
                severity: "High", 
                description: "The AI engine failed to process the request.", 
                suggestion: `Backend Error: ${error.message || "Parsing or API failure"}` 
            }],
            improvements: [],
            security: []
        };
    }
}

module.exports = { generateContent };