const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const bip39 = require('bip39');
const hdkey = require('hdkey');
const crypto = require('crypto');

class Wallet {
  constructor(mnemonic) {
      if (mnemonic) {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        this.masterNode = hdkey.fromMasterSeed(seed);
      } else {
        const seed = crypto.randomBytes(32);
        this.masterNode = hdkey.fromMasterSeed(seed);
        mnemonic = bip39.entropyToMnemonic(seed);
        console.log(`Generated mnemonic: ${mnemonic}`);
      }
      this.balance = STARTING_BALANCE;
      this.path = "m/0'/0'/0'";
      this.node = this.masterNode.derive(this.path);
      this.keyPair = ec.keyFromPrivate(this.node.privateKey);
      this.publicKey = this.keyPair.getPublic().encode('hex');
      this.mnemonic = mnemonic;
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

  createItemTransaction({ Id, name, description, startingBid, auctionEndTime, owner }) {

    return new Transaction({ senderWallet: this, recipient: null, amount: null, Id, name, description, startingBid, auctionEndTime, owner });

  }

  /* static calculateBalance({ chain, address }) {
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
  } */

  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false, outputsTotal = 0;

    for (let i=chain.length-1; i>0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {

        console.log(JSON.stringify(transaction) + "\n");
        console.log("Before Math: " + outputsTotal + "\n");

        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        if(transaction.outputMap[address]){

          const addressOutput = transaction.outputMap[address];

          if (addressOutput) {
            outputsTotal = outputsTotal + addressOutput;
          }

        } else if(transaction.outputMap['bidder'] === address){

          outputsTotal = outputsTotal - transaction.outputMap['bid'];

        } else if (transaction.outputMap['owner']){

          continue;

        }

        console.log("After Math: " + outputsTotal + "\n");
      }

      if (hasConductedTransaction) {
        break;
      }

    }

    return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
}


}

module.exports = Wallet;
