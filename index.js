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

// this endpoint is for updating the auction item you want to restart by making it as a new item
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

// this endpoint is for updating the auction item you want to transfer to a different user
// owner indicates bid is over, system checks who has the highest bid, system gifts item to highest bid and transfers winning value
app.post('/api/end-auction', (req, res) => {

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

      recipient.forEach(recipient => addressMap[recipient] = recipient)
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
    const generateWalletItemTransaction = ({ name, description, startingBid, auctionEndTime }) => {
      const transaction = wallet.createTransaction({
        name, description, startingBid, auctionEndTime, chain: blockchain.chain
      });

      transactionPool.setTransaction(transaction);
    };

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
      } else if (i % 3 === 1){
        walletAction();
        walletBarAction();
      } else {
        walletBarAction();
        walletFooAction();
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

