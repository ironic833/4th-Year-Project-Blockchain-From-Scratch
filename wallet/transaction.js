const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
  constructor({ senderWallet, recipient, amount = null, Id, name = null, description, startingBid, auctionEndTime, outputMap, input }) {
    this.id = uuid();
    this.outputMap = outputMap || this.createMap({senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime});
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  // inline if statement instead in constructor?

  // this method needs to create a valid map and then output that map to the outputmap field
  createMap({senderWallet, recipient, amount, Id, name , description, startingBid, auctionEndTime}){

    if(name !== null){

      return this.createAuctionItem({ Id, name, description, startingBid, auctionEndTime, senderWallet });

    // something is going wrong here
    } else if (amount !== null){

      return this.createTransactionMap({ senderWallet, recipient, amount });

    } else {

      console.log('No valid inputs');

    }
 
  }

  // update this way as we want to keep the items history on chain as oppose to updating it before its on chain
  createAuctionItem({ senderWallet, Id, name , description , startingBid, auctionEndTime}) {
    const auctionItem = {};

    auctionItem['auction ID'] = Id || uuid();
    auctionItem['name'] = name;
    auctionItem['description'] = description;
    auctionItem['starting bid'] = startingBid;
    auctionItem['auction end time'] = auctionEndTime;
    auctionItem['owner'] = senderWallet.publicKey;
    
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

  // whenn given an auction Id this will check the entire chain to find and the current auction winner
  /* static calcWinner({ auctionId, chain}) {

    let winner = '';

    for(let i = chain.length - 1; i > 0; i--) {

      let block = chain[i];
  
      // this needs to be checked
      const { auctionItem: { currentAuctionId, currentAuctionName , currentAuctionDescription , cureentAuctionStartBid, cureentAuctionEndTime, cureentAuctionItemOwner }} = block.Transaction.outputMap;
  
      let currentAuctionId = block.Transaction.outputMap.auctionItem['auction ID'];
      let currentAuctionName = block.Transaction.outputMap.auctionItem['name'];
      let currentAuctionDescription = block.Transaction.outputMap.auctionItem['description'];
      let cureentAuctionStartBid = block.Transaction.outputMap.auctionItem['starting bid'];
      let cureentAuctionEndTime = block.Transaction.outputMap.auctionItem['auction end time'];
      let cureentAuctionItemOwner = block.Transaction.outputMap.auctionItem['owner'];
  
      if( auctionId === block.Transaction.outputMap.auctionItem['auction ID'] ){
  
        
  
      }
  
    }


  } */


  static validTransaction(transaction) {

    const { input: { address, amount, signature }, outputMap } = transaction;

    // this should only run on a currency transaction
    /* if(amount !== null) {

      const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);

      if (amount !== outputTotal) {
        console.error(`Invalid transaction from ${address}`);
        return false;
      }
      
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