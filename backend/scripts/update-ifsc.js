require('dotenv').config();
const mongoose = require('mongoose');
const { Account } = require('../models_mongo');

const updateIFSC = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const accounts = await Account.find({ ifscCode: { $exists: false } });
        console.log(`Found ${accounts.length} accounts without IFSC code.`);

        for (const acc of accounts) {
            acc.ifscCode = 'NEXUS' + Math.floor(1000 + Math.random() * 9000);
            await acc.save();
            console.log(`Updated Account ${acc.accountNumber} with IFSC ${acc.ifscCode}`);
        }

        console.log('Update Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateIFSC();
