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
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    handleMessage(channel, message) {
        //console.log(`Message recieved. Message is: ${message}. Channel is: ${channel}`);
        const parsedMessage = JSON.parse(message);
        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage);
                break;
            case CHANNELS.TRANSACTION:
                if (!this.transactionPool.existingTransaction({ inputAddress: this.wallet.publicKey })) {
                    this.transactionPool.setTransaction(parsedMessage);
                }
                break;
            default:
                return;
        }

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                this.handleMessage(channel, message);
            }
        };
    }

    publish({ channel, message }) {
        const getSize = message => {
            const s = JSON.stringify(message);
            return (new TextEncoder().encode(s)).length;
        };
        const messageSize = getSize(message);

        console.log(`\n Publishing message of size ${messageSize} bytes to channel ${channel} \n`);

        this.pubnub.publish({
            channel,
            message,
            meta: {
                uuid: this.pubnub.getUUID()
            },
            chunkedTransfer: true,
            storeInHistory: true
        });
    }

    // chunking problem occuring here. need to split here before sending the whole chain
    /* broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }  */


    // this works but I don't think I need the encoder and I think I need to add automatic updates as the peers don't see blocks automatically

    broadcastChain() {
        const chainString = JSON.stringify(this.blockchain.chain);
        const chunkSize = 15 * 1024; // 15kb
        const numChunks = Math.ceil(chainString.length / chunkSize);
    
        for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, chainString.length);
            const chunk = chainString.slice(start, end);
            const message = {
                chunkIndex: i,
                numChunks: numChunks,
                data: chunk
            };
            this.publish({
                channel: CHANNELS.BLOCKCHAIN,
                message: JSON.stringify(message)
            });
        }
    } 
    

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;
