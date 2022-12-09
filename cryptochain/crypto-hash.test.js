const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('foo')).toEqual('63d00c9e9fb34df5d69460f04eaecc4a38702c4c307710ad4e68ca7d1d43d7b5');
    });

    it('produces the same hash with the same input arguements in any order', () => {
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'));
    });
});