import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function WalletMnemonic() {
  const [walletPhrase, setWalletPhrase] = useState('');

  useEffect(() => {
    fetch('/api/wallet-mnemoic-generate')
    .then(response => response.json())
    .then(data => setWalletPhrase(data));
  }, []);

  const handlePassphraseSubmit = () => {
    fetch(`${document.location.origin}/api/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phrase: walletPhrase })
    })
    .then(() => window.location.href = "/");
  }

  return (
    <div className="wallet-phrase">
      <div>{walletPhrase}</div>
      <CopyToClipboard text={walletPhrase}>
        <Button variant="danger" size="sm" style={{ margin: '10px' }}>Copy</Button>
      </CopyToClipboard>
      <Button variant="danger" size="sm" onClick={handlePassphraseSubmit}>Login with this phrase</Button>
    </div>
  );
}

export default WalletMnemonic;
