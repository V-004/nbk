const User = require('./User');
const Account = require('./Account');

module.exports = {
    User,
    Account,
    Transaction: require('./Transaction'),
    Card: require('./Card')
};
