const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
  constructor({ senderWallet, recipient, amount = null, Id, name = null, description, startingBid, auctionEndTime, bid = null, outputMap, input }) {
    this.id = uuid();
    this.outputMap = outputMap || this.createMap({senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime, bid });
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  // inline if statement instead in constructor?

  // this method needs to create a valid map and then output that map to the outputmap field
  createMap({senderWallet, recipient, amount, Id, name , description, startingBid, auctionEndTime, bid}){

    if(name !== null){

      return this.createAuctionItem({ Id, name, description, startingBid, auctionEndTime, senderWallet });

    // something is going wrong here
    } else if( bid !== null){

      console.log("In Transaction call, Id: " + Id + " bid: " + bid);    
      return this.createBid({ Id, bid, senderWallet });

    } else if (amount !== null){

      return this.createTransactionMap({ senderWallet, recipient, amount });

    } else {

      console.log('No valid inputs');

    }
 
  }

  // update this way as we want to keep the items history on chain as oppose to updating it before its on chain
  createBid({ senderWallet, Id, bid}) {   

    const Bid = {};

    Bid['auction ID'] = Id;
    Bid['bidder'] = senderWallet.publicKey;
    Bid['bid'] = bid;
    
    
    return Bid;
  }

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

  updateTransaction({ senderWallet, recipient, amount }) {

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

  static calcWinner({ auctionId, chain}) {

    console.log("In transaction call " + auctionId + " " + chain + " \n");

    let winner = '', blocknum, block, bids = {};
  
    for(blocknum = chain.length - 1, block = chain[blocknum]; blocknum > 0; blocknum--) {
  
      for (let Transaction of block.data) {
  
        if((Transaction.outputMap['auction ID'] === auctionId) && Transaction.outputMap['bid']){
  
          bids[Transaction.outputMap['bidder']] = Transaction.outputMap['bid'];
  
        }
      }                    
    }
  
    // Create an array of winner entries and sort by bid amount in descending order
    const winnerEntries = Object.entries(bids).sort((a, b) => b[1] - a[1]);
  
    // Return the bidder with the highest bid
    if (winnerEntries.length > 0) {
      winner = winnerEntries[0][0];
    }

    console.log("In transaction call number 2" + winner + " \n");
  
    return winner;
}
  

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