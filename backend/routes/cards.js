const express = require('express');
const router = express.Router();
const { Card } = require('../models_mongo');

// Helper to mask card number
const maskCard = (num) => '**** **** **** ' + num.slice(-4);

// GET ALL CARDS FOR USER
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cards = await Card.find({ userId });

        // Don't send full CVV or Number in list
        const safeCards = cards.map(c => ({
            id: c._id,
            ...c.toObject(),
            cardNumber: maskCard(c.cardNumber),
            cvv: '***'
        }));

        res.json(safeCards);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// CREATE CARD
router.post('/create', async (req, res) => {
    try {
        const { userId, type = 'VIRTUAL' } = req.body;

        // Helper to generate random number string
        const generateNum = (len) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');

        // Generate Card Details
        const cardNumber = `400000${generateNum(10)}`;
        const cvv = generateNum(3);
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 3);

        const newCard = new Card({
            userId,
            cardNumber,
            cvv,
            expiryDate,
            type,
            status: 'ACTIVE'
        });
        await newCard.save();

        res.status(201).json(newCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// FREEZE/UNFREEZE
router.post('/:cardId/status', async (req, res) => {
    try {
        const { cardId } = req.params;
        const { status } = req.body; // 'ACTIVE', 'FROZEN'

        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ error: 'Card not found' });

        card.status = status;
        await card.save();

        res.json({ message: `Card status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
