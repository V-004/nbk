const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    apiId: {
        type: String, // e.g., 'kyc_verify', 'fraud_shield'
        required: true,
        unique: true
    },
    features: [{
        type: String
    }],
    period: {
        type: String,
        default: '/month'
    },
    icon: {
        type: String, // Store icon name or generic type
        default: 'Zap'
    },
    isPopular: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
