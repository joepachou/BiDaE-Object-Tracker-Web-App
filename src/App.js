import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/routes';
import CombinedContext from './js/context/AppContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const App = () => {
    return (
        <CombinedContext>
            <Router>          
                <NavbarContainer/>
                <Switch>
                    {renderRoutes(routes)}
                </Switch>
            </Router>
            <ToastContainer 
                position="top-left"
                autoClose={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
            />
        </CombinedContext>
    );
};

export default App;



