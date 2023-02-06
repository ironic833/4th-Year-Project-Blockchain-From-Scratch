const PubNub = require('pubnub');

// Sets the API keys for access to PubNub
const credentials = {
    publishKey: 'pub-c-f0d1aece-b8ce-424d-93c5-057ce943ca34',
    subscribeKey: 'sub-c-9586aba2-bcae-419c-a342-c7556ac00daf',
    secretKey: 'sec-c-NzNiNGUzN2UtN2U3Yi00MzIyLWE2NDUtYWVjNTlmNjA2YWIx'
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