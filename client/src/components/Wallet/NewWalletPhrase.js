import React, { Component } from "react";
import WalletMnemonic from "./walletPhraseReturn";
import NoInputBlockNavbar from "../Usability/NoInputNavbar";
import PhraseBanner from "../Usability/PhraseBanner";

class NewWalletPhrase extends Component {
  render() {
    return (
      <div className="App">
        <NoInputBlockNavbar />
        <br />
        <h3>New Wallet Phrase</h3>
        <hr />
        <WalletMnemonic />
        <br />
        <br />
        <br />
        <div className="phrase-banner-container">
          <PhraseBanner />
        </div>
      </div>
    );
  }
}

export default NewWalletPhrase;

