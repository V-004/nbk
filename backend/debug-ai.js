const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("--- DEBUGGER ---");
console.log("1. Checking .env file...");
if (fs.existsSync(path.resolve(__dirname, '.env'))) {
    console.log("   .env found at backend/.env");
} else {
    console.log("   CRITICAL: .env NOT found at backend/.env");
}

console.log("2. Checking Key...");
const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.log("   CRITICAL: GEMINI_API_KEY is MISSING or empty.");
} else {
    console.log(`   Key found! Length: ${key.length}`);
    console.log(`   Starts with: ${key.substring(0, 4)}...`);
}

console.log("3. Testing API...");
async function test() {
    try {
        const genAI = new GoogleGenerativeAI(key || "INVALID");
        // Try with a known stable model if flash fails
        const modelName = "gemini-flash-latest";
        console.log(`   Model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Say 'Hello' if you can hear me.");
        console.log("   API SUCCESS!");
        console.log("   Response:", result.response.text().trim());
    } catch (err) {
        console.log("   API FAILED!");
        console.log("   Error:", err.message);

        // Suggest fixes
        if (err.message.includes("404")) {
            console.log("\n   [SUGGESTION] Model 'gemini-2.0-flash' might not be available for your key.");
            console.log("   Try changing to 'gemini-1.5-flash' or 'gemini-pro' in backend/routes/ai.js");
        }
    }
}

if (key) test();
