
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import NavBar from "../Usability/Navbar";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Card from 'react-bootstrap/Card';

class AddressBook extends Component {
  state = {
    recipient: '',
    amount: 0,
    knownAddresses: [],
    currentPage: 1,
    pageSize: 5,
  };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  handlePrevious = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  }

  handleNext = () => {
    const { knownAddresses, currentPage, pageSize } = this.state;
    const pageCount = Math.ceil(knownAddresses.length / pageSize);
    if (currentPage < pageCount) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }

  render() {
    const { knownAddresses, currentPage, pageSize } = this.state;
    const pageCount = Math.ceil(knownAddresses.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, knownAddresses.length);

    const displayedAddresses = knownAddresses.slice(startIndex, endIndex);

    return (
      <div className='ConductTransaction'>
        <NavBar />
        <br />
        <h4>Known Addresses</h4>
        <hr />
        {displayedAddresses.length === 0 ? (
          <div>
            <br />
            <br />
            <p>No wallets found, Check back later!</p>
          </div>
        ) : (
          <div>
            <div className={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ padding: 10, marginRight: 15 }} variant='danger' disabled={currentPage === 1} onClick={this.handlePrevious}>Previous</Button>
              <Button style={{ padding: 10 }} variant='danger' disabled={currentPage === pageCount} onClick={this.handleNext}>Next</Button>
            </div>
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
            <div className={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ padding: 10, marginRight: 15 }} variant='danger' disabled={currentPage === 1} onClick={this.handlePrevious}>Previous</Button>
              <Button style={{ padding: 10 }} variant='danger' disabled={currentPage === pageCount} onClick={this.handleNext}>Next</Button>
            </div>
          </div>
        )}
        <br />
      </div>
    )
  }
};

export default AddressBook;
