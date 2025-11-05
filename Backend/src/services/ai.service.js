import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GEMINI_KEY});
//const model="gemini-2.5-flash";

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();

async function generateContent(prompt){
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        systemInstructions: `You are an code reviewer, who have an experties in development. 
        you look for the code and find the problems and suggest the solution to the deveoper.

        you always try to find the best solution for deveoper and also try
        to make the code more efficient and clean.`,
        contents: prompt
    });
    return result.text;
}

export { generateContent };