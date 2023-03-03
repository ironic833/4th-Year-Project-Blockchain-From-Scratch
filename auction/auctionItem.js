const BidEntry = require('./bidEntry');
const BidHistory = require('./bidHistory');

class AuctionItem {
  constructor({ name, description, startingBid, bidIncrement, owner, auctionEndTime }) {
    this.name = name;
    this.description = description;
    this.startingBid = startingBid;
    this.bidIncrement = bidIncrement;
    this.currentBid = startingBid;
    this.bidHistory = new BidHistory();
    this.owner = owner;
    this.auctionEndTime = auctionEndTime;
  }

  placeBid({ bidder, amount, timestamp }) {
    const newBid = new BidEntry({ bidder, amount, timestamp });

    if (amount < this.currentBid + this.bidIncrement) {
      throw new Error(`Bid must be at least ${this.currentBid + this.bidIncrement}`);
    }

    this.currentBid = amount;
    this.bidHistory.addEntry(newBid);
  }

  auctionEnd() {
    const currentTime = Date.now();

    if (currentTime < this.auctionEndTime) {
      throw new Error(`Auction cannot end before ${this.auctionEndTime}`);
    }

    const highestBid = this.bidHistory.getHighestBid();

    if (highestBid) {
      this.owner = highestBid.bidder;
    }
  }

  static makeAuction({ name, description, startingBid, bidIncrement, owner, auctionEndTime }) {
    return new AuctionItem({ name, description, startingBid, bidIncrement, owner, auctionEndTime });
  }
}

module.exports = AuctionItem;
