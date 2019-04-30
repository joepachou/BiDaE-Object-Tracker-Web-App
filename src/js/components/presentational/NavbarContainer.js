/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../js/locale';
import styled from 'styled-components';


/** Import Image */
import BOTLogo from '../../../img/BOTLogo.png';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import LocaleContext from '../../../LocaleContext';


class NavbarContainer extends React.Component {
    constructor() {
        super();
        this.handleLangSelect = this.handleLangSelect.bind(this);
    }

    handleLangSelect(eventKey) {
        this.props.changeLocale(eventKey);
    }

    render() {
        const Navsbar = styled(Navbar)`
            background: rgba(25, 85, 165, 0.9);//'#14477A'
            border-bottom: 3px solid rgb(16, 58, 113);
        `
        const NavBrandLink = styled(Link)`
            color: rgba(0,0,0,.5);
        `
        const locale = this.context;
        return (
            <Navsbar className="navbar sticky-top navbar-light">
                <Navbar.Brand className='px-0 mx-0'>
                    <NavBrandLink to="/" className="nav-link nav-brand d-flex align-items-center px-0" >
                        <img
                            alt=""
                            src={BOTLogo}
                            width="70px"
                            className="d-inline-block align-top px-1"
                        />
                        BOT
                    </NavBrandLink>
                </Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"> */}

                    <Nav className="mr-auto" >
                        <Nav.Item><Link to="/page/surveillance" className="nav-link nav-route" >{locale.surveillance}</Link></Nav.Item>
                        <Nav.Item><Link to="/page/healthReport" className="nav-link nav-route" >{locale.health_report}</Link></Nav.Item>
                    </Nav>
                    <Nav>
                        <NavDropdown title={locale.language} id="collasible-nav-dropdown" alignRight onSelect={this.handleLangSelect}>
                            {Object.values(supportedLocale).map( (locale,index) => {
                                return <NavDropdown.Item key={index} className="lang-select" eventKey={locale.abbr}>{locale.name}</NavDropdown.Item>
                            })}
                        </NavDropdown>
                        <Nav.Link ><i className="fas fa-user-alt">{locale.log_out}</i></Nav.Link>
                    </Nav>
                {/* </Navbar.Collapse> */}
            </Navsbar>
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
