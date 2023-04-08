import Alert from 'react-bootstrap/Alert';
import React from 'react';

function AdditionalContentExample() {
  return (
    <Alert variant="warning">
      <Alert.Heading>A notice about wallet phrases</Alert.Heading>
      <p>
        Please note that wallet phrases are the method by which you
        use to login to our system. Your wallet holds your auction 
        items and your coins. If you lose your wallet phrase there
        is no way to recover it.
      </p>
      <hr />
      <p className="mb-0">
        MAKE SURE YOU COPY YOUR WALLET PHRASE BEFORE LEAVING THIS PAGE  
      </p>
    </Alert>
  );
}

export default AdditionalContentExample;