import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";

class AuctionHistory extends Component {
  state = {
    auctionItemId: '',
    retrievedAuctionHistory: null // new state variable to store response
  };

  updateauctionId = event => {
    this.setState({ auctionItemId: event.target.value });
  }

  auctionHistoryRequest = () => {
    const { auctionItemId } = this.state;

    fetch(`${document.location.origin}/api/item-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auctionItemId })
    })
      .then(response => response.json())
      .then(json => {
        this.setState({ retrievedAuctionHistory: json }); // reload the page after response is received
      }); 
  }

  render() {
    const { retrievedAuctionHistory } = this.state;

    return (
      <div className='auctionHistory'>
        <NavBar />
        <br />
        <h3>Auction History</h3>
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='Auction ID'
            value={this.state.auctionItemId}
            onChange={this.updateauctionId}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <div>
          {retrievedAuctionHistory && ( // render the response when it exists
            <div>
              <h4>Auction History:</h4>
              <pre>{JSON.stringify(retrievedAuctionHistory, null, 2)}</pre>
            </div>
          )}
          <br />
          <Button
            variant="danger"
            onClick={this.auctionHistoryRequest}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default AuctionHistory;