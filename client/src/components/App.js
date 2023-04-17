import React, { Component } from "react";
import NavBar from "./Usability/Navbar";
import { Button, Card } from 'react-bootstrap';
import { BsLinkedin, BsFillFileEarmarkPdfFill, BsGithub, BsFillFileCodeFill, BsFillMenuButtonWideFill, BsWindowDesktop } from "react-icons/bs";


class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json })); 
    }
    
    render() {

        return(
            <div className="App">
                <NavBar />
                <br />
                <br />
                <div className="card-container">
                    <Card className="bg-dark text-white">
                        <Card.Header>Documentation</Card.Header>
                        <Card.Body>
                            <Button variant="danger" className="home-card-button" onClick={() => window.open('https://github.com/ironic833/4th-Year-Project-Blockchain-From-Scratch')}><BsFillFileCodeFill />  Read the code documentation</Button>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Deliverables</Card.Header>
                        <Card.Body>
                            <Button variant="danger" className="home-card-button" onClick={() => window.open('https://blocktestpeer.herokuapp.com/')}><BsFillMenuButtonWideFill />  View demo version</Button>
                            <Button variant="danger" className="home-card-button" onClick={() => window.open('https://github.com/ironic833/4th-Year-Project-Blockchain-From-Scratch/releases/tag/Release-V2')}><BsWindowDesktop />  Download the desktop app</Button>
                        </Card.Body>
                    </Card>
                    <Card className="bg-dark text-white">
                        <Card.Header>Contact Me</Card.Header>
                        <Card.Body>
                            <Button variant="danger" className="home-card-button" onClick={() => window.open('https://github.com/ironic833')}><BsGithub />  Github</Button>
                            <Button variant="danger" className="home-card-button" onClick={() => window.open('https://www.linkedin.com/in/oisin-hickey-333572150')}><BsLinkedin />  Linkedin</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default App;
