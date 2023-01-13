const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config.js');
const cryptoHash = require('./crypto-hash');

// This lays out the definitions and requirements for the block as a whole throughout the program
// Describe keyword just lets me group tests. This is a new keyword to me I didn't cover in the 
// codecademy course
describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];

    const nonce = 1;
    const difficulty = 1;

    // Defines the parameters required when the new block constructor is called
    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty
    });

    // checks this test definition against a block to ensure that the block is correct
    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    // Describes the definitions to verify the gensis block against
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        // Logs the genesis block to console
        console.log('genesisBlock', genesisBlock);

        // If the given object is an instance of the block class then this will return true
        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        // If the gensis block data matches whats in the genesis block then it will return true here
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    // Groups the tests used for verifying mining a block
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs', () => {

            // verifies the newly mined block
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                minedBlock.timestamp,
                minedBlock.nonce,
                minedBlock.difficulty,
                lastBlock.hash,
                data));
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100 })).toEqual(block.difficulty + 1);
        });

        it('decreases the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100 })).toEqual(block.difficulty - 1);
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty({ originalBlock: block})).toEqual(1);
        });
    });

});