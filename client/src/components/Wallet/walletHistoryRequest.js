import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";

class walletHistory extends Component {
  state = {
    walletId: '',
    retrievedWalletHistory: null // new state variable to store response
  };

  updatewalletId = event => {
    this.setState({ walletId: event.target.value });
  }

  walletHistoryRequest = () => {
    const { walletId } = this.state;

    fetch(`${document.location.origin}/api/wallet-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId })
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ retrievedWalletHistory: json }); // reload the page after response is received
      }); 
  }

  render() {
    const { retrievedWalletHistory } = this.state;

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
            value={this.state.walletId}
            onChange={this.updatewalletId}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <div>
          {retrievedWalletHistory && ( // render the response when it exists
            <div>
              <h4>Wallet History:</h4>
              <pre>{JSON.stringify(retrievedWalletHistory, null, 2)}</pre>
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