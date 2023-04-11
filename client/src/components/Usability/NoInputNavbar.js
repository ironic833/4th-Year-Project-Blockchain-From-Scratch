import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';

function NoInputBlockNavbar() {
  return (
    
    <Navbar bg="dark" variant="dark" expand="lg" className='fixed-top'>
      <Container>
        <Navbar.Brand href="/">Auction Chain</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NoInputBlockNavbar;


