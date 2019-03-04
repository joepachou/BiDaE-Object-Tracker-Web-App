/** React Plugin */
import React from 'react';

/** Import Image */
import Logo from '../../../img/BOT.png';

const Slogan = 'BOT Real-Time Object Tracker';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            username: "",
            password: "",
            isLogin : false,
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
        console.log('handleLogIn2')
    }


    
    handleLogOut(){
        this.setState({
            username : '',
            password : '',
        })
    }

    render() {
        const SloganStyle = {
            fontSize : 30,
            fontFamily : 'Comic Sans MS',
        }
        const LogoStyle = {
            alt : "",
            src : {Logo},
            width : "30",
            height : "30",
            className : "d-inline-block align-top",
        }
        const NavsStyle = {
            fontSize : 20,
            backgroundColor : '#867ce09e',
        }
        
        return (
            <div id='NAVBAR'>
                <nav className="navbar navbar-expand-lg navbar-light" style={NavsStyle}>
                    <a className="navbar-brand" href="#" style={SloganStyle}>
                        <img 
                            src={Logo}
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                            alt="bot"
                        />
                        {'\u00A0'}BOT
                    </a>
                    
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {
                            (this.state.username === 'admin' && this.state.password === 'admin') &&        
                            <ul className="navbar-nav mr-auto">
                                {/* Folloing li items can be one sort of component */}              
                                <li className="nav-item active">
                                    <a className="nav-link" href="#">Frequent search<span className="sr-only">(current)</span></a>
                                </li>
                            
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Advanced search</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="#">Object management</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" href="#">Surveillance</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                        }{
                            (this.state.username !== 'admin' && this.state.password !== 'admin') &&        
                        
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                        }
                        {   
                            (this.state.username === 'admin' && this.state.password === 'admin') && 
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={this.handleLogOut}><i class="fas fa-user-alt mr-2"></i>LogOut</a>
                                </li>
                            </ul>
                        }
                        {
                            (this.state.username !== 'admin' && this.state.password !== 'admin') &&
                        <form class="form-inline my-2 my-lg-0" id='LoginForm'>
                            <input class="form-control mr-sm-2" type="text" placeholder="Username" id='username'/>
                            <input class="form-control mr-sm-2" type="password" placeholder="Password" id='pwd'/>
                            <button class="btn btn-secondary my-2 my-sm-0" type="submit" onClick={this.handleLogIn}>LogIn</button>
                        </form>
                        }
                    </div>
                </nav>
            </div>        
        );
    }
}