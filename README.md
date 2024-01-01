# 4th-Year-Project-Blockchain-From-Scratch

Please note as of the 20/07/2023 due to continued hosting costs, the main root node has been deactivated and only self hosted or local instances will function correctly

## Modules

<dl>
<dt><a href="#module_cryptoHash">cryptoHash</a></dt>
<dd><p>Exports the cryptoHash class as a module.</p>
</dd>
<dt><a href="#module_Wallet">Wallet</a></dt>
<dd><p>Exports the Wallet class as a module.</p>
</dd>
<dt><a href="#module_TransactionPool">TransactionPool</a></dt>
<dd><p>Exports the TransactionPool class as a module.</p>
</dd>
<dt><a href="#module_Transaction">Transaction</a></dt>
<dd><p>Exports the Transaction class as a module.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Peers">Peers</a></dt>
<dd><p>A class representing the network peers of a blockchain node.</p>
</dd>
<dt><a href="#PubSub">PubSub</a></dt>
<dd><p>Class representing a PubSub system for blockchain</p>
</dd>
<dt><a href="#TransactionMiner">TransactionMiner</a></dt>
<dd><p>Represents a transaction miner, responsible for adding valid transactions to the blockchain.</p>
</dd>
<dt><a href="#Block">Block</a></dt>
<dd><p>Class representing a block.</p>
</dd>
<dt><a href="#Blockchain">Blockchain</a></dt>
<dd><p>Represents a blockchain.</p>
</dd>
<dt><a href="#Wallet">Wallet</a></dt>
<dd><p>Class representing a blockchain wallet.</p>
</dd>
<dt><a href="#TransactionPool">TransactionPool</a></dt>
<dd><p>The transaction pool holds all pending and yet to be mined transactions. After a transaction is mined it is added to the chain and cleared from the pool</p>
</dd>
<dt><a href="#Transaction">Transaction</a></dt>
<dd><p>A transaction is a record of an interaction between a user wallet and the chain. This may be the processing of currency, an auction item, CRUD operation on an auction item or a bid.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#message">message(messageObject)</a></dt>
<dd><p>Event listener for incoming messages.</p>
</dd>
<dt><a href="#cryptoHash">cryptoHash(...inputs)</a> <code>string</code></dt>
<dd><p>Calculates the SHA256 hash of the inputs. May take several inputs</p>
</dd>
<dt><a href="#verifySignature">verifySignature(publicKey, data, signature)</a>  <code>boolean</code></dt>
<dd><p>Verifies a cryptographic signature using the provided public key and data. Returns if its valid</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#data">data</a> : <code><a href="#Transaction">Array.&lt;Transaction&gt;</a></code></dt>
<dd><p>A data object is used in the creation of a block and is a set of transactions</p>
</dd>
<dt><a href="#uuid">uuid</a> : <code>string</code></dt>
<dd><p>A uuid is a unique cryptographicly generated identifier</p>
</dd>
<dt><a href="#transactionMap">transactionMap</a> : <code>Map</code></dt>
<dd><p>A transaction map is a member of a transaction pool containing all yet to be mined transactions. Transactions are identified in the map by their ID.</p>
</dd>
<dt><a href="#chain">chain</a> : <code>Array</code></dt>
<dd><p>A chain is an array object and is a version of the chain being used in another underlying operation</p>
</dd>
<dt><a href="#outputMap">outputMap</a> : <code>Object</code></dt>
<dd><p>An outputMap is a definition of the data to be written to the chain</p>
</dd>
<dt><a href="#inputMap">inputMap</a> : <code>Object</code></dt>
<dd><p>An inputmap is a definition of the block generated based on the inputted wallet public key and outputMap</p>
</dd>
<dt><a href="#publicKey">publicKey</a> : <code>string</code></dt>
<dd><p>A publicKey is the shared key created in the asymetric encryption process used to generate wallet objects. This allows users to transact with each other and assign the ownership of auctions items and bids and is a component of a wallet object</p>
</dd>
<dt><a href="#transaction">transaction</a> : <code>Object</code></dt>
<dd><p>A transaction is an event that is written to the blockchain consisting of an input and an output map.</p>
</dd>
</dl>

<a name="module_cryptoHash"></a>

## cryptoHash
Exports the cryptoHash class as a module.

<a name="module_Wallet"></a>

## Wallet
Exports the Wallet class as a module.

<a name="module_TransactionPool"></a>

## TransactionPool
Exports the TransactionPool class as a module.

<a name="module_Transaction"></a>

## Transaction
Exports the Transaction class as a module.

<a name="Peers"></a>

## Peers
A class representing the network peers of a blockchain node.

**Kind**: global class  

* [Peers](#Peers)
    * [new Peers()](#new_Peers_new)
    * [.peers](#Peers+peers) : <code>Array.&lt;string&gt;</code>
    * [.updatePeers(updatedPeers)](#Peers+updatePeers)

<a name="new_Peers_new"></a>

### new Peers()
Creates an instance of `Peers`.

<a name="Peers+peers"></a>

### peers.peers : <code>Array.&lt;string&gt;</code>
An array containing the network peers of the node.

**Kind**: instance property of [<code>Peers</code>](#Peers)  
<a name="Peers+updatePeers"></a>

### peers.updatePeers(updatedPeers)
Updates the list of network peers.

**Kind**: instance method of [<code>Peers</code>](#Peers)  

| Param | Type | Description |
| --- | --- | --- |
| updatedPeers | <code>Array.&lt;string&gt;</code> | The updated list of network peers. |

<a name="PubSub"></a>

## PubSub
Class representing a PubSub system for blockchain

**Kind**: global class  

* [PubSub](#PubSub)
    * [new PubSub(blockchain, transactionPool, peers, wallet)](#new_PubSub_new)
    * [.blockchain](#PubSub+blockchain) : <code>object</code>
    * [.transactionPool](#PubSub+transactionPool) : <code>object</code>
    * [.peers](#PubSub+peers) : <code>object</code>
    * [.wallet](#PubSub+wallet) : <code>object</code>
    * [.heldChain](#PubSub+heldChain) : <code>Array</code>
    * [.heldPeers](#PubSub+heldPeers) : <code>Array</code>
    * [.listener()](#PubSub+listener) ÔçÆ <code>Object</code>
    * [.TransactionPublish(channel, message)](#PubSub+TransactionPublish)
    * [.blockchainPublish(channel, message)](#PubSub+blockchainPublish)
    * [.broadcastChain()](#PubSub+broadcastChain)
    * [.broadcastTransaction(transaction)](#PubSub+broadcastTransaction)
    * [.broadcastPeerMembership(peerRegistration)](#PubSub+broadcastPeerMembership)

<a name="new_PubSub_new"></a>

### new PubSub(blockchain, transactionPool, peers, wallet)
Create a PubSub system.


| Param | Type | Description |
| --- | --- | --- |
| blockchain | [<code>Blockchain</code>](#Blockchain) | The blockchain instance. |
| transactionPool | [<code>TransactionPool</code>](#TransactionPool) | The transaction pool instance. |
| peers | [<code>Peers</code>](#Peers) | The peers instance. |
| wallet | [<code>Wallet</code>](#Wallet) | The wallet instance. |

<a name="PubSub+blockchain"></a>

### pubSub.blockchain : <code>object</code>
The blockchain instance to interact with.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+transactionPool"></a>

### pubSub.transactionPool : <code>object</code>
The transaction pool instance to interact with.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+peers"></a>

### pubSub.peers : <code>object</code>
The peers instance to interact with.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+wallet"></a>

### pubSub.wallet : <code>object</code>
The wallet instance to interact with.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+heldChain"></a>

### pubSub.heldChain : <code>Array</code>
The held chain.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+heldPeers"></a>

### pubSub.heldPeers : <code>Array</code>
The held peers.

**Kind**: instance property of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+listener"></a>

### pubSub.listener() ÔçÆ <code>Object</code>
Returns an object with listener methods for PubNub.

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  
**Returns**: <code>Object</code> - Object containing listener methods.  
<a name="PubSub+TransactionPublish"></a>

### pubSub.TransactionPublish(channel, message)
Publish a transaction to a PubNub channel.

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | The channel to publish the transaction to. |
| message | [<code>Transaction</code>](#Transaction) | The transaction to publish. |

<a name="PubSub+blockchainPublish"></a>

### pubSub.blockchainPublish(channel, message)
Publish a blockchain item to a PubNub channel.

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>string</code> | The channel to publish the blockchain item to. |
| message | [<code>Blockchain</code>](#Blockchain) | The blockchain item to publish. |

<a name="PubSub+broadcastChain"></a>

### pubSub.broadcastChain()
This function broadcasts the blockchain to all connected peers. Chain is disorganised in this method

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  
<a name="PubSub+broadcastTransaction"></a>

### pubSub.broadcastTransaction(transaction)
This function broadcasts a transaction to all connected peers.

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  

| Param | Type | Description |
| --- | --- | --- |
| transaction | [<code>Transaction</code>](#Transaction) | The transaction object. |

<a name="PubSub+broadcastPeerMembership"></a>

### pubSub.broadcastPeerMembership(peerRegistration)
This function broadcasts a new peer registration to all connected peers. This is just a string wrapped with pubnub

**Kind**: instance method of [<code>PubSub</code>](#PubSub)  

| Param | Type | Description |
| --- | --- | --- |
| peerRegistration | <code>object</code> | The peer registration object. |

<a name="TransactionMiner"></a>

## TransactionMiner
Represents a transaction miner, responsible for adding valid transactions to the blockchain.

**Kind**: global class  

* [TransactionMiner](#TransactionMiner)
    * [new TransactionMiner(blockchain, transactionPool, wallet, pubsub)](#new_TransactionMiner_new)
    * [.mineTransactions()](#TransactionMiner+mineTransactions)

<a name="new_TransactionMiner_new"></a>

### new TransactionMiner(blockchain, transactionPool, wallet, pubsub)
Creates a new instance of the `TransactionMiner` class.


| Param | Type | Description |
| --- | --- | --- |
| blockchain | [<code>Blockchain</code>](#Blockchain) | The blockchain to add the transactions to. |
| transactionPool | [<code>TransactionPool</code>](#TransactionPool) | The transaction pool to get transactions from. |
| wallet | [<code>Wallet</code>](#Wallet) | The wallet to reward for mining a block. |
| pubsub | <code>Pubsub</code> | The pubsub instance to broadcast the updated chain to other nodes. |

<a name="TransactionMiner+mineTransactions"></a>

### transactionMiner.mineTransactions()
Mines valid transactions by adding them to the blockchain and broadcasting the updated chain to other nodes.
Also rewards the miner by adding a reward transaction to the list of valid transactions.

**Kind**: instance method of [<code>TransactionMiner</code>](#TransactionMiner)  
<a name="Block"></a>

## Block
Class representing a block.

**Kind**: global class  

* [Block](#Block)
    * [new Block(timestamp, lastHash, hash, data, nonce, difficulty)](#new_Block_new)
    * [.genesis()](#Block.genesis) ÔçÆ [<code>Block</code>](#Block)
    * [.mineBlock(lastBlock, data)](#Block.mineBlock) ÔçÆ [<code>Block</code>](#Block)
    * [.adjustDifficulty(originalBlock, timestamp)](#Block.adjustDifficulty) ÔçÆ <code>number</code>

<a name="new_Block_new"></a>

### new Block(timestamp, lastHash, hash, data, nonce, difficulty)
Creates a new block.


| Param | Type | Description |
| --- | --- | --- |
| timestamp | <code>number</code> | The timestamp of the block creation. |
| lastHash | <code>string</code> | The hash of the previous block in the chain. |
| hash | <code>string</code> | The hash of the current block. |
| data | [<code>data</code>](#data) | The data to be stored in the block. |
| nonce | <code>number</code> | The nonce value used in the proof-of-work algorithm. |
| difficulty | <code>number</code> | The difficulty of the proof-of-work algorithm. |

<a name="Block.genesis"></a>

### Block.genesis() ÔçÆ [<code>Block</code>](#Block)
Creates the genesis block of the blockchain.

**Kind**: static method of [<code>Block</code>](#Block)  
**Returns**: [<code>Block</code>](#Block) - The genesis block.  
<a name="Block.mineBlock"></a>

### Block.mineBlock(lastBlock, data) ÔçÆ [<code>Block</code>](#Block)
Mines a new block to add to the blockchain.

**Kind**: static method of [<code>Block</code>](#Block)  
**Returns**: [<code>Block</code>](#Block) - The newly mined block.  

| Param | Type | Description |
| --- | --- | --- |
| lastBlock | [<code>Block</code>](#Block) | The previous block in the blockchain. |
| data | [<code>data</code>](#data) | The data to be stored in the block. |

<a name="Block.adjustDifficulty"></a>

### Block.adjustDifficulty(originalBlock, timestamp) ÔçÆ <code>number</code>
Adjusts the difficulty of the proof-of-work algorithm for mining the next block in the blockchain.

**Kind**: static method of [<code>Block</code>](#Block)  
**Returns**: <code>number</code> - The adjusted difficulty.  

| Param | Type | Description |
| --- | --- | --- |
| originalBlock | [<code>Block</code>](#Block) | The original block whose difficulty is being adjusted. |
| timestamp | <code>number</code> | The timestamp of the new block being mined. |

<a name="Blockchain"></a>

## Blockchain
Represents a blockchain.

**Kind**: global class  

* [Blockchain](#Blockchain)
    * [new Blockchain()](#new_Blockchain_new)
    * _instance_
        * [.addBlock(blockData)](#Blockchain+addBlock)
        * [.replaceChain(chain, validateTransactions, onSuccess)](#Blockchain+replaceChain)
        * [.validTransactionData(chain)](#Blockchain+validTransactionData) ÔçÆ <code>boolean</code>
    * _static_
        * [.isValidChain(chain)](#Blockchain.isValidChain) ÔçÆ <code>boolean</code>

<a name="new_Blockchain_new"></a>

### new Blockchain()
Creates a new blockchain with a genesis block.

<a name="Blockchain+addBlock"></a>

### blockchain.addBlock(blockData)
Adds a new block to the chain.

**Kind**: instance method of [<code>Blockchain</code>](#Blockchain)  

| Param | Type | Description |
| --- | --- | --- |
| blockData | [<code>data</code>](#data) | The data for the new block. |

<a name="Blockchain+replaceChain"></a>

### blockchain.replaceChain(chain, validateTransactions, onSuccess)
Replaces the current chain with a new one.

**Kind**: instance method of [<code>Blockchain</code>](#Blockchain)  

| Param | Type | Description |
| --- | --- | --- |
| chain | [<code>chain</code>](#chain) | The new chain to replace the current one upon validation. |
| validateTransactions | <code>boolean</code> | Whether or not to validate the transactions in the new chain. |
| onSuccess | <code>function</code> | A callback function to be called upon successful replacement of the chain. Logs to console and replaces current blockchain |

<a name="Blockchain+validTransactionData"></a>

### blockchain.validTransactionData(chain) ÔçÆ <code>boolean</code>
Validates the transaction data in a chain.

**Kind**: instance method of [<code>Blockchain</code>](#Blockchain)  
**Returns**: <code>boolean</code> - Whether or not the transaction data is valid.  

| Param | Type | Description |
| --- | --- | --- |
| chain | [<code>chain</code>](#chain) | The array of blocks in the chain. |

<a name="Blockchain.isValidChain"></a>

### Blockchain.isValidChain(chain) ÔçÆ <code>boolean</code>
Determines whether or not a chain is valid. Returns a boolean to be used in the replace chain process.

**Kind**: static method of [<code>Blockchain</code>](#Blockchain)  
**Returns**: <code>boolean</code> - Whether or not the chain is valid.  

| Param | Type | Description |
| --- | --- | --- |
| chain | <code>Array</code> | The chain to validate. |

<a name="Wallet"></a>

## Wallet
Class representing a blockchain wallet.

**Kind**: global class  

* [Wallet](#Wallet)
    * [new Wallet([mnemonic])](#new_Wallet_new)
    * _instance_
        * [.sign(data)](#Wallet+sign) ÔçÆ <code>Object</code>
        * [.createTransaction(recipient, amount, chain)](#Wallet+createTransaction) ÔçÆ [<code>Transaction</code>](#Transaction)
        * [.createBid(Id, bid)](#Wallet+createBid) ÔçÆ [<code>Transaction</code>](#Transaction)
        * [.createItemTransaction(Id, name, description, startingBid, auctionEndTime, owner)](#Wallet+createItemTransaction) ÔçÆ [<code>Transaction</code>](#Transaction)
    * _static_
        * [.calculateBalance(chain, address, timestamp)](#Wallet.calculateBalance) ÔçÆ <code>number</code>

<a name="new_Wallet_new"></a>

### new Wallet([mnemonic])
Create a new wallet.


| Param | Type | Description |
| --- | --- | --- |
| [mnemonic] | <code>string</code> | A 12-word mnemonic phrase to create the wallet from. If not provided, a new mnemonic will be generated. |

<a name="Wallet+sign"></a>

### wallet.sign(data) ÔçÆ <code>Object</code>
Sign a piece of data with the wallet's private key.

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  
**Returns**: <code>Object</code> - The signature of the data.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to sign. |

<a name="Wallet+createTransaction"></a>

### wallet.createTransaction(recipient, amount, chain) ÔçÆ [<code>Transaction</code>](#Transaction)
Create a new currency transaction.

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  
**Returns**: [<code>Transaction</code>](#Transaction) - A new transaction object.  
**Throws**:

- Will throw an error if the wallet does not have sufficient funds.


| Param | Type | Description |
| --- | --- | --- |
| recipient | [<code>publicKey</code>](#publicKey) | The address of the recipient of the transaction. |
| amount | <code>number</code> | The amount to transfer in the transaction. |
| chain | [<code>chain</code>](#chain) | The blockchain to check for transaction history. |

<a name="Wallet+createBid"></a>

### wallet.createBid(Id, bid) ÔçÆ [<code>Transaction</code>](#Transaction)
Creates a new bid transaction object for an auction.

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  
**Returns**: [<code>Transaction</code>](#Transaction) - - The new transaction object.  

| Param | Type | Description |
| --- | --- | --- |
| Id | [<code>uuid</code>](#uuid) | The ID of a previous auction item. |
| bid | <code>number</code> | The bid amount. |

<a name="Wallet+createItemTransaction"></a>

### wallet.createItemTransaction(Id, name, description, startingBid, auctionEndTime, owner) ÔçÆ [<code>Transaction</code>](#Transaction)
Creates a new transaction object for creating a new auction item.

**Kind**: instance method of [<code>Wallet</code>](#Wallet)  
**Returns**: [<code>Transaction</code>](#Transaction) - - The new transaction object.  

| Param | Type | Description |
| --- | --- | --- |
| Id | [<code>uuid</code>](#uuid) | The ID of the auction item. |
| name | <code>string</code> | The name of the auction item. |
| description | <code>string</code> | The description of the auction item. |
| startingBid | <code>number</code> | The starting bid amount. |
| auctionEndTime | <code>number</code> | The end time of the auction. |
| owner | [<code>publicKey</code>](#publicKey) | The public key of the item owner. |

<a name="Wallet.calculateBalance"></a>

### Wallet.calculateBalance(chain, address, timestamp) ÔçÆ <code>number</code>
Calculates the balance of the wallet for the given blockchain and timestamp.

**Kind**: static method of [<code>Wallet</code>](#Wallet)  
**Returns**: <code>number</code> - - The balance of the wallet.  

| Param | Type | Description |
| --- | --- | --- |
| chain | [<code>chain</code>](#chain) | The blockchain to use for calculating the balance. |
| address | [<code>publicKey</code>](#publicKey) | The public key of the wallet to calculate the balance for. |
| timestamp | <code>number</code> | The timestamp to calculate the balance at. |

<a name="TransactionPool"></a>

## TransactionPool
The transaction pool holds all pending and yet to be mined transactions. After a transaction is mined it is added to the chain and cleared from the pool

**Kind**: global class  

* [TransactionPool](#TransactionPool)
    * [new TransactionPool()](#new_TransactionPool_new)
    * [.transactionMap](#TransactionPool+transactionMap) : [<code>transactionMap</code>](#transactionMap)
    * [.clear()](#TransactionPool+clear)
    * [.setTransaction(transaction)](#TransactionPool+setTransaction)
    * [.setMap(transactionMap)](#TransactionPool+setMap)
    * [.existingTransaction(inputAddress)](#TransactionPool+existingTransaction) ÔçÆ [<code>Transaction</code>](#Transaction) \| <code>undefined</code>
    * [.validTransactions()](#TransactionPool+validTransactions) ÔçÆ [<code>Array.&lt;Transaction&gt;</code>](#Transaction)
    * [.clearBlockchainTransactions(chain)](#TransactionPool+clearBlockchainTransactions)

<a name="new_TransactionPool_new"></a>

### new TransactionPool()
Creates a new instance of TransactionPool.

<a name="TransactionPool+transactionMap"></a>

### transactionPool.transactionMap : [<code>transactionMap</code>](#transactionMap)
The transactionMap member of the transaction pool.

**Kind**: instance property of [<code>TransactionPool</code>](#TransactionPool)  
<a name="TransactionPool+clear"></a>

### transactionPool.clear()
Clears all transactions from the pool by setting the pool to equals an empty map object.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  
<a name="TransactionPool+setTransaction"></a>

### transactionPool.setTransaction(transaction)
Adds a new transaction to the pool.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type | Description |
| --- | --- | --- |
| transaction | [<code>Transaction</code>](#Transaction) | The transaction to add. |

<a name="TransactionPool+setMap"></a>

### transactionPool.setMap(transactionMap)
Replaces the current transaction pool with a new one. This is used when pools are updated and broadcasted from peer to peer.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type | Description |
| --- | --- | --- |
| transactionMap | [<code>transactionMap</code>](#transactionMap) | The new transaction pool. |

<a name="TransactionPool+existingTransaction"></a>

### transactionPool.existingTransaction(inputAddress) ÔçÆ [<code>Transaction</code>](#Transaction) \| <code>undefined</code>
Returns the first transaction in the pool that has a matching input address.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  
**Returns**: [<code>Transaction</code>](#Transaction) \| <code>undefined</code> - The matching transaction, or undefined if none is found.  

| Param | Type | Description |
| --- | --- | --- |
| inputAddress | [<code>publicKey</code>](#publicKey) | The inputted publicKey to match. |

<a name="TransactionPool+validTransactions"></a>

### transactionPool.validTransactions() ÔçÆ [<code>Array.&lt;Transaction&gt;</code>](#Transaction)
Returns an array of all valid transactions in the pool.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  
**Returns**: [<code>Array.&lt;Transaction&gt;</code>](#Transaction) - An array of all valid transactions.  
<a name="TransactionPool+clearBlockchainTransactions"></a>

### transactionPool.clearBlockchainTransactions(chain)
Removes all transactions from the pool that are included in the given blockchain.

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type | Description |
| --- | --- | --- |
| chain | [<code>chain</code>](#chain) | A representation of the blockchain to check against. |

<a name="Transaction"></a>

## Transaction
A transaction is a record of an interaction between a user wallet and the chain. This may be the processing of currency, an auction item, CRUD operation on an auction item or a bid.

**Kind**: global class  

* [Transaction](#Transaction)
    * [new Transaction(senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime, owner, bid, outputMap, input)](#new_Transaction_new)
    * _instance_
        * [.createMap(senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime, owner, bid)](#Transaction+createMap) ÔçÆ [<code>outputMap</code>](#outputMap)
        * [.createBid(senderWallet, Id, bid)](#Transaction+createBid) ÔçÆ [<code>outputMap</code>](#outputMap)
        * [.createAuctionItem(senderWallet, Id, name, description, startingBid, auctionEndTime, [owner])](#Transaction+createAuctionItem) ÔçÆ [<code>outputMap</code>](#outputMap)
        * [.createTransactionMap(senderWallet, recipient, amount)](#Transaction+createTransactionMap) ÔçÆ [<code>outputMap</code>](#outputMap)
        * [.createInput(senderWallet, outputMap)](#Transaction+createInput) ÔçÆ [<code>inputMap</code>](#inputMap)
        * [.updateTransaction(senderWallet, recipient, amount)](#Transaction+updateTransaction)
    * _static_
        * [.validTransaction(transaction)](#Transaction.validTransaction) ÔçÆ <code>boolean</code>
        * [.rewardTransaction(minerWallet)](#Transaction.rewardTransaction) ÔçÆ [<code>Transaction</code>](#Transaction)

<a name="new_Transaction_new"></a>

### new Transaction(senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime, owner, bid, outputMap, input)
Creates a new transaction object.


| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The wallet of the sender. |
| recipient | [<code>publicKey</code>](#publicKey) | The public key of the recipient. |
| amount | <code>number</code> | The amount to be transferred. |
| Id | <code>string</code> | The ID of the transaction. |
| name | <code>string</code> | The name of the auction item (if this transaction represents an auction). |
| description | <code>string</code> | The description of the auction item (if this transaction represents an auction). |
| startingBid | <code>number</code> | The starting bid for the auction (if this transaction represents an auction). |
| auctionEndTime | <code>number</code> | The end time for the auction (if this transaction represents an auction). |
| owner | <code>string</code> | The public key of the owner of the auction item (if this transaction represents an auction). |
| bid | <code>number</code> | The bid amount (if this transaction represents a bid). |
| outputMap | [<code>outputMap</code>](#outputMap) | The output map for the transaction. |
| input | [<code>inputMap</code>](#inputMap) | The input object for the transaction. |

<a name="Transaction+createMap"></a>

### transaction.createMap(senderWallet, recipient, amount, Id, name, description, startingBid, auctionEndTime, owner, bid) ÔçÆ [<code>outputMap</code>](#outputMap)
Creates a map representing the transaction based on the inputs given. The inputs given allow for automatic map generation selection.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>outputMap</code>](#outputMap) - The outputMap representing the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The public key of the wallet of the sender. |
| recipient | [<code>publicKey</code>](#publicKey) | The public key of the wallet of the recipient (if applicable). |
| amount | <code>number</code> | The amount to be transferred (if applicable). |
| Id | <code>string</code> | The ID of the transaction. This is seperate from the block ID and is used to identify an auction item in the event of a bid or when CRUD functions are used on a pr-existing item. |
| name | <code>string</code> | The name of the auction item (if applicable). |
| description | <code>string</code> | The description of the auction item (if applicable). |
| startingBid | <code>number</code> | The starting bid of the auction item (if applicable). |
| auctionEndTime | <code>number</code> | The end time of the auction item (if applicable). |
| owner | [<code>publicKey</code>](#publicKey) | The public key of the owner of the auction item (if applicable). |
| bid | <code>number</code> | The bid amount (if applicable). |

<a name="Transaction+createBid"></a>

### transaction.createBid(senderWallet, Id, bid) ÔçÆ [<code>outputMap</code>](#outputMap)
Creates an outputMap representing a bid on an auction item.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>outputMap</code>](#outputMap) - The map representing the bid.  

| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The public key of the wallet of the bidder. |
| Id | <code>string</code> | The ID of the auction item. |
| bid | <code>number</code> | The amount of the bid. |

<a name="Transaction+createAuctionItem"></a>

### transaction.createAuctionItem(senderWallet, Id, name, description, startingBid, auctionEndTime, [owner]) ÔçÆ [<code>outputMap</code>](#outputMap)
Creates an outputMap representing an auction item. An owner value by default is the creator of the auction unless the auctions ownership is being reassigned.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>outputMap</code>](#outputMap) - The map representing the auction item.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) |  | The public key of the wallet of the sender. |
| Id | <code>string</code> |  | The ID of the auction item. When an auction is reintiated the old ID will go here, otherwise a unique one will be cryptographically generated |
| name | <code>string</code> |  | The name of the auction item. |
| description | <code>string</code> |  | The description of the auction item. |
| startingBid | <code>number</code> |  | The starting bid of the auction item. |
| auctionEndTime | <code>number</code> |  | The end time of the auction item. |
| [owner] | [<code>publicKey</code>](#publicKey) | <code>conditional</code> | The public key of the wallet of the owner of the auction item. |

<a name="Transaction+createTransactionMap"></a>

### transaction.createTransactionMap(senderWallet, recipient, amount) ÔçÆ [<code>outputMap</code>](#outputMap)
Creates an output map for a currency transaction.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>outputMap</code>](#outputMap) - The output map for the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The public key of the wallet of the sender. |
| recipient | [<code>publicKey</code>](#publicKey) | The public key of the wallet of the recipient. |
| amount | <code>number</code> | The amount to be transferred. |

<a name="Transaction+createInput"></a>

### transaction.createInput(senderWallet, outputMap) ÔçÆ [<code>inputMap</code>](#inputMap)
Creates an inputMap for the transaction.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>inputMap</code>](#inputMap) - The input map for the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The public key of the wallet of the sender. |
| outputMap | [<code>outputMap</code>](#outputMap) | The previously generated output map for the transaction. |

<a name="Transaction+updateTransaction"></a>

### transaction.updateTransaction(senderWallet, recipient, amount)
Updates the transaction by adding a new recipient and reducing the sender's balance.

**Kind**: instance method of [<code>Transaction</code>](#Transaction)  
**Throws**:

- <code>Error</code> If the amount exceeds the sender's balance.


| Param | Type | Description |
| --- | --- | --- |
| senderWallet | [<code>Wallet</code>](#Wallet) | The wallet of the sender. This is checked to ensure that the sender has enough balance to send more currency in the chain |
| recipient | [<code>publicKey</code>](#publicKey) | The public key of the recipient. |
| amount | <code>number</code> | The amount to be transferred. |

<a name="Transaction.validTransaction"></a>

### Transaction.validTransaction(transaction) ÔçÆ <code>boolean</code>
Validates a transaction by checking the signature.

**Kind**: static method of [<code>Transaction</code>](#Transaction)  
**Returns**: <code>boolean</code> - After the transaction is verified it returns `true` if the transaction is valid, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| transaction | [<code>Transaction</code>](#Transaction) | The transaction to be validated. This is deconstructed in the method. |

<a name="Transaction.rewardTransaction"></a>

### Transaction.rewardTransaction(minerWallet) ÔçÆ [<code>Transaction</code>](#Transaction)
Creates a reward transaction for the miner who mined the block.

**Kind**: static method of [<code>Transaction</code>](#Transaction)  
**Returns**: [<code>Transaction</code>](#Transaction) - The reward transaction. By default this is set in the config file.  

| Param | Type | Description |
| --- | --- | --- |
| minerWallet | [<code>Wallet</code>](#Wallet) | The wallet of the miner. Their public key is derived from this. |

<a name="message"></a>

## message(messageObject)
Event listener for incoming messages.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| messageObject | <code>Object</code> | The message object containing the message and the channel it was received on. |

<a name="cryptoHash"></a>

## cryptoHash(...inputs) ÔçÆ <code>string</code>
Calculates the SHA256 hash of the inputs. May take several inputs

**Kind**: global function  
**Returns**: <code>string</code> - The resulting hash value in hexadecimal format.  

| Param | Type | Description |
| --- | --- | --- |
| ...inputs | <code>any</code> | The inputs to be hashed. |

<a name="verifySignature"></a>

## verifySignature(publicKey, data, signature) ÔçÆ <code>boolean</code>
Verifies a cryptographic signature using the provided public key and data. Returns if its valid

**Kind**: global function  
**Returns**: <code>boolean</code> - A boolean indicating whether the signature is valid.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | [<code>publicKey</code>](#publicKey) | The public key used to sign the data. |
| data | [<code>outputMap</code>](#outputMap) | An outputMap containing the data. |
| signature | <code>string</code> | The data that was signed. |

<a name="data"></a>

## data : [<code>Array.&lt;Transaction&gt;</code>](#Transaction)
A data object is used in the creation of a block and is a set of transactions

**Kind**: global typedef  
<a name="uuid"></a>

## uuid : <code>string</code>
A uuid is a unique cryptographicly generated identifier

**Kind**: global typedef  
<a name="transactionMap"></a>

## transactionMap : <code>Map</code>
A transaction map is a member of a transaction pool containing all yet to be mined transactions. Transactions are identified in the map by their ID.

**Kind**: global typedef  
<a name="chain"></a>

## chain : <code>Array</code>
A chain is an array object and is a version of the chain being used in another underlying operation

**Kind**: global typedef  
<a name="outputMap"></a>

## outputMap : <code>Object</code>
An outputMap is a definition of the data to be written to the chain

**Kind**: global typedef  
<a name="inputMap"></a>

## inputMap : <code>Object</code>
An inputmap is a definition of the block generated based on the inputted wallet public key and outputMap

**Kind**: global typedef  
<a name="publicKey"></a>

## publicKey : <code>string</code>
A publicKey is the shared key created in the asymetric encryption process used to generate wallet objects. This allows users to transact with each other and assign the ownership of auctions items and bids and is a component of a wallet object

**Kind**: global typedef  
<a name="transaction"></a>

## transaction : <code>Object</code>
A transaction is an event that is written to the blockchain consisting of an input and an output map.

**Kind**: global typedef  
