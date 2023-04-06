import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const UserAuctionTransactionComponent = ({ transaction }) => {
  const { outputMap } = transaction;

  const [showModal, setShowModal] = useState(false);
  const [revisedStartingBid, setRevisedStartingBid] = useState(0);
  const [revisedAuctionEndTime, setRevisedAuctionEndTime] = useState('');

  const handleAuctionEnd = () => {
    // Send a request to the /api/end-auction endpoint with prevAuctionId
    fetch(`${document.location.origin}/api/end-auction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionId: outputMap['auction ID'] })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  };

  const handleAuctionClose = () => {
    // Send a request to the /api/close-auction endpoint with prevAuctionId
    fetch(`${document.location.origin}/api/close-auction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionItem: outputMap['auction ID'] })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleReinitiateAuction = () => {
    // Send a request to the /api/reinitiate-auction endpoint with prevAuctionItem, revisedStartingBid, and revisedAuctionEndTime
    fetch(`${document.location.origin}/api/reinitiate-auction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prevAuctionItem: outputMap['auction ID'],
        revisedStartingBid,
        revisedAuctionEndTime
      })
    })
      .then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });

    // Reset the form values and close the modal
    setRevisedStartingBid(0);
    setRevisedAuctionEndTime('');
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
          Auction End Time:  {outputMap['auction end time']}
        </Card.Text>
        <Card.Text>
          Owner:  {outputMap['owner']}
        </Card.Text>
        <Button variant="danger" onClick={handleAuctionEnd} style={{ marginTop: '10px', marginRight: '10px' }}>End Auction</Button>
        <Button variant="danger" onClick={handleAuctionClose} style={{marginTop: '10px', marginRight: '10px'}}>Close Auction</Button>
        <Button variant="danger" onClick={handleModalShow} style={{ marginTop: '10px', marginRight: '10px' }}>Reinitiate Auction</Button>
        <Modal className='Modal' show={showModal} onHide={handleModalClose} backdrop="static" keyboard={false} >
          <Modal.Header className='ModalColor' closeButton>
            <Modal.Title>Reinitiate Auction</Modal.Title>
          </Modal.Header>
          <Modal.Body className='ModalColor'>
            <Form>
              <Form.Group controlId="revisedStartingBid">
                <Form.Label>Revised Starting Bid</Form.Label>
                <Form.Control type="number" placeholder="Enter revised starting bid" value={revisedStartingBid} onChange={(e) => setRevisedStartingBid(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="revisedAuctionEndTime">
                <Form.Label>Revised Auction End Time</Form.Label>
                <Form.Control type="datetime-local" placeholder="Enter revised auction end time" value={revisedAuctionEndTime} onChange={(e) => setRevisedAuctionEndTime(e.target.value)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className='ModalColor'>
            <Button variant="danger" onClick={handleModalClose}>Close</Button>
            <Button variant="danger" onClick={handleReinitiateAuction}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
    );
  };

export default UserAuctionTransactionComponent;


