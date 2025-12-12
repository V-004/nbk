const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function listModels() {
    console.log("-----------------------------------------");
    console.log("Checking Available Gemini Models...");
    console.log("Using Key:", process.env.GEMINI_API_KEY ? "Found (Length: " + process.env.GEMINI_API_KEY.length + ")" : "MISSING");

    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        return;
    }

    try {
        // We can't list models directly with the high-level SDK easily in all versions,
        // but let's try a direct fetch to the API endpoint which is often more revealing for 404s.
        // Actually, the SDK might not expose listModels on the client instance directly in older versions?
        // Let's try to just instantiate the client and see if we can hit a basic endpoint.

        // Wait, the error message literally said: "Call ListModels".
        // Use the API KEY to fetch the models list via REST to be safe and dependency-agnostic.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\nSUCCESS! Available Models:");
            data.models.forEach(m => {
                // Filter for generateContent supported models
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name.replace('models/', '')}`);
                }
            });
            console.log("\nPlease tell your AI assistant which model from this list you want to use.");
        } else {
            console.error("\nFAILED to list models. Response:");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Network Error:", error.message);
    }
    console.log("-----------------------------------------");
}

listModels();
