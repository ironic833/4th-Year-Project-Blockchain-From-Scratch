const crypto = require('crypto');

// Uses the spread operator here allowing to account for multiple unknown inputs
const cryptoHash (...inputs) => {
    const hash = crypto.createHash('sha256');
};

module.exports = cryptoHash;