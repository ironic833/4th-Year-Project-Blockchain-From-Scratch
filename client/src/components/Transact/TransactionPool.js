import Transaction from "../Block/Transaction";
import { Button, Alert } from 'react-bootstrap';
import React, { Component } from "react";
import history from "../../history";
import NavBar from "../Usability/Navbar";

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component { 
    state = { transactionPoolMap: {}, alertMessage: '', alertType: '' };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
        .then(response => {
            if (response.status === 200) {
                this.setState({ alertMessage: 'success' });
                this.setState({ alertType: 'success' })
                setTimeout(() => {
                    history.push('/blocks');
                }, 5000);
            } else {
                this.setState({ alertMessage: 'The mine-transactions block request did not complete.' });
            }
        }).catch(error => {
            this.setState({ alertMessage: error.message, alertType: 'danger' });
        });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        );
    }

    componentDidUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    render() {
        const { alertMessage, alertType } = this.state;

        return(
            <div className='TransactionPool'>
                <NavBar />
                <br />
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction}/>
                            </div>
                        )
                    })
                }
                <hr />
                <br />
                <Button variant="danger" onClick={this.fetchMineTransactions}>Mine the Transactions</Button>
                <br />
                <div className="banner-container">
                {alertMessage &&
                    <Alert variant={alertType} style={{ marginTop: '10px' }}>
                    {alertMessage}
                    </Alert>
                }
                </div>
                <br />
            </div>
        )
    }
}

export default TransactionPool;