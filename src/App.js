import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import config from './js/config';

class App extends React.Component {

    constructor() {
        super()
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
    }

    handleChangeLocale(changedLocale){
        this.setState({
            locale: locale.changeLocale(changedLocale)
        })
    }

    render() { 
        const { locale } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <Router>         
                    <NavbarContainer changeLocale={this.handleChangeLocale} locale={locale}/>
                    <div className='my-6' id='contentContainer'>
                        <Switch>
                            {renderRoutes(routes)}
                        </Switch>
                    </div>       
                </Router>
            </LocaleContext.Provider>
        );
    }  
};

export default App