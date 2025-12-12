const express = require('express');
const router = express.Router();
const { SupportTicket } = require('../models');

// GET ALL TICKETS FOR USER
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const tickets = await SupportTicket.findAll({ where: { userId } });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// CREATE TICKET
router.post('/create', async (req, res) => {
    try {
        const { userId, subject, message } = req.body;

        const newTicket = await SupportTicket.create({
            userId,
            subject,
            message,
            status: 'OPEN'
        });

        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

module.exports = router;
