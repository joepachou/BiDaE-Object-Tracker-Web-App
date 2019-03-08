/** React Plugin */
import React from 'react';

/** Import Image */
import BOTLogo from '../../../img/BOTLogo.png';

const Slogan = 'BOT Real-Time Object Tracker';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            username: "",
            password: "",
            isLogin : true,
        };
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }


    componentDidUpdate(){
        if (this.state.username == 'admin' && this.state.password == 'admin' && !this.state.isLogin == true) {
            this.setState({
                isLogin: true,
            })
        }
    }

    handleLogIn(e){
        e.preventDefault()
        console.log(e)
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
            fontSize : 40,
            fontFamily : 'Comic Sans MS',
        }
        const LogoStyle = {
            alt : "",
            src : {BOTLogo},
            width : "30",
            height : "30",
            className : "d-inline-block align-top",
        }
        const NavsbarStyle = {
            fontSize : 30,
            height: 100,
            backgroundColor : '#867ce09e',
        }

        
        return (
            <div id='NAVBAR'>
                <nav className="navbar navbar-expand-lg navbar-light" style={NavsbarStyle}>
                    <a className="navbar-brand" href="#" style={SloganStyle}>
                        <img 
                            src={BOTLogo}
                            width="60"
                            height="60"
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
                            this.state.isLogin &&        
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="#">Frequent search<span className="sr-only">(current)</span></a>
                                </li>
                            
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Advanced search</a>
                                </li>
                            </ul>
                        }{
                            !this.state.isLogin &&        
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                        }
                        
                        {   
                            this.state.isLogin && 
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={this.handleLogOut}><i class="fas fa-user-alt mr-2"></i>LogOut</a>
                                </li>
                            </ul>
                        }
                        {
                            !this.state.isLogin &&
                            
                            <form className="form-inline my-2 my-lg-0" id='LoginForm'>
                                <input className="form-control mr-sm-2" type="text" placeholder="Username" id='username'/>
                                <input className="form-control mr-sm-2" type="password" placeholder="Password" id='pwd'/>
                                <button className="btn btn-secondary my-2 my-sm-0" type="submit" onClick={this.handleLogIn}>LogIn</button>
                            </form>
                        }
                        
                    </div>
                </nav>
            </div>        
        );
    }
}