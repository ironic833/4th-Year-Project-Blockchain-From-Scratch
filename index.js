const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
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

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();

const app = express();


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static( path.join(__dirname, 'client/dist'))); 
app.use(cookieParser());
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// Set up endpoints
app.post("/api/login", (req, res) => {
  const { phrase } = req.body;

  console.log("Phrase found: " + phrase + "\n")

  const wallet = new Wallet(phrase);
  const pubsub = new PubSub({ blockchain, transactionPool, wallet }); 
  const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

  // Check if the user exists and the password is correct
  // If the user is authenticated, set session variables
  if (phrase !== undefined || null) {

    req.session.wallet = wallet;
    console.log("Wallet successfully made for session: " + wallet.publicKey + "\n");

    req.session.pubsub = pubsub;

   req.session.transactionMiner = transactionMiner;

    res.send("Login successful!");

    transactionMiner.mineTransactions();
  } else {
    res.status(401).send("Invalid phrase");
  }
});

app.get("/api/wallet", (req, res) => {
  const wallet = req.session.wallet;

  if (wallet !== undefined) {
    const publicKey = wallet.publicKey;
    res.send("Wallet public key: " + publicKey);
  } else {
    res.status(401).send("You must be logged in to view this page");
  }
});

app.get("/api/logout", (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy();
  res.redirect("/api/login");
});

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
    res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
    const { id } = req.params, { length } = blockchain.chain, blocksReversed = blockchain.chain.slice().reverse();

    let startIndex = (id - 1) * 5, endIndex = id * 5;

    startIndex = startIndex < length ? startIndex : length;
    endIndex = endIndex < length ? endIndex : length;

    res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/transact', (req, res) => {
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

});


app.post('/api/close-auction', (req, res) => {

    const { prevAuctionItem } = req.body;
    let updatedName, updatedDescrtiption, foundValidBlock = false, blocknum, block, transaction = {};;

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
  
});

// use public key to encrypt private to decrypt for messages 
app.post('/api/end-auction', (req, res) => {

  const { prevAuctionId } = req.body;
  let updatedName, updatedDescription, updatedStartingBid, highestBid = 0, highestBidder, foundValidBlock = false, transaction = {}, blocknum, block;

  // Find the latest version of the item on the chain
  for(blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0 && !foundValidBlock; blocknum--) {

    for(let transaction of block.data) {

      if(transaction.outputMap['auction ID'] === prevAuctionId && transaction.outputMap['owner'] != undefined && transaction.outputMap['owner'] === wallet.publicKey) {

        updatedName = transaction.outputMap['name'];
        updatedDescription = transaction.outputMap['description'];
        updatedStartingBid = transaction.outputMap['starting bid'];
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

    for(let transaction of block.data) {
      if(transaction.outputMap['auction ID'] === prevAuctionId && transaction.outputMap['bid'] > highestBid) {

        highestBid = transaction.outputMap['bid'];
        highestBidder = transaction.input.address;

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

});


app.post('/api/place-bid', (req, res) => {

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
  
});

app.post('/api/item-history', (req, res) => {

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
  
});




app.post('/api/wallet-history', (req, res) => {

  const { walletAddress } = req.body, walletHistory = [];
  let arraySpot = 0, foundValidAddress = false, blocknum, block;

  for (blocknum = blockchain.chain.length - 1, block = blockchain.chain[blocknum]; blocknum > 0; blocknum--) {

    for (let Transaction of block.data) {

      // add parameters to get more of the history not just transactions that a wallet made
      if (Transaction.input["address"] === walletAddress) {
        walletHistory[arraySpot] = Transaction.outputMap;
        foundValidAddress = true;
        arraySpot++;
      }
    }

    // Move onto the next block
    continue;
  }

  if(foundValidAddress === false) {
    return res.status(404).json({ type: 'error', message: 'No history found for the ID' });
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

/* if(isDevelopement){

    // test wallets
    const walletFoo = new Wallet("review wink submit ski mansion load artwork film master oak limb fox junior wage edge organ help equal reform inch used owner wisdom panel");
    const walletBar = new Wallet("shoot guard response relax buzz wheel exotic come twist bind dentist similar monitor floor town promote advice rich wire solar ranch law patrol need");

    // wallet helper method
    const generateWalletTransaction = ({ recipient, amount, wallet }) => {
      const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
      });

      transactionPool.setTransaction(transaction);
    };

    // wallet helper method
    const generateWalletItemTransaction = ({ Name, Description, StartingBid, AuctionEndTime, wallet}) => {
      const transaction = wallet.createItemTransaction({ 
        name: Name, description: Description, startingBid: StartingBid, auctionEndTime: AuctionEndTime
      });

      transactionPool.setTransaction(transaction);
    };

    const walletItemAction = () => generateWalletItemTransaction({
      wallet, Name: "Item", Description: "Item number 001", StartingBid: "90", AuctionEndTime: "now"
    }); 

    const walletFooItemAction = () => generateWalletItemTransaction({
      Name: "Item foo", Description: "Item foo number 001", StartingBid: "70", AuctionEndTime: "now", wallet: walletFoo
    });

    const walletBarItemAction = () => generateWalletItemTransaction({
      Name: "Item bar", Description: "Item bar number 001", StartingBid: "890", AuctionEndTime: "now", wallet: walletBar
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
        walletFooItemAction();
      } else {
        walletBarAction();
        walletFooAction();
        walletBarItemAction();
      }

      transactionMiner.mineTransactions();
    } 
    
    
}*/

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