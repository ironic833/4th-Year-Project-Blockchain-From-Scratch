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

    console.log("Id: " + Id + " bid: " + bid);      

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
    let winner = null, highestBid = 0;
    
    for(let blockNum = chain.length - 1; blockNum >= 0; blockNum--) {
      const block = chain[blockNum];
      
      for(let transaction of block.data) {
        const outputMap = transaction.outputMap;

        if(outputMap['auction ID'] === auctionId && outputMap['bid']) {
          const bidder = outputMap['bidder'], bidAmount = parseInt(outputMap['bid']);

          if(bidAmount > highestBid) {
            highestBid = bidAmount;
            winner = bidder;
          }
        }
      }                    
    }

    // Reorganize the bids object by sorting its entries in descending order of bid amount
    const entries = Object.entries(bids).sort((a, b) => b[1] - a[1]);
    const sortedBids = Object.fromEntries(entries);

    return { winner, bids: sortedBids };
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