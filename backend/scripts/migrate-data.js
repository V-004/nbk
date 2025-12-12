const { sequelize, User: SqlUser, Account: SqlAccount, Transaction: SqlTransaction, Card: SqlCard } = require('../models');
const { User: MongoUser, Account: MongoAccount, Transaction: MongoTransaction, Card: MongoCard } = require('../models_mongo');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const migrate = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB.');

        console.log('🔄 Connecting to SQLite (Sequelize)...');
        await sequelize.authenticate();
        console.log('✅ Connected to SQLite.');

        // 1. CLEAR MONGODB
        console.log('🧹 Clearing old MongoDB data...');
        await MongoTransaction.deleteMany({});
        await MongoCard.deleteMany({});
        await MongoAccount.deleteMany({});
        await MongoUser.deleteMany({});
        console.log('✅ MongoDB cleared.');

        // 2. MIGRATE USERS
        console.log('🚀 Migrating Users...');
        const sqlUsers = await SqlUser.findAll();
        for (const u of sqlUsers) {
            const userData = u.toJSON();
            // Preserve UUID
            await MongoUser.create({
                _id: userData.id,
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                phoneNumber: userData.phoneNumber,
                role: userData.role,
                kycStatus: userData.kycStatus || 'PENDING',
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                // Handle JSON strings if needed (SQLite stored them as Text?)
                // If they were text in SQLite, they come as strings. Mongo schema expects Strings for faceData/voiceData too.
                faceData: userData.faceData,
                voiceData: userData.voiceData
            });
        }
        console.log(`✅ Migrated ${sqlUsers.length} Users.`);

        // 3. MIGRATE ACCOUNTS
        console.log('🚀 Migrating Accounts...');
        const sqlAccounts = await SqlAccount.findAll();
        for (const a of sqlAccounts) {
            const accData = a.toJSON();
            await MongoAccount.create({
                _id: accData.id,
                userId: accData.userId,
                accountNumber: accData.accountNumber,
                balance: parseFloat(accData.balance), // Ensure number
                type: accData.type,
                isFrozen: accData.isFrozen,
                pin: accData.pin, // Assuming encrypted
                createdAt: accData.createdAt,
                updatedAt: accData.updatedAt
            });
        }
        console.log(`✅ Migrated ${sqlAccounts.length} Accounts.`);

        // 4. MIGRATE CARDS
        console.log('🚀 Migrating Cards...');
        const sqlCards = await SqlCard.findAll();
        for (const c of sqlCards) {
            const cardData = c.toJSON();
            await MongoCard.create({
                // _id: cardData.id, // Optional: Preserve ID if you want. Mongo creates one otherwise.
                // Let's preserve if UUID to be safe? 
                // Card schema in Mongo doesn't enforce UUID _id (uses default ObjectId). 
                // So we SKIP _id and let Mongo generate a new one, unless Card ID is referenced elsewhere?
                // It is not heavily ref'd. So new ID is fine.
                userId: cardData.userId,
                cardNumber: cardData.cardNumber,
                cvv: cardData.cvv,
                expiryDate: cardData.expiryDate,
                type: cardData.type,
                status: cardData.status,
                createdAt: cardData.createdAt
            });
        }
        console.log(`✅ Migrated ${sqlCards.length} Cards.`);

        // 5. MIGRATE TRANSACTIONS
        console.log('🚀 Migrating Transactions...');
        const sqlTrans = await SqlTransaction.findAll();
        for (const t of sqlTrans) {
            const txData = t.toJSON();
            await MongoTransaction.create({
                // New ID for transactions (Sequence/UUID mismatch doesn't matter much here)
                userId: txData.userId,
                type: txData.type,
                amount: parseFloat(txData.amount),
                currency: 'INR', // Default to INR now
                description: txData.description,
                senderAccountId: txData.senderAccountId,
                receiverAccountId: txData.receiverAccountId, // UUID strings should match Account _ids
                category: txData.category,
                status: txData.status || 'COMPLETED',
                createdAt: txData.createdAt
            });
        }
        console.log(`✅ Migrated ${sqlTrans.length} Transactions.`);

        console.log('🎉 COMPLETED MIGRATION SUCCESSFULLY!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
};

migrate();
