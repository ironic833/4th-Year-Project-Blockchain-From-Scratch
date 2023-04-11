import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";
class AuctionHistory extends Component {
  state = {
    auctionItemId: '',
    retrievedAuctionHistory: null,
    showAlert: false
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
        this.setState({ 
          retrievedAuctionHistory: json,
          showAlert: true
        }); 
      }); 
  }

  renderAlertBox = (item) => {
    if (item.owner) {
      return (
        <Alert key={item.timestamp} variant="success">
          <p>Auction ID: {item["auction ID"]}</p>
          <p>Name: {item["name"]}</p>
          <p>Description: {item["description"]}</p>
          <p>Starting bid: {item["starting bid"]}</p>
          <p>Auction end time: {item["auction end time"]}</p>
          <p>Owner: {item["owner"]}</p>
        </Alert>
      );
    } else {
      return (
        <Alert key={item.timestamp} variant="info">
          <p>Auction ID: {item["auction ID"]}</p>
          <p>Bidder: {item["bidder"]}</p>
          <p>Bid: {item["bid"]}</p>
        </Alert>
      );
    }
  }
  
  render() {
    const { retrievedAuctionHistory, showAlert } = this.state;
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
        <div className="banner-container">
          {retrievedAuctionHistory && showAlert && ( 
            <div>
              <h4>Auction History:</h4>
              {retrievedAuctionHistory.map((item) => this.renderAlertBox(item))}
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