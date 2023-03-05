const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
  constructor({ senderWallet, recipient = null, amount = null, name = null, description, startingBid, auctionEndTime, outputMap, prevAuctionItem, input }) {
    this.id = uuid();
    this.outputMap = outputMap || this.createMap({senderWallet, recipient, amount, name, description, startingBid, auctionEndTime});
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  // this method needs to create a valid map and then output that map to the outputmap field
  createMap({senderWallet, recipient, amount, name , description, startingBid, auctionEndTime}){

    if(name !== null){
      return this.createAuctionItem({ name, description, startingBid, auctionEndTime, senderWallet });
    } else if (amount !== null){
      return this.createTransactionMap({ senderWallet, recipient, amount });
    } else {
      console.log('No valid inputs');
    }
 
  }

  // update this way as we want to keep the items history on chain as oppose to updating it before its on chain
  createAuctionItem({ name , description , startingBid, auctionEndTime, senderWallet, AuctionItem = null }) {
    const auctionItem = {};

    // if the item is undefined but the name isnt we are making a new item, otherwise we update the item
    // by passing old values to a new map
    if(AuctionItem === null && name !== null) {
      auctionItem['auction ID'] = uuid();
      auctionItem['name'] = name;
      auctionItem['description'] = description;
      auctionItem['starting bid'] = startingBid;
      auctionItem['auction end time'] = auctionEndTime;
      auctionItem['owner'] = senderWallet.publicKey;
    } else if(AuctionItem !== null && name === null){

      //update a transaction
      auctionItem['auction ID'] = AuctionItem['auction ID'];
      auctionItem['name'] = AuctionItem['name'];
      auctionItem['description'] = AuctionItem['description'];
      auctionItem['starting bid'] = AuctionItem['starting bid'];
      auctionItem['auction end time'] = 'Ended';

      //only change to item is setting the new owners key
      auctionItem['owner'] = senderWallet.publicKey;

    } 

    return auctionItem;
  }

  createTransactionMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    
    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {

    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };

  }

  updateCurrencyTransaction({ senderWallet, recipient, amount }) {

    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance');
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  updateItemTransaction({ senderWallet, recipient, amount }) {

    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance');
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }


  static validTransaction(transaction) {

    const { input: { address, amount, signature }, outputMap } = transaction;

    //const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);

    /* if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    } */

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;

  }

  static rewardTransaction({ minerWallet }) {

    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD }
    });

  }
}

module.exports = Transaction;