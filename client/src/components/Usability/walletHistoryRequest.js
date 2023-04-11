import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";

class walletHistory extends Component {
  state = {
    walletAddress: '',
    retrievedWalletHistory: null,
    showAlert: false // new state variable to store response
  };

  updatewalletAddress = event => {
    this.setState({ walletAddress: event.target.value });
  }

  walletHistoryRequest = () => {
    const { walletAddress } = this.state;

    fetch(`${document.location.origin}/api/wallet-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress })
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ retrievedWalletHistory: json, showAlert: true }); // reload the page after response is received
      });
  }

  renderAlertBox = (historyItem) => {
    if (historyItem.owner) {
      return (
        <Alert key={historyItem.timestamp} variant="success">
          <p>Auction ID: {historyItem["auction ID"]}</p>
          <p>Name: {historyItem["name"]}</p>
          <p>Description: {historyItem["description"]}</p>
          <p>Starting bid: {historyItem["starting bid"]}</p>
          <p>Auction end time: {historyItem["auction end time"]}</p>
          <p>Owner: {historyItem["owner"]}</p>
        </Alert>
      );
    } else if (historyItem.bid){
      return (
        <Alert key={historyItem.timestamp} variant="info">
          <p>Auction ID: {historyItem["auction ID"]}</p>
          <p>Bidder: {historyItem["bidder"]}</p>
          <p>Bid: {historyItem["bid"]}</p>
        </Alert>
      );
    } /* else {
      return (
        <Alert key={historyItem.timestamp} variant="info">
          <p>{historyItem[]}</p>
        </Alert>
      );
    } */
  }

  render() {
    const { retrievedWalletHistory, showAlert } = this.state;

    return (
      <div className='walletHistory'>
        <NavBar />
        <br />
        <h3>Wallet History</h3>
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='Wallet ID'
            value={this.state.walletAddress}
            onChange={this.updatewalletAddress}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <div className="banner-container">
          {retrievedWalletHistory && showAlert && ( 
            <div>
              <h4>Wallet History:</h4>
              {retrievedWalletHistory.map((historyItem) => this.renderAlertBox(historyItem))}
            </div>
          )}
          <br />
          <Button
            variant="danger"
            onClick={this.walletHistoryRequest}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default walletHistory;