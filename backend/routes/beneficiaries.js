const express = require('express');
const router = express.Router();
const { Beneficiary } = require('../models');

// GET ALL BENEFICIARIES
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const beneficiaries = await Beneficiary.findAll({ where: { userId } });
        res.json(beneficiaries);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// ADD BENEFICIARY
router.post('/add', async (req, res) => {
    try {
        const { userId, name, accountNumber, bankName, ifscCode } = req.body;

        const newBeneficiary = await Beneficiary.create({
            userId,
            name,
            accountNumber,
            bankName,
            ifscCode
        });

        res.status(201).json(newBeneficiary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add beneficiary' });
    }
});

module.exports = router;
