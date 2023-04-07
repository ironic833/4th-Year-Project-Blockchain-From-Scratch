const bodyParser = require('body-parser');
const express = require('express');
const request = (require)('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = 'https://blocktest.herokuapp.com';

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();

const wallet = new Wallet(), pubsub = new PubSub({ blockchain, transactionPool, wallet }), transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

app.use(bodyParser.json()); 
app.use(express.static( path.join(__dirname, 'client/dist')));


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

syncWithRootState();

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

// used in gui
app.get('/api/my-wallet-address', (req, res) => {

  res.json(wallet.publicKey);

});

app.get('*', (req, res) => {
  res.sendFile(path.join( __dirname , 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
});