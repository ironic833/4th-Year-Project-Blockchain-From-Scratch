import React, { Component } from "react";
import WalletMnemonic from "./walletPhraseReturn";
import Navbar from "../Usability/Navbar"
import PhraseBanner from "../Usability/PhraseBanner";

class NewWalletPhrase extends Component {
    render() {
        return(
            <div className="App">
                <Navbar />
                <br />
                <h3>New Wallet Phrase</h3>
                <hr />
                <WalletMnemonic />
                <br />
                <br />
                <br />
                <PhraseBanner />
            </div>
        );
    }
}

export default NewWalletPhrase;
