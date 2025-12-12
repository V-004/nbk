const express = require('express');
const router = express.Router();
const { Reward, User } = require('../models');
const { sequelize } = require('../models');

// GET POINTS SUMMARY
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Calculate Total
        const rewards = await Reward.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });

        // Sum points: Earn = +, Spend = -
        const totalPoints = rewards.reduce((acc, r) => {
            return acc + (r.type === 'EARN' ? r.points : -r.points);
        }, 0);

        // Determine Tier
        let tier = 'BRONZE';
        if (totalPoints > 1000) tier = 'SILVER';
        if (totalPoints > 5000) tier = 'GOLD';
        if (totalPoints > 10000) tier = 'PLATINUM';

        // Mock some initial points if (0) for demo engagement
        if (rewards.length === 0) {
            // For demo, let's treat new users as having a "Welcome Bonus" available to claim? 
            // Or just return 0.
        }

        res.json({
            totalPoints,
            tier,
            history: rewards
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// EARN POINTS (Internal or Demo Trigger)
router.post('/earn', async (req, res) => {
    try {
        const { userId, points, reason } = req.body;

        const reward = await Reward.create({
            userId,
            points,
            reason,
            type: 'EARN'
        });

        res.json(reward);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
