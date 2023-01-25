const Transaction = require('../wallet/transaction');

class TransactionMiner{

    constructor({ blockchain, transactionPool, wallet, pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransaction() {
        
        // get the transactions pools valid transactions
        const validTransactions = this.transactionPool.validTransactions();

        //generate the miners reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );
        
        //add a block consisting of these transactions to the chain
        this.blockchain.addBlock({ data: validTransactions });
    
        // broadcast the updated chain
        this.pubsub.broadcastChain();

        //clear the pool
        this.transactionPool.clear();


    }
}

module.exports = TransactionMiner;