const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

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
        const {difficulty} = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    static adjustDifficulty ({ originalBlock, timestamp }){
        const { difficulty } = originalBlock;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

// Exports the block constructor so blocks can be built and used in other pieces of code
module.exports = block;