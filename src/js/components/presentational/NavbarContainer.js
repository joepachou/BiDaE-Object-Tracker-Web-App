/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../js/locale';
import { Navbar, Nav, NavDropdown, Image  } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import SigninPage from '../container/SigninPage';
import SignupPage from '../container/SignupPage';

import config from '../../config';

class NavbarContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            isSignin: false,
            isShowSigninForm: false,
            isShowSignupForm: false,
        }
        this.handleLangSelect = this.handleLangSelect.bind(this);
        this.handleSigninFormShowUp = this.handleSigninFormShowUp.bind(this);
        this.handleSigninFormSubmit = this.handleSigninFormSubmit.bind(this);
        this.handleClickHeadIcon = this.handleClickHeadIcon.bind(this);
        this.handleSignupFormShowUp = this.handleSignupFormShowUp.bind(this);
        this.handleSignupFormSubmit = this.handleSignupFormSubmit.bind(this);

    }

    handleLangSelect(eventKey) {
        this.props.changeLocale(eventKey);
    }

    handleSigninFormShowUp() {
        this.setState({
            isShowSigninForm: true,
            isShowSignupForm: false,
        })
    }

    handleSignupFormShowUp() {
        this.setState({
            isShowSigninForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    isShowSignupForm: true,
                })
            }.bind(this),
            300
        )
    }

    handleSigninFormSubmit() {
        this.setState({
            isSignin: true,
            isShowSigninForm: false,
        })
    }

    handleSignupFormSubmit() {
        console.log('signupformcomplete')
        this.setState({
            isShowSignupForm: false,
        })
    }

    handleClickHeadIcon() {
        console.log('click head icon')
    }

    

    render() {
        const NavbarStyle = {
            height: "100px",
            boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
        }
        const locale = this.context;
        const { isSignin, isShowSigninForm, isShowSignupForm } = this.state;

        return (
            <Navbar className="navbar sticky-top navbar-light" style={NavbarStyle}>
            {console.log(this.state)}
                <Navbar.Brand className='px-0 mx-0'>
                    <Link style={{color: "black"}} to="/" className="nav-link nav-brand d-flex align-items-center px-0" >
                        <Image
                            alt=""
                            src={config.image.logo}
                            width={50}
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
                        <Nav.Link >
                            {isSignin 
                                ? <i className="fas fa-user-alt" onClick={this.handleClickHeadIcon}></i> 
                                : <div onClick={this.handleSigninFormShowUp}>Sign In</div>
                            }
                        </Nav.Link>
                    </Nav>
                <SigninPage 
                    show={isShowSigninForm}
                    handleSigninFormSubmit={this.handleSigninFormSubmit}
                    handleSignupFormShowUp={this.handleSignupFormShowUp}
                />
                <SignupPage 
                    show={isShowSignupForm}
                    handleSignupFormSubmit={this.handleSignupFormSubmit}
                />
            </Navbar>
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
