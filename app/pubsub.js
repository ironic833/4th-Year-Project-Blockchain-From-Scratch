const { json } = require('body-parser');
const PubNub = require('pubnub');

// Sets the API keys for access to PubNub
const credentials = {
    publishKey: 'pub-c-cf8ded36-161a-4a3e-8450-28c8e8190f19',
    subscribeKey: 'sub-c-ae9c669b-7259-44eb-a750-2d6019154f86',
    secretKey: 'sec-c-ZmE4NmIwNjEtYTQwMC00MzdkLThiMjMtNDI0MmU0MWRiNzE5'
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

                    /* if(this.heldChain[0] === undefined && !isNaN(message) ){
                        console.log("chain length added to held chain \n");
                        this.heldChain.push(message);
                    } */
                
                    
                    console.log("the first place undefined is " +  eval1 +  " and its not the chain end is" + eval3 + "\n");

                    if(message !== "chain end" ){

                        this.heldChain.push(message);

                    }
                    
                    if (message === "chain end" && this.heldChain[0] !== undefined){
                        console.log("chain end added to held chain");
                        /* this.heldChain[this.heldChain[0] + 1] = message; */
                        this.heldChain.push(message);
                        clearFlag = true;
                    }

                    console.log(JSON.stringify(this.heldChain));
                    /* if()(
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions(
                            { chain: parsedMessage }
                            );
                        });
                    ) */
                  break;
                case CHANNELS.TRANSACTION:
                    let parsedMessage =  JSON.stringify(message);
                    if (parsedMessage.input.address !== this.wallet.publicKey){
                        this.transactionPool.setTransaction(parsedMessage);
                    }else{
                        console.log('TRANSACTION broadcast recieved from self, ignoring..');
                    }
                    break;
              default:
                return;

            }

           /*  if (channel === CHANNELS.BLOCKCHAIN) {
                this.blockchain.replaceChain(parsedMessage);
            } */

            //console.log(JSON.stringify(this.heldChain));

            if(clearFlag === true){
                this.heldChain = [];
            }

            //console.log(JSON.stringify(this.heldChain));

            
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

    publish({ channel, message }) {
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

        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: this.blockchain.chain.length
        });

        console.log("Chain Length is: " + this.blockchain.chain.length + "\n");

        for(let chainNumber = 0, chainItem; chainNumber < this.blockchain.chain.length; chainNumber++){

            chainItem = this.blockchain.chain[chainNumber];

            this.publish({
                channel: CHANNELS.BLOCKCHAIN,
                message: chainItem
            });

            console.log("Message sent is: " + JSON.stringify(chainItem) + "\n");

        }

        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: "chain end"
        });    

        console.log("Chain end message sent \n");

    } 
      
    broadcastTransaction(transaction) {
      
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;
