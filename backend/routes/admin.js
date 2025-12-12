const express = require('express');
const router = express.Router();
const { User, Account } = require('../models');
const { auth, admin } = require('../middleware/auth');

// PROTECT ALL ROUTES
router.use(auth);
router.use(admin);

// GET ALL USERS
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullName', 'email', 'role', 'kycStatus', 'phoneNumber', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// VERIFY KYC
router.post('/verify-kyc/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        user.kycStatus = status;
        await user.save();

        res.json({ message: `User KYC ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// FREEZE ACCOUNT
router.post('/freeze/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.kycStatus = user.kycStatus === 'SUSPENDED' ? 'VERIFIED' : 'SUSPENDED';
        await user.save();

        res.json({ message: `User status set to ${user.kycStatus}` });
    } catch (err) {
        res.status(500).json({ error: 'Action failed' });
    }
});

module.exports = router;
