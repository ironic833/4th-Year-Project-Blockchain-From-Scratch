import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import history from '../../history';
import NavBar from "../Usability/Navbar";

class bidTransaction extends Component {
  state = { prevAuctionItem: '', bidAmount: 0 };

  updatePrevAuctionItem = event => {
    this.setState({ prevAuctionItem: event.target.value });
  }

  updatebidAmount = event => {
    this.setState({ bidAmount: event.target.value });
  }

  bidTransaction = () => {
    const { prevAuctionItem, bidAmount } = this.state;

    fetch(`${document.location.origin}/api/place-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionItem, bidAmount })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  }

  render() {
    return (
      <div className='BidTransaction'>
        <NavBar />
        <br />
        <h3>Place a bid</h3>
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='auction id'
            value={this.state.prevAuctionItem}
            onChange={this.updatePrevAuctionItem}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <FormGroup>
          <FormControl
            input='number'
            placeholder='starting bid'
            value={this.state.bidAmount}
            onChange={this.updatebidAmount}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <div>
          <br />
          <Button
            variant="danger"
            onClick={this.bidTransaction}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
  
};

export default bidTransaction;