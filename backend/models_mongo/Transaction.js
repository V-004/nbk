const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, // Store as String (UUID) to match User._id
    type: { type: String, enum: ['DEBIT', 'CREDIT', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT', 'PAYMENT'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    category: { type: String, default: 'General' },
    description: { type: String },
    senderAccountId: { type: String }, // Store Account _id string
    receiverAccountId: { type: String }, // Store Account _id string
    status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
