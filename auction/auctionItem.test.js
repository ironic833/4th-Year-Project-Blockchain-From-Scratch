const AuctionItem = require('./AuctionItem');
const BidEntry = require('./BidEntry');
const BidHistory = require('./BidHistory');

describe('AuctionItem', () => {
  let auctionItem;

  beforeEach(() => {
    auctionItem = new AuctionItem({
      name: 'Test Item',
      description: 'This is a test item',
      startingBid: 100,
      bidIncrement: 10,
      owner: 'Test Owner',
      auctionEndTime: Date.now() + 3600 * 1000 // 1 hour from now
    });
  });

  describe('constructor', () => {
    it('should set the name property', () => {
      expect(auctionItem.name).toBe('Test Item');
    });

    it('should set the description property', () => {
      expect(auctionItem.description).toBe('This is a test item');
    });

    it('should set the startingBid property', () => {
      expect(auctionItem.startingBid).toBe(100);
    });

    it('should set the bidIncrement property', () => {
      expect(auctionItem.bidIncrement).toBe(10);
    });

    it('should set the currentBid property to the startingBid value', () => {
      expect(auctionItem.currentBid).toBe(100);
    });

    it('should create a new BidHistory instance and set it to the bidHistory property', () => {
      expect(auctionItem.bidHistory).toBeInstanceOf(BidHistory);
    });

    it('should set the owner property', () => {
      expect(auctionItem.owner).toBe('Test Owner');
    });

    it('should set the auctionEndTime property', () => {
      expect(auctionItem.auctionEndTime).toBeGreaterThan(Date.now());
    });
  });

  describe('placeBid', () => {
    it('should increase the currentBid property if the bid is valid', () => {
      auctionItem.placeBid({
        bidder: 'Bidder A',
        amount: 110,
        timestamp: Date.now()
      });

      expect(auctionItem.currentBid).toBe(110);
    });

    it('should add a new BidEntry to the bidHistory property if the bid is valid', () => {
      auctionItem.placeBid({
        bidder: 'Bidder A',
        amount: 110,
        timestamp: Date.now()
      });

      const expectedBidEntry = new BidEntry({
        bidder: 'Bidder A',
        amount: 110,
        timestamp: expect.any(Number)
      });

      expect(auctionItem.bidHistory.entries).toEqual([expectedBidEntry]);
    });

    it('should throw an error if the bid is less than the minimum bid amount', () => {
      expect(() => {
        auctionItem.placeBid({
          bidder: 'Bidder A',
          amount: 105,
          timestamp: Date.now()
        });
      }).toThrow('Bid must be at least 110');
    });
  });

  describe('auctionEnd', () => {
    
    it('should throw an error if the auction end time has not been reached', () => {
      const futureEndTime = Date.now() + 3600 * 1000; // 1 hour from now
      auctionItem.auctionEndTime = futureEndTime;

      expect(() => {
        auctionItem.auctionEnd();
      }).toThrow(`Auction cannot end before ${futureEndTime}`);
    });

    it('should set the owner property to the bidder with the highest bid in the bidHistory property', () => {
      auctionItem.placeBid({
        bidder: 'Bidder A',
        amount: 110,
        timestamp: Date.now()
      });
    });

  });

});

