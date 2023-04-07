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
/* 
  imageEncode(image) {

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

    return new Transaction({ senderWallet: this, recipient: null, amount: null, Id: id , name: null, description: null, startingBid: null, auctionEndTime: null, bid: Bid});

  }

  createItemTransaction({ Id, name, description, image, startingBid, auctionEndTime, owner }) {

    return new Transaction({ senderWallet: this, recipient: null, amount: null, Id, name, description, startingBid, auctionEndTime, owner });

  }
 */
  static calculateBalance ({ chain, address, timestamp }) {
    let outputsTotal = 0, hasConductedTransaction = false, lessThanTimestamp = false;

    for (let i = chain.length - 1; i > 0; i--) {
      lessThanTimestamp = chain[i].timestamp <= timestamp;

      for (const transaction of chain[i].data) {

        if (transaction.input.timestamp >= timestamp && transaction.input.address !== REWARD_INPUT.address) {
          break;
        }

        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        // need to finish this appears to be double adding somewhere
        if (transaction.outputMap[address]) {
          outputsTotal += transaction.outputMap[address];
          console.log("value found is: " + outputsTotal + "\n");
        } else if(transaction.outputMap['bidder']){
          outputsTotal -= transaction.outputMap['bid'];
          console.log(`this is an bid, current balance is ${outputsTotal} \n`);

        } else if(transaction.outputMap['owner']){
          console.log(`this is an auction, current balance is ${outputsTotal} \n`);

        }

      }

      if (hasConductedTransaction && lessThanTimestamp) break;

    }

    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
};



module.exports = Wallet;
