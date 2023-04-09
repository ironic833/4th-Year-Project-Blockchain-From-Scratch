import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";

class walletHistory extends Component {
  state = {
    walletId: '',
    retrievedWalletHistory: null,
    alertMessage: '', 
    alertType: '' // new state variable to store response
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
        this.setState({ alertMessage: json.message, alertType: 'success' });
      })
      .catch(error => {
        this.setState({ alertMessage: error.message, alertType: 'danger' });
      });
  }

  render() {
    const { alertMessage, alertType } = this.state;

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
          <Button
            variant="danger"
            onClick={this.walletHistoryRequest}
          >
            Submit
          </Button>
          <br />
          <div className="banner-container">
          {alertMessage &&
              <Alert variant={alertType} style={{ marginTop: '10px' }}>
              {alertMessage}
              </Alert>
          }
          </div>
      </div>
    )
  }
};

export default walletHistory;