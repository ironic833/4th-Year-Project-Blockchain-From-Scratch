
class bidHistory {
    constructor() {
      this.entries = [];
    }
  
    addEntry(BidEntry) {
      this.entries.push(BidEntry);
    }
  
    getHighestBid() {
      if (this.entries.length === 0) {
        return null;
      }
  
      let highestBid = this.entries[0].amount;
  
      for (let i = 1; i < this.entries.length; i++) {
        if (this.entries[i].amount > highestBid) {
          highestBid = this.entries[i].amount;
        }
      }
  
      return highestBid;
    }
  }

module.exports = bidHistory;
  