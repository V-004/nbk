const express = require('express');
const router = express.Router();
const { Device, SecurityAlert } = require('../models');

// GET SECURITY ALERTS (Real Implementation)
router.get('/alerts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const alerts = await SecurityAlert.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(alerts);
    } catch (err) {
        console.error("Error fetching alerts:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET CONNECTED DEVICES
router.get('/devices/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Populate if empty
        const count = await Device.count({ where: { userId } });
        if (count === 0) {
            await Device.create({
                userId,
                deviceName: 'Windows PC (Chrome)',
                ipAddress: '192.168.1.5',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                isCurrent: true
            });
        }

        const devices = await Device.findAll({ where: { userId }, order: [['lastActive', 'DESC']] });

        // Map to expected frontend format
        const formatted = devices.map(d => ({
            id: d.id,
            name: d.deviceName,
            lastActive: d.lastActive,
            isCurrent: d.isCurrent,
            ip: d.ipAddress
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE DEVICE
router.delete('/devices/:id', async (req, res) => {
    try {
        await Device.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Device removed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove device' });
    }
});

module.exports = router;
