import React, { Component } from "react";

class App extends Component {
    state = { walletInfo: { address: 'fooxv6' , balance: 9999 }};

    componentDidMount() {
        fetch(); 
    }
    
    render() {

        const { address, balance } = this.state.walletInfo;

        return(
            <div>
                Welcome to the blockchain....
                <div>Address: {address}</div>
                <div>Balance: {balance}</div>
            </div>
        );
    }
}

export default App;