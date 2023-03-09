const bodyParser = require('body-parser');
const express = require('express');
const request = (require)('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const { response } = require('express');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');
const Transaction = require('./wallet/transaction');

const isDevelopement = process.env.ENV ==='developement';

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = isDevelopement ? `http://localhost:${DEFAULT_PORT}` : 'https://blocktest.herokuapp.com';


const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

app.use(bodyParser.json());
app.use(express.static( path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
    res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
    const { id } = req.params;

    const { length } = blockchain.chain;

    const blocksReversed = blockchain.chain.slice().reverse();

    let startIndex = (id - 1) * 5;
    let endIndex = id * 5;

    startIndex = startIndex < length ? startIndex : length;
    endIndex = endIndex < length ? endIndex : length;

    res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
  
    let transaction = transactionPool
      .existingTransaction({ inputAddress: wallet.publicKey });
  
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
  });

app.post('/api/create-auction', (req, res) => {

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

});

app.post('/api/reinitiate-auction', (req, res) => {

    const { prevAuctionItem, revisedStartingBid, revisedAuctionEndTime } = req.body;
    let updatedName, updatedDescrtiption, blocknum, block;

    for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

      for (let Transaction of block.data) {

        if (Transaction.outputMap['owner']){

          if((Transaction.outputMap['auction ID'] === prevAuctionItem) && (Transaction.outputMap['owner'] === wallet.publicKey)){

            updatedName = Transaction.outputMap['name'];
            updatedDescrtiption = Transaction.outputMap['description'];

            break;
    
          }
        } 
      }                    
    }

    let transaction = {};

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
  
});

app.post('/api/close-auction', (req, res) => {

  const { prevAuctionItem } = req.body;
    let updatedName, updatedDescrtiption, blocknum, block;

    for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

      for (let Transaction of block.data) {

        if (Transaction.outputMap['owner']){

          if((Transaction.outputMap['auction ID'] === prevAuctionItem) && (Transaction.outputMap['owner'] === wallet.publicKey)){

            updatedName = Transaction.outputMap['name'];
            updatedDescrtiption = Transaction.outputMap['description'];
            updatedBidAmount = Transaction.outputMap['starting bid'];

            break;
    
          }
        } 
      }                    
    }

    let transaction = {};

    try {
    
      transaction = wallet.createItemTransaction({
        Id: prevAuctionItem, 
        name: updatedName, 
        description: updatedDescrtiption , 
        startingBid: updatedBidAmount, 
        auctionEndTime: "ended"
      });
  
    } catch(error) {
      return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
  
});

// calculates a winner
app.post('/api/end-auction', (req, res) => {

  const { prevAuctionItem } = req.body;
    let updatedName, updatedDescrtiption, blocknum, block;

    for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

      for (let Transaction of block.data) {

        if (Transaction.outputMap['owner']){

          if((Transaction.outputMap['auction ID'] === prevAuctionItem) && (Transaction.outputMap['owner'] === wallet.publicKey)){

            updatedName = Transaction.outputMap['name'];
            updatedDescrtiption = Transaction.outputMap['description'];
            updatedBidAmount = Transaction.outputMap['starting bid'];

            break;
    
          }
        } 
      }                    
    }

    let transaction = {};

    try {
    
      transaction = wallet.createItemTransaction({
        Id: prevAuctionItem, 
        name: updatedName, 
        description: updatedDescrtiption , 
        startingBid: updatedBidAmount, 
        auctionEndTime: "ended"
      });
  
    } catch(error) {
      return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
  
});

app.post('/api/place-bid', (req, res) => {

  const { prevAuctionItem, bidAmount } = req.body;
    let blocknum, block;

    for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

      for (let Transaction of block.data) {

        if((Transaction.outputMap['auction ID'] === prevAuctionItem)){

          break;

        }
      }                   
    }

    let transaction = {};

    console.log("In Api Call, Id: " + prevAuctionItem + " bid: " + bidAmount);  

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
  
});

app.post('/api/item-history', (req, res) => {

  const { auctionItemId } = req.body;
  let arraySpot = 0;
  const itemHistory = [];

  for (let blocknum = blockchain.chain.length - 1; blocknum > 0; blocknum--) {
    const block = blockchain.chain[blocknum];
    console.log("blocknum: " + blocknum + "\n");

    for (let transaction of block.data) {
      console.log("arrayspot: " + arraySpot + "\n");

      if (transaction.outputMap['auction ID'] === auctionItemId) {
        itemHistory[arraySpot] = transaction.outputMap;
        arraySpot++;
      }
    }

    continue;
  }

  res.json(itemHistory);
  
});

// need to test
app.post('/api/wallet-history', (req, res) => {

  const { walletAddress } = req.body, walletHistory = [];
  let arraySpot = 0;

  for (let blocknum = blockchain.chain.length - 1; blocknum > 0; blocknum--) {
    const block = blockchain.chain[blocknum];
    console.log("blocknum: " + blocknum + "\n");

    for (let Transaction of block.data) {
      console.log("arrayspot: " + arraySpot + "\n");

      if (Transaction.input["address"] === walletAddress) {
        walletHistory[arraySpot] = Transaction.outputMap;
        arraySpot++;
      }
    }

    // Move onto the next block
    continue;
  }

  res.json(walletHistory);
  
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
  
    res.json({
      address,
      balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
}); 

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

if(isDevelopement){

    // test wallets
    const walletFoo = new Wallet();
    const walletBar = new Wallet();

    // wallet helper method
    const generateWalletTransaction = ({ recipient, amount }) => {
      const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
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

    for( let i=0; i<10; i++ ){
      if(i % 3 === 0){
        walletAction();
        walletFooAction();
        walletItemAction();
      } else if (i % 3 === 1){
        walletAction();
        walletBarAction();
        //walletFooItemAction();
      } else {
        walletBarAction();
        walletFooAction();
        //walletBarItemAction();
      }

      transactionMiner.mineTransactions();
    }
    
    
}

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});

