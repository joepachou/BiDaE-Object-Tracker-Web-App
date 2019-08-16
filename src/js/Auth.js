import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie'

class Auth extends React.Component {

    state = {
        authenticated: Cookies.get('authenticated'),
        user: Cookies.get('user') ? {...JSON.parse(Cookies.get('user'))} : null,
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