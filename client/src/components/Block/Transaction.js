import React, { useState } from 'react';

const Transaction = ({ transaction }) => {

  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);
  const [bidAmount, setBidAmount] = useState('');

  const isBidTransaction = outputMap['bid'] ? true : false;
  const isOwnerTransaction = outputMap['owner'] ? true : false;
  const isRecipientTransaction = !isBidTransaction && !isOwnerTransaction;

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

  if (isBidTransaction) {
    return (
      <div className="Transaction">
        <div>Bid on Item: {`${outputMap['auction ID'].substring(0, 20)}...`}</div>
        <div>Bid from: {`${outputMap['bidder'].substring(0, 20)}...`}</div>
        <div>Bid amount: {outputMap['bid']}</div>
      </div>
    );
  }

  if (isOwnerTransaction) {
    return (
      <div className="AuctionTransaction">
        <div>Auction Item</div>
        <div>Auction ID: {outputMap['auction ID']}</div>
        <div>Name: {outputMap['name']}</div>
        <div>Description: {outputMap['description']}</div>
        <div>Starting Bid: {outputMap['starting bid']}</div>
        <div>Auction End Time: {outputMap['auction end time']}</div>
        <div>Owner: {`${outputMap['owner'].substring(0, 20)}...`} </div>
      </div>
    );
  }

  if (isRecipientTransaction) {
    return (
      <div className="Transaction">
        <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
        {recipients.map((recipient) => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
          </div>
        ))}
      </div>
    );
  }

  return null;

};

export default Transaction;