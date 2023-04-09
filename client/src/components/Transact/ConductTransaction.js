import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Card, Pagination, Alert } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import history from '../../history';
import NavBar from "../Usability/Navbar";

class ConductTransaction extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [], currentPage: 1, pageSize: 5, };

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }


  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  }

  conductTransaction = () => {
    const { recipient, amount } = this.state;

    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    }).then(response => response.json())
      .then(json => {
        this.setState({ alertMessage: json.message || json.type, alertType: 'success' });
        setTimeout(() => {
          if (json.type === 'error') {
            this.setState({ alertMessage: json.message });
          } else {
            history.push('/transaction-pool');
          }
        }, 5000); // delay of 5 seconds
      })
      .catch(error => {
        this.setState({ alertMessage: error.message, alertType: 'danger' });
      });
      /* .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      }); */
  }

  render() {

    const { knownAddresses, currentPage, pageSize, alertMessage, alertType } = this.state;
    const pageCount = Math.ceil(knownAddresses.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, knownAddresses.length);

    const displayedAddresses = knownAddresses.slice(startIndex, endIndex);

    return (
      <div className='ConductTransaction'>
        <NavBar />
        <br />
        <h3>Conduct a Transaction</h3>
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='recipient'
            value={this.state.recipient}
            onChange={this.updateRecipient}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <br/>
        <FormGroup>
          <FormControl
            input='number'
            placeholder='amount'
            value={this.state.amount}
            onChange={this.updateAmount}
            style={{ marginBottom: '10px', width: '60%', margin: '0 auto' }}
          />
        </FormGroup>
        <div>
          <br />
          <Button
            variant="danger"
            onClick={this.conductTransaction}
          >
            Submit
          </Button>
        </div>
        <br />
        <div className="banner-container">
          {alertMessage &&
            <Alert variant={alertType} style={{ marginTop: '10px' }}>
              {alertMessage}
            </Alert>
          }
        </div>
        <br />
        <h4>Known Addresses</h4>
        <br />
        {displayedAddresses.length === 0 ? (
          <div>
            <p>No wallets found, Check back later!</p>
          </div>
        ) : (
          <div>
            <Pagination className="justify-content-center">
              {Array.from({ length: pageCount }).map((_, index) => (
                <Button style={{ padding: 10 }} variant='danger' key={index} active={index + 1 === currentPage} onClick={() => this.handlePageChange(index + 1)}>
                  {index + 1}
                </Button>
              ))}
            </Pagination>
            <br />
            <ul style={{ listStyleType: 'none' }}>
              {displayedAddresses.map((knownAddress, index) => (
                <li key={knownAddress}>
                  <Card className="bg-dark text-white" style={{ padding: '10px', margin: 'auto', maxWidth: '800px' }}>
                    <Card.Text style={{ textAlign: 'center' }}>{knownAddress}</Card.Text>
                    <CopyToClipboard text={knownAddress}>
                      <Button variant="danger" size="sm" style={{ margin: '10px' }}>Copy</Button>
                    </CopyToClipboard>
                  </Card>
                  <br />
                </li>
              ))}
            </ul>
          </div>
        )}
        <br />
      </div>
    )
  }
};

export default ConductTransaction;
