import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";
import { CopyToClipboard } from 'react-copy-to-clipboard';

class AddressBook extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <NavBar />
        <br />
        <h4>Known Addresses</h4>
        <br />
        <hr />
        <div>
            <ul style={{ listStyleType: 'none', padding: '10px', backgroundColor: '#343a40', borderRadius: '5px' }}>
                {this.state.knownAddresses.map(knownAddress => (
                <li key={knownAddress} style={{ marginBottom: '10px', color: 'white', padding: '10px', border: '1px solid white', borderRadius: '5px' }}>
                    {knownAddress}
                    <CopyToClipboard text={knownAddress}>
                        <Button variant="danger" size="sm" style={{ margin: '10px' }}>Copy</Button>
                    </CopyToClipboard>
                </li>
                ))}
            </ul>
        </div>
        <br />
      </div>
    )
  }
};

export default AddressBook;
