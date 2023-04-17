import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";

class walletHistory extends Component {

  state = {
    walletIdSearch: '',
    retrievedWalletHistory: null,
    showAlert: false,
    currentPage: 1,
    itemsPerPage: 4
  };

  updateWalletId = event => {
    this.setState({ walletIdSearch: event.target.value });
  }

  walletHistoryRequest = () => {
      
    const { walletIdSearch } = this.state;

    if (!walletIdSearch) {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertMessage: 'All inputs must be filled'
      });
      return;
    }

    fetch(`${document.location.origin}/api/wallet-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: walletIdSearch })
    })
    .then(response => response.json())
    .then(json => {
      if (!json.length) {
        this.setState({
          retrievedWalletHistory: null,
          showAlert: true,
          currentPage: 1,
          alertType: 'danger',
          alertMessage: 'No wallet history found'
        });
      } else {
        this.setState({
          retrievedWalletHistory: json,
          showAlert: true,
          currentPage: 1,
          alertType: 'success',
          alertMessage: 'Wallet history retrieved successfully'
        });
      }
    })
    .catch(error => {
      this.setState({
        showAlert: true,
        alertType: 'danger',
        alertMessage: 'Error retrieving wallet history'
      });
      console.error('Error retrieving wallet history:', error);
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
    } else if (item.bid){
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
    const { retrievedWalletHistory, showAlert, currentPage, itemsPerPage, alertMessage, alertType } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = retrievedWalletHistory && showAlert && retrievedWalletHistory.length > 0 ? retrievedWalletHistory.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = retrievedWalletHistory ? Math.ceil(retrievedWalletHistory.length / itemsPerPage) : 0;

    return (
      <div className='auctionHistory'>
        <NavBar />
        <br />
        <h3>Wallet History</h3>
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
            placeholder='Wallet ID'
            value={this.state.walletIdSearch}
            onChange={this.updateWalletId}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br />
        <div className="banner-container">
          {retrievedWalletHistory && showAlert && ( 
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
        <Button variant="danger" onClick={this.walletHistoryRequest} style={{ margin: '0 auto', display: 'block' }}>
          Get Wallet History
        </Button>
        <br />
      </div>
    );
  }
  
}

export default walletHistory;     