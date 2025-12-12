const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AccountSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true, ref: 'User' },
    accountNumber: { type: String, required: true, unique: true },
    ifscCode: { type: String, default: 'NEXUS0001' },
    balance: { type: Number, default: 0.00 },
    type: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
    isFrozen: { type: Boolean, default: false },
    pin: { type: String }, // Encrypted PIN for transactions

    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
