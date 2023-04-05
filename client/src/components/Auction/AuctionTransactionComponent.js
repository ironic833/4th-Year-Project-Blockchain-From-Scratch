/* import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const AuctionTransactionComponent = ({ transaction }) => {

  const { outputMap } = transaction;
  const [bidAmount, setBidAmount] = useState('');


  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleBidSubmit = () => {
    // Send a request to the /place-bid endpoint with prevAuctionId and bidAmount
    fetch(`${document.location.origin}/api/place-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionItem: outputMap['auction ID'], bidAmount })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  
    return (
      <Card className="bg-dark text-white">
        <Card.Img src="{outputMap['image']}" className="mx-auto" />
        <Card.Body>
          <Card.Title>Auction ID: {outputMap['auction ID']}</Card.Title>
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
          <div style={{ display: 'flex' }}>
            <input type="number" placeholder="Bid Amount" value={bidAmount} onChange={handleBidAmountChange} className="mr-2" style={{ width: '70%' }} />
            <Button variant="danger" onClick={handleBidSubmit} style={{ width: '30%' }}>Submit Bid</Button>
          </div>
        </Card.Body>
      </Card>
        


      
    );
}

  export default AuctionTransactionComponent;   */

  import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const AuctionTransactionComponent = ({ transaction }) => {

  const { outputMap } = transaction;
  const [bidAmount, setBidAmount] = useState('');


  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleBidSubmit = () => {
    // Send a request to the /place-bid endpoint with prevAuctionId and bidAmount
    fetch(`${document.location.origin}/api/place-bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prevAuctionItem: outputMap['auction ID'], bidAmount })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
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
        <FormGroup>
          <FormLabel>Bid Amount:</FormLabel>
          <FormControl type="number" placeholder="Bid Amount" value={bidAmount} onChange={handleBidAmountChange} style={{ width: '100%' }} />
        </FormGroup>
        <Button variant="danger" onClick={handleBidSubmit} style={{ marginTop: '10px' }}>Submit Bid</Button>
      </Card.Body>
    </Card>
  );
}

export default AuctionTransactionComponent;
