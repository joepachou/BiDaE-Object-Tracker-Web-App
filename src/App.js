import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/routes';
import Auth from './js/Auth'
import Locale from './js/Locale'

const App = () => {
    return (
        <Locale>
            <Auth>
                <Router>          
                    <NavbarContainer/>
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Router>
            </Auth>
        </Locale>
    );
};

export default App;



