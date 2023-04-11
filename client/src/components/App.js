import React, { Component } from "react";
import NavBar from "./Usability/Navbar";
import Card from 'react-bootstrap/Card';

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
                <br />
                <div>
                    Welcome to the blockchain....
                </div>
                <br />
                <br />
                <div className="card-container">
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Wallet Details</Card.Header>
                        <Card.Body>
                            <Card.Title>Address</Card.Title>
                            <Card.Text>{address}</Card.Text>
                            <Card.Title>Balance</Card.Title>
                            <Card.Text>{balance}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default App;
