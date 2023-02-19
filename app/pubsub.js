const PubNub = require('pubnub');

// Sets the API keys for access to PubNub
const credentials = {
    publishKey: 'pub-c-f2ff181d-abf6-4ac0-b661-6ca1c32dec15',
    subscribeKey: 'sub-c-9f949802-b882-45c0-b4c4-6bf8f3832d45',
    secretKey: 'sec-c-NDYyM2I1MTEtMjU1OC00OWMzLTg5YWQtMTE1YjcwMTUzNTZj'
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
                this.blockchain.replaceChain(parsedMessage);
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