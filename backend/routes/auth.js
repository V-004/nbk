const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// SWITCH TO MONGODB MODELS
const { User, Account } = require('../models_mongo');

// Function to generate Account Number
const generateAccountNumber = () => 'ACCT' + Math.floor(1000000000 + Math.random() * 9000000000);
// Function to generate IFSC
const generateIFSC = () => 'NEXUS' + Math.floor(1000 + Math.random() * 9000);

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber } = req.body;

        // Check email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        // Check phone (only if provided and not empty)
        if (phoneNumber && phoneNumber.trim() !== '') {
            const existingPhone = await User.findOne({ phoneNumber });
            if (existingPhone) return res.status(400).json({ error: 'Phone number already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE USER (MongoDB)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber: (phoneNumber && phoneNumber.trim() !== '') ? phoneNumber : undefined,
            kycStatus: "PENDING"
        });
        await newUser.save();

        // CREATE ACCOUNT (MongoDB)
        const newAccount = new Account({
            userId: newUser._id, // Use _id (UUID string)
            accountNumber: generateAccountNumber(),
            ifscCode: generateIFSC(),
            balance: 1000.00,
            type: 'Savings'
        });
        await newAccount.save();

        res.status(201).json({ message: 'User registered successfully (MongoDB)', userId: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                hasFaceId: !!user.faceData,
                hasVoiceId: !!user.voiceData,
                kycStatus: user.kycStatus,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ENROLL FACE
router.post('/enroll-face', async (req, res) => {
    try {
        const { userId, faceDescriptor } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let existingData = [];
        if (user.faceData) {
            try {
                const parsed = JSON.parse(user.faceData);
                // Check if it's a 1D array (old format) or 2D array (new format)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    if (Array.isArray(parsed[0])) {
                        existingData = parsed; // Already 2D
                    } else {
                        existingData = [parsed]; // Convert old 1D to 2D
                    }
                }
            } catch (e) {
                console.error("Error parsing face data", e);
                // Overwrite corrupt data
            }
        }

        // Limit to 5 enrollments
        if (existingData.length >= 5) {
            // Optional: remove oldest? Or just fail? 
            // Let's remove oldest (shift) to allow updating
            existingData.shift();
        }

        existingData.push(faceDescriptor);

        user.faceData = JSON.stringify(existingData);
        await user.save();

        res.json({ message: `Face enrolled successfully. Total scans: ${existingData.length}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// ENROLL VOICE
router.post('/enroll-voice', async (req, res) => {
    try {
        const { userId, voiceData } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.voiceData = JSON.stringify(voiceData);
        await user.save();

        res.json({ message: 'Voice enrolled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// BIOMETRIC LOGIN
router.post('/login-face', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.faceData) {
            return res.status(404).json({ error: 'User not found or Face ID not setup' });
        }

        res.json({
            challenge: 'MATCH_REQUEST',
            faceData: JSON.parse(user.faceData),
            userId: user._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/login-face-verify', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// REQUEST OTP
router.post('/request-otp', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[OTP] Sending 123456 to ${email}`);
        await new Promise(r => setTimeout(r, 500));
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// VERIFY 2FA
router.post('/verify-2fa', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (otp === '123456') {
            res.json({ message: 'OTP verified', valid: true });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// LOGOUT
router.post('/logout', async (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
