const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    console.log("Checking Available Gemini Models...");
    console.log("Using Key:", process.env.GEMINI_API_KEY ? "Found (Length: " + process.env.GEMINI_API_KEY.length + ")" : "MISSING");

    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        return;
    }

    try {
        // Fallback to fetch if SDK listModels is tricky to invoke directly without full client setup
        // But SDK has it:
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // This SDK version might not expose listModels directly on the main class easily?
        // Let's try raw fetch first as it's most reliable for debugging network/key issues.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("\n--- AVAILABLE MODELS ---");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (err) {
        console.error("FAILED to list models:", err.message);
    }
}

listModels();
