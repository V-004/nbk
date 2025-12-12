const sequelize = require('../config/database');
const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');

const Card = require('./Card');
const Beneficiary = require('./Beneficiary');
const SupportTicket = require('./SupportTicket');
const Device = require('./Device')(sequelize);
const Reward = require('./Reward')(sequelize);
const SecurityAlert = require('./SecurityAlert');

// Associations
User.hasMany(Account, { foreignKey: 'userId' });
Account.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Card, { foreignKey: 'userId' });
Card.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Beneficiary, { foreignKey: 'userId' });
Beneficiary.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SupportTicket, { foreignKey: 'userId' });
SupportTicket.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Device, { foreignKey: 'userId' });
Device.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Reward, { foreignKey: 'userId' });
Reward.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SecurityAlert, { foreignKey: 'userId' });
SecurityAlert.belongsTo(User, { foreignKey: 'userId' });

// Transactions are linked to Accounts, not Users directly
Account.hasMany(Transaction, { as: 'SentTransactions', foreignKey: 'senderAccountId' });
Account.hasMany(Transaction, { as: 'ReceivedTransactions', foreignKey: 'receiverAccountId' });

Transaction.belongsTo(Account, { as: 'Sender', foreignKey: 'senderAccountId' });
Transaction.belongsTo(Account, { as: 'Receiver', foreignKey: 'receiverAccountId' });

module.exports = {
    sequelize,
    User,
    Account,
    Transaction,
    Card,
    Beneficiary,
    SupportTicket,
    Device,
    Reward,
    SecurityAlert
};
