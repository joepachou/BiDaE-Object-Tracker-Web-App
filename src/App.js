import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './LocaleContext';

class App extends React.Component {

    constructor() {
        super()
        this.state = { 
            locale: locale.changeLocale('tw'),
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
    }

    handleChangeLocale(lang){
        this.setState({
            locale: locale.changeLocale(lang)
        })
    }

    render() { 
        const { locale, lang } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <Router>         
                    <NavbarContainer changeLocale={this.handleChangeLocale} lang={lang}/>
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