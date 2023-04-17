import React, { Component } from 'react';
import { Alert, Card, Button, Modal, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";


class PublicAuctions extends Component {
    state = {
        retrievedTransactions: [],
        showAlert: false,
        bidAmount: '',
        showModal: false,
        alertMessage: '',
        alertType: '',
        prevAuctionId: '',
        currentPage: 1, 
        itemsPerPage: 4
      };
    
      componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
          .then(response => response.json())
          .then(json => {
            const retrievedTransactions = [], auctionIDs = new Set();
            json.reverse().forEach(block => {
              block.data.forEach(transaction => {
                const auctionID = transaction.outputMap['auction ID'];
                if (transaction.outputMap.owner && !auctionIDs.has(auctionID)) {
                  retrievedTransactions.push(transaction);
                  auctionIDs.add(auctionID); // add auction ID to the Set
                }
              });
            });
            this.setState({ retrievedTransactions, showAlert: true, currentPage: 1 });
          })
          .catch(error => {
            console.error(error);
            this.setState({ alertMessage: error.message, alertType: 'danger' });
          });
      }
    
      handleBidAmountChange = (event) => {
        this.setState({ bidAmount: event.target.value });
      };

      handleUpdatePrevAuctionId = (auctionId) => {
        console.log(auctionId);
        this.setState({ prevAuctionId: auctionId });
      };      
    
      handleModalClose = () => {
        this.setState({ showModal: false });
      };
    
      handleModalOpen = () => {
        this.setState({ showModal: true });
      };
    
      handleBidSubmit = () => {
        const { bidAmount, prevAuctionId } = this.state;
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prevAuctionItem: prevAuctionId, bidAmount })
        };

        console.log(prevAuctionId + "\n");

        fetch(`${document.location.origin}/api/place-bid`, requestOptions)
          .then(response => response.json())
          .then(json => {
            const alertMessage = json.message || json.type;
            const alertType = 'success';
            this.setState({ alertMessage, alertType });
            setTimeout(() => {
              if (json.type === 'error') {
                this.setState({ alertMessage: json.message });
              } else {
                this.props.history.push('/transaction-pool');
              }
            }, 5000);
          })
          .catch(error => {
            console.error(error);
            this.setState({ alertMessage: error.message, alertType: 'danger' });
          });
        this.setState({ bidAmount: '', showModal: false/* , prevAuctionId: '' */ });
      };

      handlePaginationClick = (event) => {
        this.setState({
          currentPage: Number(event.target.id)
        });
      }


  renderAlertBox = (historyItem) => {
    const outputMap = historyItem["outputMap"];

    if (outputMap && outputMap["owner"]) {

        return (
            <Card key={historyItem.timestamp} style={{ marginBottom: 20, marginTop: 20 }}className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Auction ID: {outputMap['auction ID']}</Card.Title>
                <Card.Text>
                Name: {outputMap['name']}
                </Card.Text>
                <Card.Text>
                Description: {outputMap['description']}
                </Card.Text>
                <Card.Text>
                Starting Bid: {outputMap['starting bid']}
                </Card.Text>
                <Card.Text>
                Auction End Time: {outputMap['auction end time']}
                </Card.Text>
                <Card.Text>
                Owner: {outputMap['owner']}
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => {
                    this.handleModalOpen();
                    this.handleUpdatePrevAuctionId(outputMap['auction ID']);
                  }}
                  style={{ marginBottom: '10px' }}
                >
                  Place Bid
                </Button>
                <Modal className='Modal' show={this.state.showModal} onHide={this.handleModalClose}>
                  <Modal.Header className='ModalColor' closeButton>
                    <Modal.Title>Bid Amount</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='ModalColor'>
                    <FormGroup>
                    <FormLabel>Bid Amount:</FormLabel>
                    <FormControl type="number" placeholder="Bid Amount" value={this.state.bidAmount} onChange={this.handleBidAmountChange} style={{ width: '100%' }} />
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer className='ModalColor'>
                    <Button variant="danger" onClick={this.handleModalClose}>Close</Button>
                    <Button variant="danger" onClick={this.handleBidSubmit}>Submit Bid</Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          );
    }
  }

  render() {
    const { retrievedTransactions, showAlert, currentPage, itemsPerPage } = this.state;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = retrievedTransactions && showAlert ? retrievedTransactions.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = retrievedTransactions ? Math.ceil(retrievedTransactions.length / itemsPerPage) : 0;

    return (
      <div className='walletHistory'>
        <NavBar />
        <br />
        <h3>Auctions</h3>
        <hr />
        <div className="banner-container">
                  {this.state.alertMessage &&
                    <Alert variant={this.state.alertType} style={{ marginTop: '10px' }}>
                      {this.state.alertMessage}
                    </Alert>
                  }
                </div>
        <div className="banner-container">
          {retrievedTransactions && showAlert ? (
            <div>
              {retrievedTransactions.length ? (
                <div>
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
              ) : (
                <p>No auctions found, Check back later!</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
    
  }
}


export default PublicAuctions;

