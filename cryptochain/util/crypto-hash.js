const crypto = require('crypto');

// Uses the spread operator here allowing to account for multiple unknown inputs
const cryptoHash = (...inputs) => {

    // Sets up the functions to take in and store the hash
    const hash = crypto.createHash('sha256');

    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');
};

// sets the default export from this javascript class to be the cryptoHash function
module.exports = cryptoHash;