const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain{
    constructor() {
        // Adds the genesis block to begin the blockchain
        this.chain = [Block.genesis()];
    }

    // Adds the block to the overall chain. Called in various other methods
    addBlock({ data }){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    // replaces the chain if it is valid
    replaceChain(chain){
        if(chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        console.log('replacing chain with', chain);
        this.chain = chain;
    }

    // checks that a given chain is valid. This can be the current chain or an incoming chain
    static isValidChain(chain) {

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for(let i = 1; i < chain.length; i++){
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];

            const actualLastHash = chain[i-1].hash;

            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data,nonce, difficulty);

            if(hash !== validatedHash) return false;

            if(Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }

}

module.exports = Blockchain;