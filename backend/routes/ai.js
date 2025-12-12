const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "invalid_key");

const { User, Account, Transaction } = require('../models_mongo');

// CHATBOT INTERACTION
router.post('/chat', async (req, res) => {
    try {
        const { message, email } = req.body; // Expect email to context

        let context = "";

        // Fetch recent transactions if email provided
        if (email) {
            const user = await User.findOne({ email });
            if (user) {
                const account = await Account.findOne({ userId: user._id.toString() });
                if (account) {
                    const transactions = await Transaction.find({ senderAccountId: account._id.toString() })
                        .sort({ createdAt: -1 })
                        .limit(5);

                    if (transactions.length > 0) {
                        context = "RECENT TRANSACTIONS:\n" + transactions.map(t =>
                            `- ${t.type} of ₹${t.amount} for ${t.category} on ${t.createdAt}`
                        ).join('\n');
                    }
                    context += `\nCURRENT BALANCE: ₹${account.balance}`;
                }
            }
        }

        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                const prompt = `You are NexusBank Assistant, a helpful and polyglot banking AI.
                
                ${context}
                
                Supported Languages: English, Hindi, Kannada, Tamil, Telugu, Bengali, Marathi.
                You understand mixed-code input (e.g., "Hinglish", "Kanglish").
                
                If the user speaks in an Indian language, reply in that same language (or English if requested).
                Be concise and helpful.

                Available Internal Routes (use "action": "navigate"):
                - /dashboard (Home)
                - /dashboard/accounts (Accounts)
                - /dashboard/payments (Transfer/Pay)
                - /dashboard/cards (Manage Cards)
                - /dashboard/transactions (History)
                - /dashboard/support (Support)
                - /login (Sign In)
                
                External Capabilities (use "action": "open_tab"):
                - Documentation (https://nextjs.org/docs)
                
                User Query: "${message}"

                Instructions:
                1. Answer the query concisely. Use the provided transaction context if meaningful.
                2. If user wants to navigate internally, set "action": "navigate", "payload": "route".
                3. If user wants external link, set "action": "open_tab", "payload": "URL".
                4. Return ONLY a valid JSON object: { "reply": "...", "action": "navigate"|"open_tab"|null, "payload": "..."|null }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                return res.json(JSON.parse(text));
            } catch (apiError) {
                console.error("Gemini API Error (Falling back to Mock):", apiError.message);
                // Fall through to mock logic below
            }
        }

        // FALLBACK MOCK LOGIC (Executed if Key missing OR API failed)
        let reply = "I'm sorry, I didn't verify that.";
        if (message.toLowerCase().includes('balance')) {
            reply = "You can view your balance on the dashboard.";
        } else {
            reply = "I am currently in Offline Mode.";
        }

        res.json({ reply });

    } catch (err) {
        console.error("AI CRASH:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorStack = err instanceof Error ? err.stack : 'No stack';

        res.status(500).json({
            error: `AI CRASH [${Date.now()}]: ${errorMessage}`,
            details: errorStack
        });
    }
});

// VOICE COMMAND ENDPOINT
router.post('/command', upload.single('audio'), async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ action: 'TOAST', message: 'AI Key missing' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No audio' });
        }

        const audioBase64 = req.file.buffer.toString('base64');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are a banking assistant. Listen to the user command and map it to a JSON action.
            
            Possible actions:
            - "NAVIGATE": if user wants to go somewhere. payload: path (e.g., "/dashboard", "/dashboard/payments")
            - "TOAST": if user asks a general question. payload: short text answer.
            
            Examples:
            "Go to transfers" -> { "action": "NAVIGATE", "payload": "/dashboard/payments" }
            "Take me home" -> { "action": "NAVIGATE", "payload": "/dashboard" }
            "Hello" -> { "action": "TOAST", "payload": "Hello! How can I help?" }
            
            Respond ONLY with the JSON.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "audio/mp3",
                    data: audioBase64
                }
            }
        ]);

        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const command = JSON.parse(cleanJson);

        res.json(command);

    } catch (err) {
        console.error("Voice command error:", err);
        res.status(500).json({ error: 'Failed to process command' });
    }
});

// ANALYZE SPENDING ENDPOINT
router.post('/analyze-spending', async (req, res) => {
    try {
        const { userId } = req.body;

        // 1. Fetch Data
        const account = await Account.findOne({ userId });
        if (!account) return res.status(404).json({ error: 'Account not found' });

        const transactions = await Transaction.find({ senderAccountId: account._id.toString() })
            .sort({ createdAt: -1 })
            .limit(50);

        if (transactions.length === 0) {
            return res.json({
                healthScore: 100,
                praise: "You haven't spent anything yet! Great start (technically).",
                warning: "No activity detected.",
                tip: "Start using your account to get personalized insights."
            });
        }

        // 2. Aggregate Data
        const categoryTotals = {};
        let totalSpent = 0;

        transactions.forEach(t => {
            if (t.type === 'DEBIT' || t.type === 'TRANSFER') {
                const cat = t.category || 'General';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(t.amount);
                totalSpent += parseFloat(t.amount);
            }
        });

        // 3. AI Analysis
        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                healthScore: 85,
                praise: "Spending is within limits (Mock Analysis).",
                warning: "High spending detected in Food (Mock).",
                tip: "Try cooking at home more often (Mock)."
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            You are a stern but helpful financial advisor. Analyze this spending data for a user.
            
            Total Spent: ₹${totalSpent.toFixed(2)}
            Breakdown by Category: ${JSON.stringify(categoryTotals)}
            Current Balance: ₹${account.balance}
            
            Provide a response in strictly valid JSON format:
            {
                "healthScore": (number 0-100),
                "praise": (short sentence praising good habit),
                "warning": (short sentence warning about a bad habit or high category),
                "tip": (actionable 1-sentence tip)
            }
            Do not include markdown or code blocks. Just the JSON string.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(cleanJson));

    } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ error: 'Failed to analyze spending' });
    }
});

module.exports = router;
