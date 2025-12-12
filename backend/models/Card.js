const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Card = sequelize.define('Card', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('VIRTUAL', 'PHYSICAL'),
        defaultValue: 'VIRTUAL'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'BLOCKED', 'FROZEN'),
        defaultValue: 'ACTIVE'
    },
    dailyLimit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 10000.00
    }
});

module.exports = Card;
