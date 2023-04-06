import React, { Component } from 'react';
import { FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import history from '../../history';
import NavBar from "../Usability/Navbar";

class auctionTransaction extends Component {
  state = { name: '', description: '', startingBid: 0, auctionEndTime: '' };

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

    fetch(`${document.location.origin}/api/create-auction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, startingBid, auctionEndTime })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  } 

  render() {
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
      </div>
    )
  }
};

export default auctionTransaction;