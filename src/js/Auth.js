import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import dataSrc from './dataSrc';

class Auth extends React.Component {

    state = {
        authenticated: Cookies.get('authenticated') ? true : false,
        user: Cookies.get('user') ? {...JSON.parse(Cookies.get('user'))} : {role: "guest"},
        accessToken: ""
    }

    signin = (userInfo) => {
        Cookies.set('authenticated', true)
        Cookies.set('user', userInfo)
        this.setState({
            authenticated: true,
            user: {
                ...userInfo,
            }
        })
    };
  
    signout = () => {
        Cookies.remove('authenticated')
        Cookies.remove('user')
        window.location = '/'
        this.setState({
            authenticated: false,
            user: {
              role: "guest"
            },
            accessToken: ""
        });
    };

    async signup (username, password, role = 'care_provider') {
        let result = await axios.post(dataSrc.signup, {
            username,
            password,
            role,
        })
        return result
    }
  
    handleAuthentication = () => {
    };
  
    setSession(authResult) {
    }

    setCookies(key, value) {
        Cookies.set(key, value)
    }

    render() {

        const authProviderValue = {
            ...this.state,
            signin: this.signin,
            signup: this.signup,
            handleAuthentication: this.handleAuthentication,
            signout: this.signout
        };

        return (
            <AuthenticationContext.Provider value={authProviderValue}>
                {this.props.children}
            </AuthenticationContext.Provider>
        );
      }
}

export default Auth;