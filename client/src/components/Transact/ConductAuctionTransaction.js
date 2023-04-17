import React, { Component } from 'react';
import { FormGroup, FormControl, Form, Button, Alert } from 'react-bootstrap';
import history from '../../history';
import NavBar from "../Usability/Navbar";

class auctionTransaction extends Component {
  state = { name: '', description: '', startingBid: 0, auctionEndTime: '', alertMessage: '', alertType: '' };

  updateName = event => {
    this.setState({ name: event.target.value });
  }

  updateDescription = event => {
    this.setState({ description: event.target.value });
  }


  updateStartingBid = event => {
    this.setState({ startingBid: Number(event.target.value) });
  }

  updateAuctionEndTime = event => {
    this.setState({ auctionEndTime: event.target.value });
  }

  auctionTransaction = () => {
    const { name, description, startingBid, auctionEndTime } = this.state;

    if (!name || !description || !startingBid || !auctionEndTime) {
      this.setState({ alertMessage: 'All fields are required', alertType: 'danger' });
      return;
    }

    fetch(`${document.location.origin}/api/create-auction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, startingBid, auctionEndTime })
    }).then(response => response.json())
      .then( json => {
        this.setState({ alertMessage: json.message || json.type, alertType: 'success' });
        setTimeout(() => {
            history.push('/transaction-pool');
        }, 5000); // delay of 5 seconds
      })
      .catch(error => {
        this.setState({ alertMessage: error.message, alertType: 'danger' });
      });
  } 

  render() {
    const { alertMessage, alertType } = this.state;

    return (
      <div className='AuctionTransaction'>
        <NavBar />
        <br />
        <h3>Auction a Transaction</h3>
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='item name'
            value={this.state.name}
            onChange={this.updateName}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='item description'
            value={this.state.description}
            onChange={this.updateDescription}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <FormGroup>
          <FormControl
            input='number'
            placeholder='starting bid'
            value={this.state.startingBid}
            onChange={this.updateStartingBid}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <Form.Group controlId="dob">
            <Form.Control 
              type="datetime-local" 
              placeholder="Auction end date" 
              value={this.state.auctionEndTime} 
              onChange={this.updateAuctionEndTime} 
              style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
              dateFormat="dd/mm/yyyy"
              />
        </Form.Group>
        <div>
          <br />
          <Button
            variant="danger"
            onClick={this.auctionTransaction}
          >
            Submit
          </Button>
        </div>
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

export default auctionTransaction;