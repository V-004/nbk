const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    cardNumber: { type: String, required: true, unique: true },
    expiryDate: { type: Date, required: true },
    cvv: { type: String, required: true },
    type: { type: String, enum: ['PHYSICAL', 'VIRTUAL'], default: 'VIRTUAL' },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED', 'FROZEN'], default: 'ACTIVE' },
    limit: { type: Number, default: 50000 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema);
