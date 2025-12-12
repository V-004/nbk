const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Use UUID as _id to match old system
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    nfcTagId: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Biometrics
    faceData: { type: String }, // JSON string of descriptors
    voiceData: { type: String }, // JSON string of voice embeddings

    kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },

    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
