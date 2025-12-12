const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    type: {
        type: DataTypes.ENUM('Savings', 'Current'),
        defaultValue: 'Savings'
    },
    isFrozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Account;
