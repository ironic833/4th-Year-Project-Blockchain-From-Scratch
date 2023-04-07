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
    TRANSACTION: 'TRANSACTION',
    PEERS: 'PEERS'
};

class PubSub {
    constructor({ blockchain, peers, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.peers = peers;
        this.wallet = wallet;
        this.heldChain = [];
        this.heldPeers = [];
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

                console.log("organised chain" + JSON.stringify(organisedChain));

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

              case CHANNELS.PEERS:
                
                this.heldPeers.push(message);

                console.log("Held Peers array" + JSON.stringify(this.heldPeers));

                this.heldPeers.sort((a, b) => {
                  const aTimestamp = new Date(a.timestamp);
                  const bTimestamp = new Date(b.timestamp);
                  return aTimestamp - bTimestamp;
                });

                const organisedPeers = this.heldPeers.map(message => message.payload);

                console.log("Peer array " + JSON.stringify(organisedPeers));

                this.peers.updatePeers(organisedPeers);

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
      

    peerPublish({ channel, message }){

      const getSize = message => {
        const aString = JSON.stringify(message);
        return (new TextEncoder().encode(aString)).length;
      };

      const messageSize = getSize(message);

      console.log(`\n Publishing message of size ${messageSize} bytes to channel ${channel} \n`);

      const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
      const ipAddress = message.match(regex)[0];

      console.log(ipAddress); 

      const timestamp = new Date().toISOString();

      this.pubnub.publish({
        channel: channel,
        message: {
            timestamp: timestamp,
            payload: ipAddress
        }
    });
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

        console.log("Chain Length is: " + this.blockchain.chain.length + "\n");

        for(let chainNumber = 0, chainItem; chainNumber < this.blockchain.chain.length; chainNumber++){

            chainItem = this.blockchain.chain[chainNumber];

            this.blockchainPublish({
                channel: CHANNELS.BLOCKCHAIN,
                message: chainItem
            });

            console.log("Message sent is: " + JSON.stringify(chainItem) + "\n");

        }

    } 
    
      
    broadcastTransaction(transaction) {
      
        this.TransactionPublish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

    broadcastPeerMembership(peerRegistration) {
      
      this.peerPublish({
          channel: CHANNELS.PEERS,
          message: JSON.stringify(peerRegistration)
      });
    }
}

module.exports = PubSub;
