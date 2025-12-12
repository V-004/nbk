const express = require('express');
const router = express.Router();
const { Account, User, Transaction } = require('../models');

// GET ACCOUNT DETAILS
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const account = await Account.findOne({ where: { userId } });

        if (!account) return res.status(404).json({ error: 'Account not found' });

        res.json(account);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET ACCOUNT STATEMENT (Transactions)
router.get('/:accountId/statement', async (req, res) => {
    try {
        const { accountId } = req.params;

        // Fetch transactions where account is sender OR receiver
        // Sequelize Op.or needed
        const { Op } = require('sequelize');

        const transactions = await Transaction.findAll({
            where: {
                [Op.or]: [
                    { senderAccountId: accountId },
                    { receiverAccountId: accountId }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
