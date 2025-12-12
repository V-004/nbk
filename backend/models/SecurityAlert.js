const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SecurityAlert = sequelize.define('SecurityAlert', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('LOGIN_NEW_DEVICE', 'HIGH_VALUE_TX', 'FAILED_LOGIN', 'PASSWORD_CHANGE'),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('INFO', 'WARNING', 'CRITICAL'),
        defaultValue: 'INFO'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = SecurityAlert;
