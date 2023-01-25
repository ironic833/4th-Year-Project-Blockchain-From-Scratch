const PubNub = require('pubnub');

// Sets the API keys for access to PubNub
const credentials = {
    publishKey: 'pub-c-4c3f545c-0dbc-4cc9-ab49-93e01030c359',
    subscribeKey: 'sub-c-1a6dd668-345e-41b0-97c8-9e190b422e18',
    secretKey: 'sec-c-NGE1ODdjOWMtODBjNC00MTI1LTg2YmUtNzUyNGY5MGRiYjQ5'
};

// Sets up our default channels to be used by the system to allow for transactions
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};
     
 class PubSub {

    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);
         
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
         
        this.pubnub.addListener(this.listener());

    }

    handleMessage(channel, message){

        console.log(`Message recieved. Message is: ${message}. Channel is: ${channel}`);

        const parsedMessage = JSON.parse(message);

        switch(channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
            break;
            case CHANNELS.TRANSACTION:
                if(!this.transactionPool.existingTransaction({ inputAddress: this.wallet.publicKey})){
                    this.transactionPool.setTransaction(parsedMessage);
                }
            break;
            default:
                return;
        }

        if (channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    listener() {

        return {

            message: messageObject => {

                const { channel, message } = messageObject;
                 
                //console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                this.handleMessage( channel, message );
            }
        };
    }
     
    publish({ channel, message }) { 
        this.pubnub.publish({ 
            channel, 
            message,
            meta: {
                uuid: this.pubnub.getUUID()
            }
        });

        
    }

    broadcastChain(){
        this.publish({
             channel: CHANNELS.BLOCKCHAIN,
             message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

}
 
module.exports = PubSub;