const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;

    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode('hex');

    this.ownedItems = [];
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data))
  }

  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey
      });
    }

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  createBid({ id, Bid }) {  

    return new Transaction({ senderWallet: this, recipient: null, amount: null, Id: id , name: null, description: null, startingBid: null, auctionEndTime: null, bid: Bid });

  }

  createItemTransaction({ Id, name, description, startingBid, auctionEndTime }) {

    return new Transaction({ senderWallet: this, recipient: null, amount: null, Id, name, description, startingBid, auctionEndTime });

  }

  calcWinner({ auctionId, chain }){

    console.log("In wallet call " + auctionId + " " + chain + " \n");

    return Transaction.calcWinner({ auctionId, chain });
  }

  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false, outputsTotal = 0;

    for (let i=chain.length-1; i>0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
  }
};

module.exports = Wallet;
