const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');
const hexToBinary = require('hex-to-binary');

// Class definition and defines the constructor with the parameters used to make a block
class block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    // defines genesis as a static function allowing us to call it essentially out of scope
    static genesis() {

        // this static function returns an instance of the class its in using the this keyword.
        // In this case it returns a genesis block object populated with the genesis data
        return new this(GENESIS_DATA);
    }


    // The mineblock method performs proof of work and returns the newly mined block
    static mineBlock({ lastBlock, data}){

        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let nonce = 0;

        // loops through and increases or decreases difficulty for mining proccess
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    // Adjust the difficulty in a dynamic way so a block always takes a reasonable amount of time to mine
    static adjustDifficulty ({ originalBlock, timestamp }){

        // stores the difficulty of the original block in a variable
        const { difficulty } = originalBlock;

        // Prevents the difficulty from dropping below zero as it must always hve a difficulty
        if (difficulty < 1) return 1;

        // decreases the diffuclty if the time diffence between block mining is too difficult
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        // else it will increase the difficulty
        return difficulty + 1;
    }
}

// Exports the block constructor so blocks can be built and used in other pieces of code
module.exports = block;