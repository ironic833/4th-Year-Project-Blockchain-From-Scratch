
const MINE_RATE = 1000;

// sets the inital proof of work difficulty level. This is used in the genesis block and the
// ensuing proof of work operations will work off of this inital level
const INTIAL_DIFFICULTY = 3;

// Gensis block data used in the creation of the chains block
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INTIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

// exports the genesis block data as a variable so it can be used to populate 
// a  genesis block in other pieces 
module.exports = { GENESIS_DATA, MINE_RATE };