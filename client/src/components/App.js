import React, { Component } from "react";
import index from '../assets/index.png';
import NavBar from "./Usability/Navbar";

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json })); 
    }
    
    
    render() {

        const { address, balance } = this.state.walletInfo;

        return(
            <div className="App">
                <NavBar />
                <img className='logo' src={index}></img>
                <br />
                <div>
                    Welcome to the blockchain....
                </div>
                <br />
                <br />
                <div className="WalletInfo">
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;
