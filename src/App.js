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
import moment, { now } from 'moment'

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

        moment.updateLocale('en', {
            relativeTime : Object
        });

        moment.updateLocale('en', {
            relativeTime : {
                future: "in %s",
                past:   "%s ago",
                s  : '1 minute',
                ss : '1 minute',
                m:  "1 minute",
                mm: "%d minutes",
                h:  "1 hour",
                hh: "%d hours",
                d:  "1 day",
                dd: "%d days",
                M:  "1 month",
                MM: "%d months",
                y:  "1 year",
                yy: "%d years"
            }
        });
        const processedTrackingData = rawTrackingData.map(item => {


            /** Set the object's location in the form of lbeacon coordinate parsing by lbeacon uuid  */
            const lbeaconCoordinate = item.lbeacon_uuid ? this.createLbeaconCoordinate(item.lbeacon_uuid) : null;
            
            // lbsPosition.add(lbeaconCoordinate.toString());
            item.currentPosition = lbeaconCoordinate

            /** Tag the object that is found */
            item.found = moment().diff(item.last_seen_timestamp, 'seconds') < config.objectManage.notFoundObjectTimePeriod ? 1 : 0

            /** Set the residence time of the object */
            item.residence_time = this.createResidenceTime(item.first_seen_timestamp, item.last_seen_timestamp, item.found)

            /** Tag the object that is violate geofence */
            if (moment().diff(item.geofence_violation_timestamp, 'seconds') > config.objectManage.geofenceViolationTimePeriod) {
                delete item.geofence_type
            }


            /** Tag the object that is on sos */
            if (moment().diff(item.panic_timestamp, 'second') < config.objectManage.sosTimePeriod) {
                item.panic = true
            }
            
            /** Omit the unused field of the object */
            delete item.first_seen_timestamp
            delete item.last_seen_timestamp
            delete item.geofence_violation_timestamp
            delete item.panic_timestamp

            return item
        })
        return processedTrackingData
    }
    
    /** Set the residence time of the object */
    createResidenceTime(start, end, isFound) {
        const firstSeenTimestamp = moment(start)
        const lastSeenTimestamp = moment(end)
        return isFound ? lastSeenTimestamp.from(firstSeenTimestamp) : lastSeenTimestamp.fromNow();
    }

    /** Parsing the lbeacon's location coordinate from lbeacon_uuid*/
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



