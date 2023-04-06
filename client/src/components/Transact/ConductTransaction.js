import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Card } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import history from '../../history';
import NavBar from "../Usability/Navbar";

class ConductTransaction extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }

  conductTransaction = () => {
    const { recipient, amount } = this.state;

    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  }

  render() {
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
        <h4>Known Addresses</h4>
        <br />
        <div className='known-addresses' style={{ marginTop: '20px' }}>
        <Card className='bg-dark' style={{ height: "80%", width: '90%', margin: '0 auto', overflowY: 'scroll', padding: '10px' }}>
          {this.state.knownAddresses.map(knownAddress => (
            <div key={knownAddress} style={{ marginBottom: '10px', color: 'white', padding: '10px', border: '1px solid white' }}>
              {knownAddress}
              <CopyToClipboard text={knownAddress}>
                <Button variant="danger" size="sm" style={{ margin: '10px' }}>Copy</Button>
              </CopyToClipboard>
            </div>
          ))}
        </Card>
        </div>
        <br />
      </div>
    )
  }
};

export default ConductTransaction;
