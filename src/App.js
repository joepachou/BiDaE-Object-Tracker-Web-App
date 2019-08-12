import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale, { supportedLocale } from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import config from './js/config';
import moment from 'moment'
import Auth from './js/Auth'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
            shouldTrackingDataUpdate: props.shouldTrackingDataUpdate,
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
    }


    handleChangeLocale(lang){
        
        moment.locale(supportedLocale[lang].abbr)
        this.setState({
            locale: locale.changeLocale(lang)
        })
    }

    render() { 
        const { locale } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <Auth>
                    <Router>          
                        <NavbarContainer 
                            changeLocale={this.handleChangeLocale} 
                        />
                        <Switch>
                            {renderRoutes(routes)}
                        </Switch>
                    </Router>
                </Auth>
            </LocaleContext.Provider>
        );
    }  
};

export default App;



