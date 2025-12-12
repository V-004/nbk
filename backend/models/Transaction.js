const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    senderAccountId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    receiverAccountId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'General', 'Transfer'),
        defaultValue: 'General'
    },
    type: {
        type: DataTypes.ENUM('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'QR_PAY', 'NFC_PAY'),
        defaultValue: 'TRANSFER'
    },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'PENDING', 'FAILED'),
        defaultValue: 'PENDING'
    },
    referenceId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    metadata: {
        type: DataTypes.TEXT, // JSON string for extra details
        allowNull: true
    }
});

module.exports = Transaction;
