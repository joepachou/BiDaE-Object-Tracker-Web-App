import React from 'react';

/** Container Component */
import ContentContainer from './js/components/container/ContentContainer';
import ObjectListContainer from './js/components/container/ObjectListContainer';
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import SearchContainer from './js/components/container/SearchContainer';



class App extends React.Component {
    render() {        
        return (
            // <Router>
            <div>
                <div>
                    <NavbarContainer/>
                </div>
                <div className='my-6' id='contentContainer'>
                    {/* <Switch>
                        <Route exact path="/" component={ContentContainer} />
                        <Route path="/surveillance" component={ContentContainer} />
                        <Route path="/search" component={SearchContainer} />
                    </Switch> */}
                    <ContentContainer />
                </div>
            </div>
            // </Router>
        );
    }
    
};

export default App