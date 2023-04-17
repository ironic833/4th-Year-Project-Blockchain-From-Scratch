import React, { Component } from 'react';
import { Alert, Card, Button, Modal, Form } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";


class UserAuctionScreen extends Component {
    state = {
        walletInfo: {},
        retrievedTransactions: [],
        revisedStartingBid: '', 
        revisedAuctionEndTime: '',
        showAlert: false,
        showModal: false,
        alertMessage: '',
        alertType: '',
        prevAuctionId: '',
        currentPage: 1, 
        itemsPerPage: 4
      };
    
  
     /*  componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
          .then(response => response.json())
          .then(json => {
            const retrievedTransactions = [];
            json.forEach(block => {
              block.data.forEach(transaction => {
                if (transaction.outputMap.owner) {
                  retrievedTransactions.push(transaction);
                }
              });
            });
            this.setState({ retrievedTransactions, showAlert: true, currentPage: 1 });
          })
          .catch(error => {
            console.error(error);
            this.setState({ alertMessage: error.message, alertType: 'danger' });
          });
      } */

      componentDidMount() {

        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json })).then( 
        
              fetch(`${document.location.origin}/api/blocks`)
              .then(response => response.json())
              .then(json => {
                const retrievedTransactions = [], { address } = this.state.walletInfo, auctionIDs = new Set(); // create a Set to store unique auction IDs
                json.reverse().forEach(block => {
                  block.data.forEach(transaction => {
                    const auctionID = transaction.outputMap['auction ID'];
                    if (transaction.outputMap.owner === address && !auctionIDs.has(auctionID)) {
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
              })

        /* fetch(`${document.location.origin}/api/blocks`)
          .then(response => response.json())
          .then(json => {
            const retrievedTransactions = [], { address } = this.state.walletInfo;
            console.log(address);
            json.forEach(block => {
              block.data.forEach(transaction => {
                if (transaction.outputMap.owner === address) {
                  retrievedTransactions.push(transaction);
                }
              });
            });
            this.setState({ retrievedTransactions, showAlert: true, currentPage: 1 });
          })
          .catch(error => {
            console.error(error);
            this.setState({ alertMessage: error.message, alertType: 'danger' });
          }) */);
      }
      
    
      handleBidAmountChange = event => {
        this.setState({ revisedStartingBid: event.target.value });
      };

      handleAuctionTimeChange = event => {
        this.setState({ revisedAuctionEndTime: event.target.value });
      };

      handleAuctionEnd = () => {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prevAuctionId: this.state.prevAuctionId })
        };

        // Send a request to the /api/end-auction endpoint with prevAuctionId
        fetch(`${document.location.origin}/api/end-auction`, requestOptions)
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
      };

      handleAuctionClose = () => {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prevAuctionItem: this.state.prevAuctionId })
        };

        // Send a request to the /api/end-auction endpoint with prevAuctionId
        fetch(`${document.location.origin}/api/close-auction`, requestOptions)
          .then(response => response.json())
          .then(json => {
            const alertMessage = json.message || json.type;
            const alertType = 'success';
            this.setState({alertMessage, alertType});
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
        this.setState({ showModal: false  });
      };

      handleReinitiateAuction = () => {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prevAuctionItem: this.state.prevAuctionId, revisedStartingBid: this.state.revisedStartingBid, revisedAuctionEndTime: this.state.revisedAuctionEndTime })
        };

        // Send a request to the /api/end-auction endpoint with prevAuctionId
        fetch(`${document.location.origin}/api/reinitiate-auction`, requestOptions)
          .then(response => response.json())
          .then(json => {
            const alertMessage = json.message || json.type;
            const alertType = 'success';
            this.setState({alertMessage, alertType});
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
        this.setState({ showModal: false  });
      };

      handleUpdatePrevAuctionIdEnd = (auctionId) => {
        this.setState({ prevAuctionId: auctionId }, () => {
            this.handleAuctionEnd();
        });
      };

      handleUpdatePrevAuctionIdClose = (auctionId) => {
        this.setState({ prevAuctionId: auctionId }, () => {
            this.handleAuctionClose();
        });
      };

      handleUpdatePrevAuctionId = (auctionId) => {
        this.setState({ prevAuctionId: auctionId });
      };
         
    
      handleModalClose = () => {
        this.setState({ showModal: false });
      };
    
      handleModalOpen = () => {
        this.setState({ showModal: true });
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
                <Button variant="danger" onClick={() => {this.handleUpdatePrevAuctionIdEnd(outputMap['auction ID'])}} style={{ marginTop: '10px', marginRight: '10px' }}>End Auction</Button>
                <Button variant="danger" onClick={() => {this.handleUpdatePrevAuctionIdClose(outputMap['auction ID'])}} style={{ marginTop: '10px', marginRight: '10px' }}>Close Auction</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    this.handleModalOpen();
                    this.handleUpdatePrevAuctionId(outputMap['auction ID']);
                  }}
                  style={{ marginTop: '10px' }}
                >
                  Reinitiate Auction
                </Button>
                <Modal className='Modal' show={this.state.showModal} onHide={this.handleModalClose} backdrop="static" keyboard={false} >
                  <Modal.Header className='ModalColor' closeButton>
                    <Modal.Title>Reinitiate Auction</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='ModalColor'>
                    <Form>
                      <Form.Group controlId="revisedStartingBid">
                        <Form.Label>Revised Starting Bid</Form.Label>
                        <Form.Control type="number" placeholder="Enter revised starting bid" value={this.state.revisedStartingBid} onChange={this.handleBidAmountChange} />
                      </Form.Group>
                      <Form.Group controlId="revisedAuctionEndTime">
                        <Form.Label>Revised Auction End Time</Form.Label>
                        <Form.Control type="datetime-local" placeholder="Enter revised auction end time" value={this.state.revisedAuctionEndTime} onChange={this.handleAuctionTimeChange} />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer className='ModalColor'>
                    <Button variant="danger" onClick={this.handleModalClose}>Close</Button>
                    <Button variant="danger" onClick={this.handleReinitiateAuction}>Save Changes</Button>
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
        <h3>User Owned Auctions</h3>
        <hr />
        <div className="banner-container">
          {this.state.alertMessage &&
            <Alert variant={this.state.alertType} style={{ marginTop: '10px' }}>
              {this.state.alertMessage}
            </Alert>
          }
        </div>
        <div className="banner-container">
          {retrievedTransactions && showAlert && retrievedTransactions.length > 0 ? ( 
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
            <div>
              <p>No user items found, Check back later!</p>
            </div>
          )}
        </div>
        <br />
      </div>
    );
    
  }
}


export default UserAuctionScreen;

