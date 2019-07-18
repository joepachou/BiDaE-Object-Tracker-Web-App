import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale from './js/locale';
import LocaleContext from './js/context/LocaleContext';
import AuthenticationContext from './js/context/AuthenticationContext'
import config from './js/config';
import Axios from 'axios';
import dataSrc from './js/dataSrc';
import { 
    retrieveTrackingData,
    retrieveObjectTable
} from './js/action/action';
import { connect } from 'react-redux';
import Cookies from 'js-cookie'

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
        this.getTrackingData = this.getTrackingData.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this)
    }

    componentDidMount() {
        this.getObjectTable()
        this.props.shouldTrackingDataUpdate ? this.getTrackingData() : null;
        this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
    }

    componentDidUpdate(prepProps) {
        if (prepProps.shouldTrackingDataUpdate !== this.props.shouldTrackingDataUpdate) {
            this.interval = this.props.shouldTrackingDataUpdate ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : null;
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleChangeLocale(changedLocale){
        this.setState({
            locale: locale.changeLocale(changedLocale)
        })
    }

    handleAuthentication(auth) {
        auth.authentication ? Cookies.set('userInfo', auth.userInfo) : Cookies.remove('userInfo');
        console.log(auth)
        // console.log(Cookies.get())
        this.setState({
            auth: {
                isSignin: auth.authentication,
                userInfo: auth.userInfo
            }
        })
    }
    
    getTrackingData() {

        const locationAccuracyMapToDefault = config.surveillanceMap.locationAccuracyMapToDefault;
        const locationAccuracyMapToDB =  config.surveillanceMap.locationAccuracyMapToDB;

        Axios.post(dataSrc.getTrackingData, {
            accuracyValue: this.props.locationAccuracy,
            locationAccuracyMapToDefault,
            locationAccuracyMapToDB,
        }).then(res => {
            this.props.retrieveTrackingData(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    getObjectTable() {
        Axios.get(dataSrc.getObjectTable).then(res => {
            this.props.retrieveObjectTable(res.data)
        }).catch(err => {
            console.log(err)
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
                            locale={locale} 
                            trackingData={this.retrievingTrackingData}
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

const mapStateToProps = (state) => {
    return {
        shouldTrackingDataUpdate: state.retrieveTrackingData.shouldTrackingDataUpdate,
        locationAccuracy: state.retrieveTrackingData.locationAccuracy
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        retrieveTrackingData: object => dispatch(retrieveTrackingData(object)),
        retrieveObjectTable: objectArray => dispatch(retrieveObjectTable(objectArray))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)



