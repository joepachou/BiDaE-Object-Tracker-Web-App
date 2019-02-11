import React from 'react';
import logo from './img/BOT.jpg';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

export default class Banner extends React.Component {
    render() {
        return (
            <Navbar expand="xl" bg="light" variant="light">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        {'BOT Real-Time Object Tracker'}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}