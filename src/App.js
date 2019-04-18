import React from 'react';

/** Container Component */
import ContentContainer from './js/components/container/ContentContainer';
import ObjectListContainer from './js/components/container/ObjectListContainer';
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import SearchContainer from './js/components/container/SearchContainer';
import HealthReport from './js/components/container/HealthReport';



class App extends React.Component {
    render() {        
        return (
            <Router>
            
                <div>
                    <NavbarContainer/>
                </div>
                <div className='my-6' id='contentContainer'>
                    <Switch>
                        <Route exact path="/" component={ContentContainer} />
                        <Route path="/page/surveillance" component={ContentContainer} />
                        {/* <Route path="/search" component={SearchContainer} /> */}
                        <Route path="/page/healthReport" component={HealthReport} />
                    </Switch>
                </div>
            
            </Router>
        );
    }
    
};

export default App