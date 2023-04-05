const bodyParser = require('body-parser');
const express = require('express');
const request = (require)('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const isDevelopement = process.env.ENV ==='developement';

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = isDevelopement ? `http://localhost:${DEFAULT_PORT}` : 'https://blocktest.herokuapp.com';

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();

app.use(bodyParser.json()); 
app.use(express.static( path.join(__dirname, 'client/dist')));

//accessible via gui
app.post('/api/wallet', (req, res) => {
  const { phrase } = req.body;

  if(phrase){
    startServer(phrase);
  }

  res.sendStatus(200);
});

app.get('/api/wallet-mnemoic-generate', (req, res) => {

  WalletMnemonic = new Wallet();

  walletPhrase = WalletMnemonic.mnemonic;

  res.json(walletPhrase);
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

const startServer = async (phrase) => {

    const wallet = new Wallet(phrase), pubsub = new PubSub({ blockchain, transactionPool, wallet }), transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

    if (PORT !== DEFAULT_PORT) {
      syncWithRootState();
    }

    //accessible via gui
    app.get('/api/blocks', (req, res) => {
      if(wallet.publicKey !== undefined){
        res.json(blockchain.chain);
      } else {
        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
      }
    });

    app.get('/api/blocks/length', (req, res) => {
        res.json(blockchain.chain.length);
    });

    app.get('/api/blocks/:id', (req, res) => {
      const { id } = req.params;
      const { length } = blockchain.chain;

      console.log(typeof blockchain.chain);
    
      const blocksReversed = blockchain.chain.slice().reverse();
    
      let startIndex = (id-1) * 5;
      let endIndex = id * 5;
    
      startIndex = startIndex < length ? startIndex : length;
      endIndex = endIndex < length ? endIndex : length;
    
      res.json(blocksReversed.slice(startIndex, endIndex));
    });

    //accessible via gui
    app.post('/api/transact', (req, res) => {
      if(wallet.publicKey !== undefined){
        const { amount, recipient } = req.body;
      
        let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });
      
        try {
          if (transaction) {
            transaction.updateTransaction({ senderWallet: wallet, recipient, amount });
          } else {
            transaction = wallet.createTransaction({
              recipient,
              amount,
              chain: blockchain.chain
            });
          }
        } catch(error) {
          return res.status(400).json({ type: 'error', message: error.message });
        }
      
        transactionPool.setTransaction(transaction);
      
        pubsub.broadcastTransaction(transaction);
      
        res.json({ type: 'success', transaction });
      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });

      }
    });

    //accessible via gui
    app.post('/api/create-auction', (req, res) => {
      if(wallet.publicKey !== undefined){

        const { name, description, startingBid, auctionEndTime } = req.body;
      
        let transaction = {};
      
        try {
            transaction = wallet.createItemTransaction({
              name,
              description,
              startingBid,
              auctionEndTime
            });
          } catch(error) {
            return res.status(400).json({ type: 'error', message: error.message });
        }
      
        transactionPool.setTransaction(transaction);
      
        pubsub.broadcastTransaction(transaction);
      
        res.json({ type: 'success', transaction });

      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });

      }
    });


    app.post('/api/reinitiate-auction', (req, res) => {

      if(wallet.publicKey !== undefined){

      const { prevAuctionItem, revisedStartingBid, revisedAuctionEndTime } = req.body;
      let updatedName, updatedDescrtiption, foundValidBlock = false, transaction = {};

      for (let i = 1; i < blockchain.chain.length; i++) {
        const block = blockchain.chain[i];

        for (let j = 0; j < block.data.length; j++) {
          const Transaction = block.data[j];

          if (Transaction.outputMap['owner']){

            if((Transaction.outputMap['auction ID'] === prevAuctionItem) && (Transaction.outputMap['owner'] === wallet.publicKey)){

              updatedName = Transaction.outputMap['name'];
              updatedDescrtiption = Transaction.outputMap['description'];
              foundValidBlock = true;
              break;

            }
          } 
        }                    
      }

      if(!foundValidBlock) {
        return res.status(404).json({ type: 'error', message: 'No valid auction item block found for the given auction ID' });
      }

      try {
        transaction = wallet.createItemTransaction({
          Id: prevAuctionItem, 
          name: updatedName, 
          description: updatedDescrtiption , 
          startingBid: revisedStartingBid, 
          auctionEndTime: revisedAuctionEndTime
        });

      } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
      }

      transactionPool.setTransaction(transaction);

      pubsub.broadcastTransaction(transaction);

      res.json({ type: 'success', transaction });
      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }

    });

    app.post('/api/close-auction', (req, res) => {

      if(wallet.publicKey !== undefined){

        const { prevAuctionItem } = req.body;
        let updatedName, updatedDescrtiption, updatedBidAmount, foundValidBlock = false, blocknum, block, transaction = {};;

        for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

          for (let Transaction of block.data) {

            // fairly sure this is unneccessart
            if (Transaction.outputMap['owner']){

              if((Transaction.outputMap['auction ID'] === prevAuctionItem) && (Transaction.outputMap['owner'] === wallet.publicKey)){

                updatedName = Transaction.outputMap['name'];
                updatedDescrtiption = Transaction.outputMap['description'];
                updatedBidAmount = Transaction.outputMap['starting bid'];
                foundValidBlock = true;

                break;
        
              }
            } 
          }                    
        }

        if(!foundValidBlock) {
          return res.status(404).json({ type: 'error', message: 'No valid auction item block found for the given auction ID' });
        }

        try {
        
          transaction = wallet.createItemTransaction({
            Id: prevAuctionItem, 
            name: updatedName, 
            description: updatedDescrtiption , 
            startingBid: updatedBidAmount, 
            auctionEndTime: "closed by seller"
          });
      
        } catch(error) {
          return res.status(400).json({ type: 'error', message: error.message });
        }

        transactionPool.setTransaction(transaction);

        pubsub.broadcastTransaction(transaction);

        res.json({ type: 'success', transaction });

      } else {

          return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
          
      }
      
    });

    
    app.post('/api/end-auction', (req, res) => {

      if(wallet.publicKey !== undefined){

      const { prevAuctionId } = req.body;
      let updatedName, updatedDescription, updatedStartingBid, highestBid = 0, highestBidder, foundValidBlock = false, transaction = {}, blocknum, block;

      // Find the latest version of the item on the chain
      for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0 && !foundValidBlock; blocknum--) {

        for(let Transaction of block.data) {

          if(Transaction.outputMap['auction ID'] === prevAuctionId && Transaction.outputMap['owner'] != undefined && Transaction.outputMap['owner'] === wallet.publicKey) {

            updatedName = Transaction.outputMap['name'];
            updatedDescription = Transaction.outputMap['description'];
            updatedStartingBid = Transaction.outputMap['starting bid'];
            foundValidBlock = true;

            break;
          }
        }
      }

      if(!foundValidBlock) {
        return res.status(404).json({ type: 'error', message: 'No valid auction item block found for the given auction ID' });
      }

      // Find the highest bid and the address of the highest bidder
      for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

        for(let Transaction of block.data) {
          if(Transaction.outputMap['auction ID'] === prevAuctionId && Transaction.outputMap['bid'] > highestBid) {

            highestBid = Transaction.outputMap['bid'];
            highestBidder = Transaction.input.address;

          }
        }
      }

      if(highestBid === 0){
        highestBid = updatedStartingBid;
      }

      try {
        transaction = wallet.createItemTransaction({
          Id: prevAuctionId,
          name: updatedName,
          description: updatedDescription,
          startingBid: highestBid,
          auctionEndTime: "ended",
          owner: highestBidder
        });
      } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
      }

      transactionPool.setTransaction(transaction);

      pubsub.broadcastTransaction(transaction);

      res.json({ type: 'success', transaction });

      }else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }

    });

    //accessible via gui
    app.post('/api/place-bid', (req, res) => {

      if(wallet.publicKey !== undefined){

      const { prevAuctionItem, bidAmount } = req.body;
      let blocknum, block, foundValidBlock = false, transaction = {}; ;

      for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

        for (let Transaction of block.data) {

          if((Transaction.outputMap['auction ID'] === prevAuctionItem)){

            foundValidBlock = true;
            break;

          }
        }                   
      }

      if(!foundValidBlock) {
        return res.status(404).json({ type: 'error', message: 'No valid auction item block found for the given auction ID' });
      }

      try {
        transaction = wallet.createBid({
          id: prevAuctionItem, 
          Bid: bidAmount
        });

      } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
      }

      transactionPool.setTransaction(transaction);

      pubsub.broadcastTransaction(transaction);

      res.json({ type: 'success', transaction });

      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }
      
    });


    app.post('/api/item-history', (req, res) => {

      if(wallet.publicKey !== undefined){

      const { auctionItemId } = req.body, itemHistory = [];
      let foundValidBlock = false;

      for (let i = 1; i < blockchain.chain.length; i++) {
        const block = blockchain.chain[i];

        for (let j = 0; j < block.data.length; j++) {
          const transaction = block.data[j];
          console.log(JSON.stringify(transaction) + "\n");

          if (transaction.outputMap['auction ID'] === auctionItemId) {
            itemHistory.push(transaction.outputMap);
            foundValidBlock = true;
          }
        }
      }

      if(!foundValidBlock) {
        return res.status(404).json({ type: 'error', message: 'No valid auction item block found for the given auction ID' });
      }

      res.json(itemHistory);

      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }
      
    });

    app.post('/api/wallet-history', (req, res) => {
      if (wallet.publicKey !== undefined) {

        const { walletAddress } = req.body, walletHistory = [], addedTransactions = {};
        let foundValidAddress = false;
    
        for (let blockNum = 0; blockNum < blockchain.chain.length; blockNum++) {

          const block = blockchain.chain[blockNum];
          for (let transaction of block.data) {

            if (transaction.input["address"] === walletAddress) {

              const transactionHash = JSON.stringify(transaction);

              if (!addedTransactions[transactionHash]) {

                addedTransactions[transactionHash] = true;

                walletHistory.push({
                  blockNumber: blockNum,
                  transaction: transaction
                });

                foundValidAddress = true;
              }

            }
          }
        }

        if (foundValidAddress === false) {
          return res.status(404).json({ type: 'error', message: 'No history found for the ID' });
        }

        res.json(walletHistory);

      } else {
        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
      }

    });

    //accessible via gui
    app.get('/api/transaction-pool-map', (req, res) => {
        res.json(transactionPool.transactionMap);
    });

    //accessible via gui
    app.get('/api/mine-transactions', (req, res) => {

      if(wallet.publicKey !== undefined){

        console.log("mining transaction \n");

        transactionMiner.mineTransactions();

        res.redirect('/api/blocks');

      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }
    });

    //accessible via gui
    app.get('/api/wallet-info', (req, res) => {

      if(wallet.publicKey !== undefined){

        const address = wallet.publicKey;
      
        res.json({
          address,
          balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
        });

      } else {

        return res.status(400).json({ type: 'error', message: 'Wallet Key undefined' });
        
      }
    }); 

    //accessible via gui
    app.get('/api/known-addresses', (req, res) => {
      const addressMap = {};

      for(let block of blockchain.chain){
        for (let transaction of block.data){
          const recipient = Object.keys(transaction.outputMap);

          recipient.forEach(recipient => {
            if (recipient.length > 50) {
              addressMap[recipient] = recipient;
            }
          });
        }
      }

      res.json(Object.keys(addressMap));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join( __dirname , 'client/dist/index.html'));
    });

   if(isDevelopement && PORT === 3000 ){

      // test wallets
      const walletFoo = new Wallet("review wink submit ski mansion load artwork film master oak limb fox junior wage edge organ help equal reform inch used owner wisdom panel");
      const walletBar = new Wallet("shoot guard response relax buzz wheel exotic come twist bind dentist similar monitor floor town promote advice rich wire solar ranch law patrol need");

      // wallet helper method
      const generateWalletTransaction = ({ recipient, amount }) => {
        const transaction = wallet.createTransaction({
          recipient, amount, chain: blockchain.chain
        });

        transactionPool.setTransaction(transaction);
      };

      const generateBidTransaction = ({ id, bid }) => {
        const transaction = wallet.createBid({
          id, bid
        });

        transactionPool.setTransaction(transaction);
      };

      // wallet helper method
      const generateWalletItemTransaction = ({ Name, Description, StartingBid, AuctionEndTime }) => {
        const transaction = wallet.createItemTransaction({ 
          name: Name, description: Description, startingBid: StartingBid, auctionEndTime: AuctionEndTime
        });

        transactionPool.setTransaction(transaction);
      };

      const walletItemAction = () => generateWalletItemTransaction({
        wallet, Name: "Item", Description: "Item number 001", StartingBid: "90", AuctionEndTime: "now"
      });

      const walletFooItemAction = () => generateWalletItemTransaction({
        wallet, Name: "Item foo", Description: "Item foo number 001", StartingBid: "70", AuctionEndTime: "now"
      });

      const walletBarItemAction = () => generateWalletItemTransaction({
        wallet, Name: "Item bar", Description: "Item bar number 001", StartingBid: "890", AuctionEndTime: "now"
      });

      const walletAction = () => generateWalletTransaction({
        wallet, recipient: walletFoo.publicKey, amount: 5
      });

      const walletFooAction = () => generateWalletTransaction({
        wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
      });

      const walletBarAction = () => generateWalletTransaction({
        wallet: walletBar, recipient: walletFoo.publicKey, amount: 15
      });



      walletItemAction();

      for( let i=0; i<10; i++ ){
        if(i % 3 === 0){
          walletAction();
          walletFooAction();
          walletItemAction();
        } else if (i % 3 === 1){
          walletAction();
          walletBarAction();
          walletFooItemAction();
        } else {
          walletBarAction();
          walletFooAction();
          walletBarItemAction();
        }

        transactionMiner.mineTransactions();
      } 
  }; 

}

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
});