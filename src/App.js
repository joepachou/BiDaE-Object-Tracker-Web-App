import React from 'react';

/** Container Component */
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/presentational/NavbarContainer'
import { matchRoutes,renderRoutes } from 'react-router-config';
import routes from './js/routes';
import locale, { supportedLocale } from './js/locale';
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
    
    getTrackingData() {
        Axios.get(dataSrc.getTrackingData)
        .then(res => {
            const processedTrackingData = this.handleTrackingData(res.data.rows)
            this.props.retrieveTrackingData(processedTrackingData)
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

    handleTrackingData(rawTrackingData) {
        
        let lbsPosition = new Set()
        const processedTrackingData = rawTrackingData.map(item => {
            /**
             * Every lbeacons coordinate sended by response will store in lbsPosition
             * Update(3/14): use Set instead.
             */
            const lbeaconCoordinate = this.createLbeaconCoordinate(item.lbeacon_uuid);
            lbsPosition.add(lbeaconCoordinate.toString());
            item.currentPosition = lbeaconCoordinate

            item.found = moment().diff(item.last_seen_timestamp, 'seconds') < config.objectManage.notFoundObjectTimePeriod ? 1 : 0
            const firstSeenTimestamp = moment(item.first_seen_timestamp)
            const finalSeenTimestamp = moment(item.final_seen_timestamp)
            item.residence_time = item.found ? finalSeenTimestamp.from(firstSeenTimestamp) : null;
            return item
        })
        return processedTrackingData
    }

    /**
     * Retrieve the lbeacon's location coordinate from lbeacon_uuid.
     * @param   lbeacon_uuid The uuid of lbeacon retrieved from DB.
     */
    createLbeaconCoordinate(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(6,8);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx];
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



