/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../locale/locale';


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

    handleLangSelect(eventKey,e) {
        this.props.changeLocale(eventKey);
    }

    render() {
        const SloganStyle = {
            // fontSize : 30,
            fontFamily : 'Comic Sans MS',
        }
        const LogoStyle = {
            alt : "",
            src : {BOTLogo},
            width : "20",
            height : "20",
            className : "d-inline-block align-top",
        }
        const NavsbarStyle = {
            // fontSize : 25,
            height: '6vh',
            backgroundColor : 'rgba(25, 85, 165, 0.9)',//'#14477A',
            borderBottom: "3px solid rgb(16, 58, 113)"
        }

        const linkStyle ={
            color: "rgba(240, 240, 240, 0.587)"
        }

        const locale = this.context;
        return (
            <Navbar className="navbar sticky-top navbar-light" style={NavsbarStyle}>
                <a className="navbar-brand" href="/" style={SloganStyle}>
                    <img 
                        src={BOTLogo}
                        width="40"
                        className="d-inline-block align-top"
                        alt="bot"
                    />
                    {'\u00A0'}BOT
                </a>
                <Nav className="mr-auto" >
                    <Nav.Item><Link to="/page/surveillance" className="nav-link nav-route" >{locale.surveillance}</Link></Nav.Item>
                    <Nav.Item><Link to="/page/healthReport" className="nav-link nav-route" >{locale.health_report}</Link></Nav.Item>
                </Nav>
                <Nav>
                    <NavDropdown title={locale.language} id="collasible-nav-dropdown" alignRight onSelect={this.handleLangSelect}>
                        {Object.values(supportedLocale).map( locale => {
                            return <NavDropdown.Item className="lang-select" eventKey={locale.abbr}>{locale.name}</NavDropdown.Item>
                        })}
                    </NavDropdown>
                    <Nav.Link ><i className="fas fa-user-alt">{locale.log_out}</i></Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
