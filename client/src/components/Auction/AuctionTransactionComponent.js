import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Modal, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import history from "../../history";

const AuctionTransactionComponent = ({ transaction }) => {

  const { outputMap } = transaction;
  const [bidAmount, setBidAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleBidSubmit = () => {
    // Send a request to the /place-bid endpoint with prevAuctionId and bidAmount
    fetch(`${document.location.origin}/api/place-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionItem: outputMap['auction ID'], bidAmount })
    })
    .then(response => response.json())
    .then(json => {
      setAlertMessage(json.message || json.type);
      setAlertType('success');
      setTimeout(() => {
        if (json.type === 'error') {
          setAlertMessage(json.message);
        } else {
          history.push('/transaction-pool');
        }
      }, 5000); // delay of 5 seconds
      /* alert(json.message || json.type);
      history.push('/transaction-pool'); */
    })
    .catch(error => {
      setAlertMessage(error.message);
      setAlertType('danger');
    });

    setBidAmount('');
    setShowModal(false);
  };

  return (
    <Card className="bg-dark text-white">
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
        <Button variant="danger" onClick={handleModalOpen} style={{ marginBottom: '10px' }}>Place Bid</Button>
        <Modal className='Modal' show={showModal} onHide={handleModalClose}>
          <Modal.Header className='ModalColor' closeButton>
            <Modal.Title>Bid Amount</Modal.Title>
          </Modal.Header>
          <Modal.Body className='ModalColor'>
            <FormGroup>
            <FormLabel>Bid Amount:</FormLabel>
            <FormControl type="number" placeholder="Bid Amount" value={bidAmount} onChange={handleBidAmountChange} style={{ width: '100%' }} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer className='ModalColor'>
            <Button variant="danger" onClick={handleModalClose}>Close</Button>
            <Button variant="danger" onClick={handleBidSubmit}>Submit Bid</Button>
          </Modal.Footer>
        </Modal>
        <div className="banner-container">
          {alertMessage &&
            <Alert variant={alertType} style={{ marginTop: '10px' }}>
              {alertMessage}
            </Alert>
          }
        </div>
      </Card.Body>
    </Card>
  );
}

export default AuctionTransactionComponent;
