import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie'

class Auth extends React.Component {

    state = {
        authenticated: false,
        user: {
            role: "guest"
        },
        accessToken: ""
    }

    signin = (user) => {
        Cookies.set('authenticated', true)
        this.setState({
            authenticated: true,
            user: {
                ...user,
                role: "register"
            }
        })
    };
  
    signout = () => {
        Cookies.remove('authenticated')
        this.setState({
            authenticated: false,
            user: {
              role: "guest"
            },
            accessToken: ""
        });

    };
  
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