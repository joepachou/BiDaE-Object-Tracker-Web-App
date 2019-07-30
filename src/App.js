import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale, { supportedLocale } from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import AuthenticationContext from './js/context/AuthenticationContext'
import config from './js/config';
import Cookies from 'js-cookie';
import moment from 'moment'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
            shouldTrackingDataUpdate: props.shouldTrackingDataUpdate,
            auth: {
                isSignin: Cookies.get('userInfo') ? true : false,
                userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null
            }
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this)
    }


    handleChangeLocale(lang){
        
        moment.locale(supportedLocale[lang].abbr)
        this.setState({
            locale: locale.changeLocale(lang)
        })
    }

    handleAuthentication(auth) {
        auth.authentication ? Cookies.set('userInfo', auth.userInfo) : Cookies.remove('userInfo');
        this.setState({
            auth: {
                isSignin: auth.authentication,
                userInfo: auth.userInfo
            }
        })
    }

    render() { 
        const { locale } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <AuthenticationContext.Provider value={this.state.auth}>
                    <Router>          
                        <NavbarContainer 
                            changeLocale={this.handleChangeLocale} 
                            handleAuthentication={this.handleAuthentication}
                        />
                        <Switch>
                            {renderRoutes(routes)}
                        </Switch>
                    </Router>
                </AuthenticationContext.Provider>
            </LocaleContext.Provider>

        );
    }  
};


export default App;



