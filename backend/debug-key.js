const path = require('path');
const dotenv = require('dotenv');

// Explicitly load .env from this directory
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

console.log("--- DEBUGGING API KEY ---");
console.log("Looking for .env at:", envPath);

if (result.error) {
    console.log("ERROR: Could not load .env file!");
    console.log(result.error);
} else {
    console.log("SUCCESS: .env file found and parsed.");
}

const key = process.env.GEMINI_API_KEY;
if (key) {
    console.log("API Key Status: FOUND");
    console.log("Key Length:", key.length);
    console.log("First 5 chars:", key.substring(0, 5));
} else {
    console.log("API Key Status: NOT FOUND (undefined or empty)");
}
console.log("-------------------------");
