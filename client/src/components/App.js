/* 
import React, { Component } from "react";
import index from '../assets/index.png';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import NavBar from "./Navbar";

class App extends Component {
    state = { walletInfo: {}, passphrase: '' };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json })); 
    }
    
    handlePassphraseChange = (event) => {
        this.setState({ passphrase: event.target.value });
    }
    
    handlePassphraseSubmit = () => {
        fetch(`${document.location.origin}/api/wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phrase: this.state.passphrase })
        })
        .then(() => window.location.reload());
    }
    
    render() {
        const { walletInfo } = this.state;

        if (!walletInfo.address) {
            return (
                <div className="App">
                    <NavBar />
                    <br />
                    <h3>Login</h3>
                    <hr />
                    <br />
                    <div>Enter your passphrase:</div>
                    <br />
                    <FormGroup>
                        <FormControl
                            input='text'
                            placeholder='pass phrase'
                            value={this.state.passphrase}
                            onChange={this.handlePassphraseChange}
                        />
                    </FormGroup>
                    <div>
                        <br />
                        <Button
                            variant="danger"
                            onClick={this.handlePassphraseSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            );
        }

        const { address, balance } = walletInfo;

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

export default App; */

import React, { Component } from "react";
import index from '../assets/index.png';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from "./Usability/Navbar";

class App extends Component {
    state = { walletInfo: {}, passphrase: '', canSubmit: false };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json })); 
    }
    
    handlePassphraseChange = (event) => {
        const passphrase = event.target.value;
        const canSubmit = passphrase.split(' ').length >= 12;
        this.setState({ passphrase, canSubmit });
    }
    
    handlePassphraseSubmit = () => {
        fetch(`${document.location.origin}/api/wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phrase: this.state.passphrase })
        })
        .then(() => window.location.reload());
    }
    
    render() {
        const { walletInfo, canSubmit } = this.state;

        if (!walletInfo.address) {
            return (
                <div className="App">
                    <NavBar />
                    <br />
                    <h3>Login</h3>
                    <hr />
                    <br />
                    <div>Enter your passphrase:</div>
                    <br />
                    <FormGroup>
                        <FormControl
                            input='text'
                            placeholder='pass phrase'
                            value={this.state.passphrase}
                            onChange={this.handlePassphraseChange}
                        />
                    </FormGroup>
                    <div>
                        <br />
                        <Button
                            variant="danger"
                            onClick={this.handlePassphraseSubmit}
                            disabled={!canSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                    <div>
                        <br />
                        <Link to="/get-wallet">No wallet? Get one now!</Link>
                    </div>
                </div>
            );
        }

        const { address, balance } = walletInfo;

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
