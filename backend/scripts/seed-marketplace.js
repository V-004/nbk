const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('../config/mongodb');
const { Product } = require('../models_mongo'); // Ensure index.js exports Product

const products = [
    {
        name: "Identity Verification SDK",
        description: "Global KYC/AML compliance with 99.9% accuracy.",
        price: 499,
        apiId: "kyc_verify",
        features: ["200+ Countries", "Biometric Match", "Real-time Docs", "Sanctions Check"],
        icon: "Globe"
    },
    {
        name: "Transactions API",
        description: "Connect to 5,000+ banks for real-time data.",
        price: 299,
        apiId: "tx_api",
        features: ["Real-time Balance", "90-day History", "Unified JSON", "Webhooks"],
        icon: "Zap",
        isPopular: true
    },
    {
        name: "Fraud Shield",
        description: "AI-powered fraud detection and risk scoring.",
        price: 799,
        apiId: "fraud_shield",
        features: ["ML Models", "Device Fingerprint", "Behavioral Analytics", "Chargeback Protection"],
        icon: "Lock"
    },
    {
        name: "Smart Analytics",
        description: "Enrich transaction data with merchant insights.",
        price: 199,
        apiId: "smart_analytics",
        features: ["Merchant Category", "Spending Patterns", "Logo Data", "Sub Detection"],
        icon: "BarChart3"
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        console.log("Clearing existing products...");
        await Product.deleteMany({});

        console.log("Seeding new products...");
        await Product.insertMany(products);

        console.log("✅ Marketplace Seeded Successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
};

seedProducts();
