import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import icon from "../../assets/icon.png"

function BlockNavbar() {
  return (
    
    <Navbar bg="dark" variant="dark" expand="lg" className='fixed-top'>
      <Container>
        <Navbar.Brand href="/"><img
            src={icon}
            className="logo"
            alt="Logo"
        />Auction Chain</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
            <NavDropdown  menuVariant="dark" title="Chain" id="basic-nav-dropdown">
              <NavDropdown.Item href="/blocks">Blocks</NavDropdown.Item>
              <NavDropdown.Item href="/auctions">Auctions</NavDropdown.Item>
              <NavDropdown.Item href="/address-book">Address Book</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/wallet-history">Wallet History</NavDropdown.Item>
              <NavDropdown.Item href="/item-history">Item History</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  menuVariant="dark" title="Transact" id="basic-nav-dropdown">
              <NavDropdown.Item href="/conduct-transaction">Send Money</NavDropdown.Item>
              <NavDropdown.Item href="/auction-transaction">Create an auction</NavDropdown.Item>
              <NavDropdown.Item href="/bid-transaction">Place a bid</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/transaction-pool">Transaction Pool</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  menuVariant="dark" title="My Items" id="basic-nav-dropdown">
              <NavDropdown.Item href="/user-auctions">My Items</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BlockNavbar;


