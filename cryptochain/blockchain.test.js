const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {

    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    // checks if the blockchain chain property is an array instance
    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    // check that the first object stored in the chain array is the genesis block
    it('starts with a genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });


    it('adds a new block to the chain', () => {

        // Adds a dummy block to check if its added to the blockchain array
        const newData = 'foo bar';
        blockchain.addBlock({ data: newData });

        // checks if the most recent blocks data property matches the data we tried to add in the dummy block
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
            blockchain.chain[0] = { data: 'fake-genesis' };

            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            beforeEach(() => {
            blockchain.addBlock({ data: 'Bears' });
            blockchain.addBlock({ data: 'Beets' });
            blockchain.addBlock({ data: 'Battlestar Galactica' });
            });

            describe('and a lastHash reference has changed', () => {
            it('returns false', () => {
                blockchain.chain[2].lastHash = 'broken-lastHash';

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
            });

            describe('and the chain contains a block with an invalid field', () => {
            it('returns false', () => {
                blockchain.chain[2].data = 'some-bad-and-evil-data';

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
            });

            describe('and the chain does not contain any invalid blocks', () => {
            it('returns true', () => {
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
            });
            });
        });
    });
});