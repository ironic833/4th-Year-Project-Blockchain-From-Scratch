class BidEntry {
    constructor({ bidder, amount, timestamp }) {
      this.bidder = bidder;
      this.amount = amount;
      this.timestamp = timestamp;
    }
  }

module.exports = BidEntry;