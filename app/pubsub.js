
const PubNub = require('pubnub');

// Sets the API keys for access to PubNub
const credentials = {
  publishKey: 'pub-c-cfc32bfe-8f42-4848-8678-53d06f894bc9',
  subscribeKey: 'sub-c-61d414a4-c78e-43af-82eb-7e799ba3080b',
  secretKey: 'sec-c-YzFiYWUzYTMtY2QyOC00YzEyLTk3ZWEtNDU4YjY0MjYyMTc2'
};

// Sets up our default channels to be used by the system to allow for transactions
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.heldChain = [];
        this.pubnub = new PubNub(credentials);
        
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
          message: messageObject => {
            const { channel, message } = messageObject;
      
            let clearFlag = false;
      
            console.log(`Message received. Channel: ${channel}. Message: ${JSON.stringify(message)}`);
      
            switch(channel) {
              case CHANNELS.BLOCKCHAIN:
                if (message !== "chain end") {
                  this.heldChain.push(message);
                } else if (this.heldChain[0] !== undefined) {
                  console.log("chain end added to held chain");
                  this.heldChain.push(message);
                  clearFlag = true;
                }
      
                // Sort the messages by their timestamps before adding them to the heldChain
                this.heldChain.sort((a, b) => {
                  const aTimestamp = new Date(a.timestamp);
                  const bTimestamp = new Date(b.timestamp);
                  return aTimestamp - bTimestamp;
                });
      
                console.log(JSON.stringify(this.heldChain));

                const organisedChain = this.heldChain.map(message => message.payload);

                console.log(JSON.stringify(organisedChain));

                this.blockchain.replaceChain(organisedChain, true, () => {
                    this.transactionPool.clearBlockchainTransactions(
                      { chain: organisedChain }
                    );
                  });
      
                break;
              case CHANNELS.TRANSACTION:
                let parsedMessage = JSON.parse(message);
                if (parsedMessage.input.address !== this.wallet.publicKey){
                  this.transactionPool.setTransaction(parsedMessage);
                } else {
                  console.log('TRANSACTION broadcast received from self, ignoring..');
                }
                break;
              default:
                return;
            }
      
            if (clearFlag === true) {
              this.heldChain = [];
            }
          }
        }
      }
      

    TransactionPublish({ channel, message }) {
        const getSize = message => {
            const aString = JSON.stringify(message);
            return (new TextEncoder().encode(aString)).length;
        };
        const messageSize = getSize(message);

        console.log(`\n Publishing message of size ${messageSize} bytes to channel ${channel} \n`);

        this.pubnub.publish({
            channel,
            message,
        });
    }

    blockchainPublish({ channel, message }) {
        const getSize = message => {
            const aString = JSON.stringify(message);
            return (new TextEncoder().encode(aString)).length;
        };
        const messageSize = getSize(message);

        console.log(`\n Publishing message of size ${messageSize} bytes to channel ${channel} \n`);

        const timestamp = new Date().toISOString(); // get the current timestamp in ISO format

        this.pubnub.publish({
            channel: channel,
            message: {
                timestamp: timestamp,
                payload: message
            }
        });
    }

   broadcastChain() {

        /* this.blockchainPublish({
            channel: CHANNELS.BLOCKCHAIN,
            message: this.blockchain.chain.length
        }); */

        console.log("Chain Length is: " + this.blockchain.chain.length + "\n");

        for(let chainNumber = 0, chainItem; chainNumber < this.blockchain.chain.length; chainNumber++){

            chainItem = this.blockchain.chain[chainNumber];

            this.blockchainPublish({
                channel: CHANNELS.BLOCKCHAIN,
                message: chainItem
            });

            console.log("Message sent is: " + JSON.stringify(chainItem) + "\n");

        }

       /*  this.blockchainPublish({
            channel: CHANNELS.BLOCKCHAIN,
            message: "chain end"
        });    

        console.log("Chain end message sent \n"); */

    } 
    
      
    broadcastTransaction(transaction) {
      
        this.TransactionPublish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;
