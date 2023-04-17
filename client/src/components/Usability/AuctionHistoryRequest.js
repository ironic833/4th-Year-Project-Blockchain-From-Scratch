import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import NavBar from "./Navbar";

class AuctionHistory extends Component {

  state = {
    auctionItemId: '',
    retrievedAuctionHistory: null,
    showAlert: false,
    currentPage: 1,
    itemsPerPage: 4
  };

  updateauctionId = event => {
    this.setState({ auctionItemId: event.target.value });
  }

  auctionHistoryRequest = () => {
      
    const { auctionItemId } = this.state;

    if (!auctionItemId) {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertMessage: 'All inputs must be filled'
      });
      return;
    }

    fetch(`${document.location.origin}/api/item-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auctionItemId })
    })
    .then(response => response.json())
    .then(json => {
      if (!json.length) {
        this.setState({
          retrievedAuctionHistory: null,
          showAlert: true,
          currentPage: 1,
          alertType: 'danger',
          alertMessage: 'No auction history found'
        });
      } else {
        this.setState({
          retrievedAuctionHistory: json,
          showAlert: true,
          currentPage: 1,
          alertType: 'success',
          alertMessage: 'Auction history retrieved successfully'
        });
      }
    })
    .catch(error => {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertMessage: 'Error retrieving auction history'
      });
      console.error('Error retrieving auction history:', error);
    });
}


  renderAlertBox = (item) => {
    if (item.owner) {
      return (
      <Alert key={item.timestamp} variant="dark">
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
      <Alert key={item.timestamp} variant="dark">
        <p>Auction ID: {item["auction ID"]}</p>
        <p>Bidder: {item["bidder"]}</p>
        <p>Bid: {item["bid"]}</p>
      </Alert>
      );
    }
  }

  handlePaginationClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  render() {
    const { retrievedAuctionHistory, showAlert, currentPage, itemsPerPage, alertMessage, alertType } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = retrievedAuctionHistory && showAlert && retrievedAuctionHistory.length > 0 ? retrievedAuctionHistory.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = retrievedAuctionHistory ? Math.ceil(retrievedAuctionHistory.length / itemsPerPage) : 0;

    return (
      <div className='auctionHistory'>
        <NavBar />
        <br />
        <h3>Auction History</h3>
        <hr />
        <br />
        <div className="banner-container">
          {alertMessage &&
            <Alert variant={alertType} style={{ marginTop: '10px' }}>
              {alertMessage}
            </Alert>
          }
        </div>
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
              <div style={{ marginBottom: '20px' }}>
                <Button
                  variant="danger"
                  disabled={currentPage === 1}
                  onClick={() => this.setState({ currentPage: currentPage - 1 })}
                >
                  Previous
                </Button>{' '}
                <Button
                  variant="danger"
                  disabled={currentPage === totalPages}
                  onClick={() => this.setState({ currentPage: currentPage + 1 })}
                >
                  Next
                </Button>
              </div>
              {currentItems.map((item) => this.renderAlertBox(item))}
              <div style={{ marginTop: '20px' }}>
                <Button
                  variant="danger"
                  disabled={currentPage === 1}
                  onClick={() => this.setState({ currentPage: currentPage - 1 })}
                >
                  Previous
                </Button>{' '}
                <Button
                  variant="danger"
                  disabled={currentPage === totalPages}
                  onClick={() => this.setState({ currentPage: currentPage + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        <Button variant="danger" onClick={this.auctionHistoryRequest} style={{ margin: '0 auto', display: 'block' }}>
          Get Auction History
        </Button>
        <br />
      </div>
    );
  }
  
}

export default AuctionHistory;                
