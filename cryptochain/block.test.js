const Block = require('./block');
const { GENESIS_DATA } = require('./config.js');

// This lays out the definitions and requirements for the block as a whole throughout the program
// Describe keyword just lets me group tests. This is a new keyword to me I didn't cover in the 
// codecademy course
describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];

    // Defines the parameters required when the new block constructor is called
    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data
    });

    // checks this test definition against a block to ensure that the block is correct
    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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
    });

});