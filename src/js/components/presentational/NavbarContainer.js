/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../js/locale';
import styled from 'styled-components';


/** Import Image */
import BOTLogo_Green from '../../../img/BOTLogo.png';
import BOT_LOGO_RED from '../../../img/BOT_LOGO_RED_MOD.png'; 

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import LocaleContext from '../../context/LocaleContext';


class NavbarContainer extends React.Component {
    constructor() {
        super();
        this.handleLangSelect = this.handleLangSelect.bind(this);
    }

    handleLangSelect(eventKey) {
        this.props.changeLocale(eventKey);
    }

    render() {
        const NavbarStyle = {
            height: "100px",
            boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
        }
        const locale = this.context;

        return (
            <Navbar className="navbar sticky-top navbar-light" style={NavbarStyle}>
                <Navbar.Brand className='px-0 mx-0'>
                    <Link style={{color: "black"}} to="/" className="nav-link nav-brand d-flex align-items-center px-0" >
                        <img
                            alt=""
                            src={BOT_LOGO_RED}
                            width="50px"
                            className="d-inline-block align-top px-1"
                        />
                        BOT
                    </Link>
                </Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"> */}

                    <Nav className="mr-auto" >
                        <Nav.Item><Link to="/page/surveillance" className="nav-link nav-route" >{locale.surveillance}</Link></Nav.Item>
                        <Nav.Item><Link to="/page/healthReport" className="nav-link nav-route" >{locale.health_report}</Link></Nav.Item>
                        <Nav.Item><Link to="/page/geofence" className="nav-link nav-route" >Geofence</Link></Nav.Item>
                        <Nav.Item><Link to="/page/objectManagement" className="nav-link nav-route" >Object Management</Link></Nav.Item>

                    </Nav>
                    <Nav>
                        <NavDropdown title={locale.language} id="collasible-nav-dropdown" alignRight onSelect={this.handleLangSelect}>
                            {Object.values(supportedLocale).map( (locale,index) => {
                                return <NavDropdown.Item key={index} className="lang-select" eventKey={locale.abbr}>{locale.name}</NavDropdown.Item>
                            })}
                        </NavDropdown>
                        <Nav.Link ><i className="fas fa-user-alt"></i></Nav.Link>
                    </Nav>
                {/* </Navbar.Collapse> */}
            </Navbar>
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
