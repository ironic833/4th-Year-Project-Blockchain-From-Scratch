import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import UserAuctionTransactionComponent from './UserAuctionTransactionComponent';

class UserAuction extends Component {

  state = { displayTransaction: false, walletAddress: null };

  componentDidMount() {
    // Fetch the wallet address and store it in the component state
    fetch('/api/my-wallet-address')
      .then(res => res.json())
      .then(data => this.setState({ walletAddress: data }));
  }

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction })
  }

  displayTransaction = () => {

    const { data } = this.props.block;

    if (!this.state.walletAddress) {
      // If wallet address is not fetched yet, show loading spinner or message
      return <div>Loading wallet address...</div>;
    }

    const validTransactions = data.filter(transaction => {
      const outputMap = transaction.outputMap;
      return outputMap['owner'] === this.state.walletAddress;
    });

    if (this.state.displayTransaction) {
      return (
        <div>
          {
            validTransactions.map(transaction => (
              <div key={transaction.id}>
                <hr />
                <UserAuctionTransactionComponent transaction={transaction} />
              </div>
            ))
          }
          <br />
          <Button variant="danger" bsSize="small" onClick={this.toggleTransaction}>Show Less</Button>
        </div>
      );
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

export default UserAuction;
