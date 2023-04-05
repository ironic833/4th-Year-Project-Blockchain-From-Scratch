import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import AuctionTransactionComponent from './AuctionTransactionComponent';

class Auction extends Component {

state = { displayTransaction: false };

toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction })
}

displayTransaction = () => {

    const { data } = this.props.block;


    if (this.state.displayTransaction) {
        const validTransactions = data.filter(transaction => transaction.outputMap['owner']);

        return (
            <div>
                {
                    validTransactions.map(transaction => (
                        <div key={transaction.id}>
                            <hr />
                            <AuctionTransactionComponent transaction={transaction} />
                        </div>
                    ))
                }
                <br />
                <Button variant="danger" bsSize="small" onClick={this.toggleTransaction}>Show Less</Button>
            </div>
        )
    }

    return (
        <div>
            <br />
            <Button variant="danger" bsSize="small" onClick={this.toggleTransaction}>Show More</Button>
        </div>
    );
}

render() {

    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
        <div className='Block'>
            <div>Hash: {hashDisplay}</div>
            <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
            {this.displayTransaction()}
        </div>
    );

    }
};

export default Auction;