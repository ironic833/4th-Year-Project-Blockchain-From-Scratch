const { GENESIS_DATA } = require('./config');

// Class definition and defines the constructor with the parameters used to make a block
class block {
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    // defines genesis as a static function allowing us to call it essentially out of scope
    static genesis() {

        // this static function returns an instance of the class its in using the this keyword
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data}){
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data
        })
    }
}

// Exports the block constructor so blocks can be built and used in other pieces of code
module.exports = block;