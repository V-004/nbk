const express = require('express');
const router = express.Router();
const { Product, Subscription, User, Account, Transaction } = require('../models_mongo');
const { v4: uuidv4 } = require('uuid');

// GET /products - List all available products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /subscriptions - Get current user's subscriptions
router.post('/subscriptions', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const subs = await Subscription.find({ userId: user._id }).populate('productId');
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

// POST /subscribe - Purchase a subscription
router.post('/subscribe', async (req, res) => {
    try {
        const { email, apiId } = req.body;

        // 1. Validate User & Product
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const product = await Product.findOne({ apiId });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // 2. Check for existing active subscription
        const existing = await Subscription.findOne({ userId: user._id, apiId, status: 'active' });
        if (existing) {
            return res.status(400).json({ error: 'You already have an active subscription for this product.' });
        }

        // 3. Check Balance
        const account = await Account.findOne({ userId: user._id });
        if (!account) return res.status(404).json({ error: 'Account not found' });

        if (account.balance < product.price) {
            return res.status(400).json({ error: `Insufficient funds. Balance: ₹${account.balance}, Required: $${product.price} (approx ₹${product.price * 84})` });
        }

        // Note: Assuming 1 USD = 84 INR for simplicity in mock environment
        const costInInr = product.price * 84;

        if (account.balance < costInInr) {
            return res.status(400).json({ error: `Insufficient funds. Balance: ₹${account.balance}, Cost: ₹${costInInr}` });
        }

        // 4. Deduct Funds & Record Transaction
        account.balance -= costInInr;
        await account.save();

        await Transaction.create({
            senderAccountId: account._id,
            amount: costInInr,
            type: 'DEBIT',
            category: 'Subscription',
            description: `Subscription: ${product.name}`,
            status: 'COMPLETED'
        });

        // 5. Create Subscription with API Key
        const apiKey = `nbk_${uuidv4().replace(/-/g, '')}`;

        const sub = await Subscription.create({
            userId: user._id,
            productId: product._id,
            apiId: product.apiId,
            apiKey: apiKey,
            status: 'active',
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        });

        res.json({
            success: true,
            message: `Successfully subscribed to ${product.name}`,
            subscription: sub
        });

    } catch (err) {
        console.error("Subscription Error:", err);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

module.exports = router;
