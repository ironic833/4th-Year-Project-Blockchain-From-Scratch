const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  clear() {
    this.transactionMap = {};
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);

    console.log(JSON.stringify(inputAddress));

    return transactions.find(transaction => transaction.input.address === inputAddress);
  }

  validTransactions() {
    return Object.values(this.transactionMap).filter(
      transaction => Transaction.validTransaction(transaction)
    );
  }

  clearBlockchainTransactions({ chain }) {
    console.log("clear Block function called intial call\n");
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      console.log("clear Block function called in first loop\n");
      for (let transaction of block.data) {
        console.log("clear Block function called in second loop\n");
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }
}

module.exports = TransactionPool;
