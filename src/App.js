import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import config from './js/config';
import axios from 'axios';
import dataSrc from './js/dataSrc';
import { retrieveTrackingData } from './js/action/action';
import { connect } from 'react-redux';

class App extends React.Component {

    constructor() {
        super()
        this.state = { 
            locale: locale.changeLocale(config.locale.defaultLocale),
        }
        this.handleChangeLocale = this.handleChangeLocale.bind(this);
        this.getTrackingData = this.getTrackingData.bind(this);
        this.StartSetInterval = config.surveillanceMap.startInteval; 
    }

    handleChangeLocale(changedLocale){
        this.setState({
            locale: locale.changeLocale(changedLocale)
        })
    }

    componentDidMount() {
        this.getTrackingData();
        this.interval = this.StartSetInterval == true ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    getTrackingData() {
        axios.post(dataSrc.trackingData, {
            rssi: 50
        }).then(res => {
            this.props.retrieveTrackingData(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() { 
        const { locale } = this.state;
        return (
            <LocaleContext.Provider value={locale}>
                <Router>         
                    <NavbarContainer changeLocale={this.handleChangeLocale} locale={locale} trackingData={this.retrievingTrackingData}/>
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Router>
            </LocaleContext.Provider>
        );
    }  
};

const mapDispatchToProps = (dispatch) => {
    return {
        retrieveTrackingData: object => dispatch(retrieveTrackingData(object)),
    }
}

export default connect(null, mapDispatchToProps)(App)



