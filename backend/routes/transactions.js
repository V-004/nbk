const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Transaction, Account, User } = require('../models_mongo');

// GET TRANSACTIONS
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // In MongoDB, userId in Account is a String (ref to User._id)
        const account = await Account.findOne({ userId });
        if (!account) return res.status(404).json({ error: 'Account not found' });

        // Find transactions where sender OR receiver is this account
        const transactions = await Transaction.find({
            $or: [
                { senderAccountId: account._id.toString() },
                { receiverAccountId: account._id.toString() }
            ]
        }).sort({ createdAt: -1 });

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// TRANSFER MONEY (SIMPLE - NO ACID)
router.post('/transfer', async (req, res) => {
    try {
        const { toAccountNumber, amount, category = 'Transfer', note } = req.body;

        // FIND SENDER
        const senderAccount = await Account.findOne().sort({ balance: -1 });

        // FIND RECEIVER
        const receiverAccount = await Account.findOne({ accountNumber: toAccountNumber });

        if (!senderAccount) throw new Error('Sender account not found');

        // External transfer check
        if (!receiverAccount && !toAccountNumber.startsWith('UPI-')) {
            throw new Error('Receiver account not found');
        }

        if (senderAccount.balance < parseFloat(amount)) {
            throw new Error('Insufficient Funds');
        }

        // 1. Deduct
        senderAccount.balance -= parseFloat(amount);
        await senderAccount.save();

        // 2. Add (if internal)
        let receiverId = null;
        if (receiverAccount) {
            receiverAccount.balance += parseFloat(amount);
            await receiverAccount.save();
            receiverId = receiverAccount._id.toString();
        }

        // 3. Create Record
        const newTx = new Transaction({
            userId: senderAccount.userId,
            type: 'TRANSFER',
            amount,
            description: note || `Transfer to ${toAccountNumber}`,
            senderAccountId: senderAccount._id.toString(),
            receiverAccountId: receiverId,
            category: category,
            status: 'COMPLETED'
        });
        await newTx.save();

        // Real-time Update (Mock IO)
        if (req.io) {
            req.io.emit('transaction_update', {
                balance: senderAccount.balance,
                transaction: newTx
            });
        }

        res.json({ message: 'Transfer successful', transaction: newTx });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PAY BILLS / QR (SIMPLE)
router.post('/pay', async (req, res) => {
    try {
        const { amount, merchant, category = 'General' } = req.body;

        const senderAccount = await Account.findOne().sort({ balance: -1 });

        if (!senderAccount || senderAccount.balance < parseFloat(amount)) {
            throw new Error('Insufficient Funds');
        }

        senderAccount.balance -= parseFloat(amount);
        await senderAccount.save();

        const newTx = new Transaction({
            userId: senderAccount.userId,
            type: 'DEBIT',
            amount,
            description: `Payment to ${merchant}`,
            senderAccountId: senderAccount._id.toString(),
            category: category,
            status: 'COMPLETED'
        });
        await newTx.save();

        if (req.io) {
            req.io.emit('transaction_update', {
                balance: senderAccount.balance,
                transaction: newTx
            });
        }

        res.json({ message: 'Payment successful', transaction: newTx });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
