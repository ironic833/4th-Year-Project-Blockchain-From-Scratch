import React, { useState, useEffect } from 'react';

function WalletMnemonic() {
  const [walletPhrase, setWalletPhrase] = useState('');

  useEffect(() => {
    fetch('/api/wallet-mnemoic-generate')
      .then(response => response.json())
      .then(data => setWalletPhrase(data));
  }, []);

  return (
    <div className="wallet-phrase">
      {walletPhrase}
    </div>
  );
}

export default WalletMnemonic;
