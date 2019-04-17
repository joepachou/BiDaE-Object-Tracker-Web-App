/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";


/** Import Image */
import BOTLogo from '../../../img/BOTLogo.png';
import SearchContainer from '../container/SearchContainer';
import App from '../../../App'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


export default class NavbarContainer extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            username: "",
            password: "",
            isLogin : true,
            lbeaconData: [],
            gatewayData: [],
        };
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }



    handleLogIn(e){
        e.preventDefault()
        const LoginForm = document.querySelector('#LoginForm')
        const LoginusernameValue = document.querySelector('#username')
        const LoginPWDValue = document.querySelector('#pwd')
        this.setState({
            username : LoginusernameValue.value,
            password : LoginPWDValue.value,
        })
        LoginusernameValue.value = '';
        LoginPWDValue.value = ''
    }

    handleLogOut(){
        this.setState({
            username: '',
            password: '',
            isLogin: false,
        })
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
            height: '5vh',
            backgroundColor : '#867ce09e',
        }

        
        return (
            <>
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
                    
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <Nav className="mr-auto">
                        <Nav.Item><Link to="/surveillance" className="nav-link" >Surveillance</Link></Nav.Item>
                        {/* <Nav.Item><Link to="/search" className="nav-link">Search</Link></Nav.Item> */}
                        <Nav.Item><Link to="/healthReport" className="nav-link" >HealthReport</Link></Nav.Item>
                    </Nav>
                    <Nav className="mr-2">
                        <Nav.Link ><i className="fas fa-user-alt"></i>LogOut</Nav.Link>
                    </Nav>

                </Navbar>
            </>        
        );
    }
}
