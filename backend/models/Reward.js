const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reward = sequelize.define('Reward', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reason: {
            type: DataTypes.STRING, // e.g., 'Login Bonus', 'Transfer Reward'
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('EARN', 'SPEND'),
            defaultValue: 'EARN'
        }
    });

    return Reward;
};
