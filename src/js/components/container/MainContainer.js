import React from 'react';
import SearchContainer from './SearchContainer';
import 'react-table/react-table.css';
import SearchResultList from '../presentational/SearchResultList'
import { 
    Row, 
    Col, 
    Toast,
    Button,
    ButtonGroup
} from 'react-bootstrap'
import SurveillanceContainer from './SurveillanceContainer';
import config from '../../config';
import InfoPrompt from '../presentational/InfoPrompt';
import _ from 'lodash'
import axios from 'axios';
import dataSrc from '../../dataSrc'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';
import ToastNotification from '../presentational/ToastNotification'
import {
    BrowserView,
    MobileOnlyView,
    TabletView
} from 'react-device-detect'
import { disableBodyScroll } from 'body-scroll-lock';
import retrieveDataHelper from '../../helper/retrieveDataHelper';

const {
    ALL_DEVICES,
    MY_DEVICES,
    ALL_PATIENTS,
    MY_PATIENTS,
    OBJECTS,
} = config.frequentSearchOption

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        proccessedTrackingData: [],
        lbeaconPosition: [],
        geofenceConfig: null,
        locationMonitorConfig: null,
        violatedObjects: {},
        hasSearchKey: false,
        searchKey: '',
        lastsearchKey: '',
        searchResult: [],
        colorPanel: null,
        clearColorPanel: false,
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        authenticated: this.context.auth.authenticated,
        shouldUpdateTrackingData: true,
        markerClickPackage: {},
        showPath: false,
        pathMacAddress:'',
        display: true,
        showMobileMap: true,
        searchedObjectType: [],
        showedObjects: [],
    }

    componentDidMount = () => {

        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);

        // this.getTrackingData();
        this.getLbeaconPosition();
        this.getGeofenceConfig();
        this.getLocationMonitorConfig()
        this.interval = setInterval(() => {
            this.getTrackingData()
        }, config.mapConfig.intervalTime)
    }

    componentDidUpdate = (prevProps, prevState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, prevState.trackingData))

        let { 
            stateReducer
         } = this.context

        /** stop getTrackingData when editing object status  */
        if (stateReducer[0].shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData) {
            let [{shouldUpdateTrackingData}] = stateReducer
            this.interval = shouldUpdateTrackingData 
                ?   setInterval(() => {
                        this.getTrackingData()
                    }, config.mapConfig.intervalTime) 
                :   clearInterval(this.interval);
            this.setState({
                shouldUpdateTrackingData
            })
        }

        /** refresh search result if the search results are change */
        if (isTrackingDataChange && this.state.hasSearchKey) {
            this.handleRefreshSearchResult()
        }

        /** clear out search result when user sign out */
        if (!(_.isEqual(prevState.authenticated, this.context.auth.authenticated))) {
            this.setState({
                authenticated: this.context.auth.authenticated,
                searchResult: [],
                searchKey: '',
                hasSearchKey: false,
                searchedObjectType: [],
                showedObjects: [],
            })
        } 

        /** send toast if there are latest violated notification */
        let newViolatedObject = Object.keys(this.state.violatedObjects).filter(item => !Object.keys(prevState.violatedObjects).includes(item))
        if (newViolatedObject.length !== 0 ) {
            newViolatedObject.map(item => {
                this.getToastNotification(this.state.violatedObjects[item])
            })
        }
    }

    shouldComponentUpdate = (nextProps,nextState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, nextState.trackingData))
        let hasSearchKey = nextState.hasSearchKey !== this.state.hasSearchKey
        let isSearchKeyChange = this.state.searchKey !== nextState.searchKey
        let isSearchResultChange = !(_.isEqual(this.state.searchResult, nextState.searchResult))
        let isGeoFenceDataChange = !(_.isEqual(this.state.geofenceConfig, nextState.geofenceConfig))
        let isLocationConfigChange = !(_.isEqual(this.state.locationMonitorConfig, nextState.locationMonitorConfig))
        let isLbeaconPositionChange = !(_.isEqual(this.state.lbeaconPosition, nextState.lbeaconPosition))
        let isShowedObjectsChange = !(_.isEqual(this.state.showedObjects, nextState.showedObjects))
        let isViolatedObjectChange = !(_.isEqual(this.state.violatedObjects, nextState.violatedObjects))
        let showMobileMap = !(_.isEqual(this.state.showMobileMap, nextState.showMobileMap))
        let display = !(_.isEqual(this.state.display, nextState.display)) 
        let pathMacAddress = !(_.isEqual(this.state.pathMacAddress, nextState.pathMacAddress)) 
        let isHighlightSearchPanelChange = !(_.isEqual(this.state.isHighlightSearchPanel, nextState.isHighlightSearchPanel))
        let shouldUpdate = isTrackingDataChange || 
                                isShowedObjectsChange ||
                                hasSearchKey || 
                                isSearchKeyChange || 
                                isSearchResultChange || 
                                isHighlightSearchPanelChange || 
                                isGeoFenceDataChange ||
                                isViolatedObjectChange ||
                                showMobileMap ||
                                display ||
                                pathMacAddress ||
                                isLocationConfigChange ||
                                isLbeaconPositionChange 
        return shouldUpdate
    }

    getToastNotification = (item) => {
        item.notification.map(event => {
            let toastId = `${item.mac_address}-${event.type}`
            let toastOptions = {
                hideProgressBar: true,
                autoClose: false,
                onClose: this.onCloseToast,
                toastId
            }
            this.getToastType(event.type, item, toastOptions, event.time)  
        })
    }

    getToastType = (type, data, option, time) => {
        return toast[config.toastMonitorMap[type]](
            <ToastNotification data={data} time={time} type={type}/>, 
            option
        )
    }

    onCloseToast = (toast) => {
        let mac_address = toast.data ? toast.data.mac_address : toast.mac_address;
        let monitor_type = toast.type
        let toastId = `${mac_address}-${monitor_type}`
        let violatedObjects = this.state.violatedObjects
        delete violatedObjects[toastId]
        axios.post(dataSrc.checkoutViolation, {
            mac_address,
            monitor_type
        })
        .then(res => {
            this.setState({
                violatedObjects
            })
        })
        .catch(err => {
            console.log(`checkout violation fail: ${err}`)
        })
    }

    /** Clear the recorded violated object */
    clearAlerts = () => {
        Object.values(this.state.violatedObjects).map(item => {
            item.notification.map(event => {
                let dismissedObj = {
                    mac_address: item.mac_address,
                    type: event.type
                }

                this.onCloseToast(dismissedObj)
            })
        })
        toast.dismiss()
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    /** get the latest search results */
    handleRefreshSearchResult = () => {
        let { searchKey, colorPanel, searchValue, markerClickPackage } = this.state
        this.getSearchKey(searchKey, colorPanel, searchValue, markerClickPackage)
    }

    /** set the geofence and location monitor enable */
    setMonitor = (type) => {

        let { 
            stateReducer 
        } = this.context

        let [
            {areaId}, 
        ] = stateReducer
        
        let configName = `${config.monitor[type].name}Config`
        let triggerFuncName = `get${configName.replace(/^\w/, (chr) => {
            return chr.toUpperCase()
        })}`
        let cloneConfig = _.cloneDeep(this.state[configName])

        let enable = + !cloneConfig[areaId].enable

        retrieveDataHelper.setMonitorEnable(
            enable,
            areaId,
            config.monitor[type].api
        )
        .then(res => {
            console.log(`set ${type} enable success`)
            setTimeout(() => {
                this[triggerFuncName]()
            }, 1000)
        })
        .catch(err => {
            console.log(`set ${type} enable fails ${err}`)
        })
    }

    /** Get tracking data from database.
     *  Once get the tracking data, violated objects would be collected. */ 
    getTrackingData = () => {
        
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context
        let [{areaId, violatedObjects}, dispatch] = stateReducer
        axios.post(dataSrc.getTrackingData,{
            locale: locale.abbr,
            user: auth.user,
            areaId,
        })
        .then(res => {
            let violatedObjects = res.data.reduce((violatedObjects, item) => {
                
                if (item.isViolated) {
                    item.notification.map(notice => {
                        let toastId = `${item.mac_address}-${notice.type}`
                        if (!(toastId in violatedObjects)) {
                            violatedObjects[toastId] = item
                        }
                    })
                }
                return violatedObjects

            }, _.cloneDeep(this.state.violatedObjects))

            this.setState({
                trackingData: res.data,
                violatedObjects,
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    /** Retrieve lbeacon data from database */
    getLbeaconPosition = () => {
        let { auth, locale } = this.context

        axios.post(dataSrc.getLbeaconTable, {
            locale: locale.abbr
        })
        .then(res => {
            let lbeaconPosition = res.data.rows.reduce((activatedLbeacons, item) => {
                let coordinate = this.createLbeaconCoordinate(item.uuid).toString()
                if (item.health_status && !activatedLbeacons.includes(coordinate)) {
                    activatedLbeacons.push(coordinate)
                }
                return activatedLbeacons
            }, [])
            this.setState({
                lbeaconPosition
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    /** Retrieve geofence data from database */
    getGeofenceConfig = () => {
        let { stateReducer } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getGeofenceConfig, {
            areaId
        })
        .then(res => {
            let geofenceConfig = res.data.rows.reduce((config, rule) => {
                if (!config[rule.area_id]) {
                    config[rule.area_id] = {
                        enable: rule.enable,
                        rules: [rule]
                    }
                }
                else config[rule.area_id].rules.push(rule)
                return config
            }, {})
            this.setState({
                geofenceConfig,
            })
        })
        .catch(err => {
            console.log(`get geofence data fail ${err}`)
        })
    }

    /** Retrieve location monitor data from database */
    getLocationMonitorConfig = () => {
        let { 
            stateReducer,
            auth
        } = this.context

        retrieveDataHelper.getMonitorConfig(
            'not stay room monitor',
            auth.user.areas_id,
            true,
        )
        .then(res => {
            let locationMonitorConfig = res.data.reduce((config, rule) => {
                config[rule.area_id] = {
                    enable: rule.enable,
                    rule: {
                        ...rule,
                        lbeacons: rule.lbeacons.map(uuid => {
                            return this.createLbeaconCoordinate(uuid).toString()
                        })
                    }
                }
                return config
            }, {})
            this.setState({
                locationMonitorConfig
            })
        })
        .catch(err => {
            console.log(`get location monitor config fail ${err}`)
        })
    }

    /** Parsing the lbeacon's location coordinate from lbeacon_uuid*/
    createLbeaconCoordinate = (lbeacon_uuid) => {

        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        const zz = lbeacon_uuid.slice(0,4);
        const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
        const yy = parseInt(lbeacon_uuid.slice(-8));
        return [yy, xx, zz];
    }

    /** remove the background color of grid button */
    clearGridButtonBGColor = () => {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }

    handleClearButton = () => {
        this.clearGridButtonBGColor();
        this.setState({
            hasSearchKey: false,
            searchKey: '',
            lastsearchKey: '',
            searchResult: [],
            colorPanel: null,
            clearColorPanel: true,
            clearSearchResult: this.state.hasSearchKey ? true : false,
            proccessedTrackingData: [],
            display: true,
            searchedObjectType: [],
            showedObjects: [],
            showMobileMap: true,
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = (searchKey, colorPanel = null, searchValue = null, markerClickPackage = {}) => {
        this.getResultBySearchKey(searchKey, colorPanel, searchValue, markerClickPackage)
        // this.processSearchResult(searchResult, colorPanel, searchKey, searchValue, markerClickPackage)
    }

    /** Process the search result by the search key.
     *  The search key would be:
     *  1. all devices
     *  2. my devices
     *  3. all patients
     *  4. my patients
     *  5. specific object term,
     *  6. coordinate(disable now)
     *  7. multiple selected object(gridbutton)(disable now)
     */
    getResultBySearchKey = (searchKey, colorPanel, searchValue, markerClickPackage) => {
        let searchResult = [];
        let {
            searchedObjectType,
            showedObjects,
            trackingData
        } = this.state
        let { auth } = this.context
        let proccessedTrackingData = _.cloneDeep(trackingData)

        if (searchKey === MY_DEVICES) {

            const devicesAccessControlNumber = auth.user.myDevice || []
            proccessedTrackingData
                .filter(item => item.object_type == 0)
                .map(item => {
                    if (devicesAccessControlNumber.includes(item.asset_control_number)) {
                        item.searched = true;
                        item.searchedType = -1;
                        searchResult.push(item)
                    }
                })
            if (!searchedObjectType.includes(-1)) { 
                searchedObjectType.push(-1)
                showedObjects.push(-1)
            }

        } else if (searchKey === ALL_DEVICES) {
            searchResult = proccessedTrackingData
                .filter(item => item.object_type == 0)
                .map(item => {
                    if (auth.user.areas_id.includes(item.area_id)) {
                        item.searchedType = 0
                    }
                    return item
                })
            if (!searchedObjectType.includes(0)) {
                searchedObjectType.push(0)
                showedObjects.push(0)
            }


        } else if (searchKey === MY_PATIENTS){
            const devicesAccessControlNumber = auth.user.myDevice || []

            proccessedTrackingData
                .filter(item => item.object_type != 0)
                .map(item => {
                    if (devicesAccessControlNumber.includes(item.asset_control_number)) {
                        item.searched = true;
                        item.searchedType = -2;
                        searchResult.push(item)
                    }
                })
            if (!searchedObjectType.includes(-2)) { 
                searchedObjectType.push(-2)
                showedObjects.push(-2)
            }


        } else if (searchKey === ALL_PATIENTS) {

            searchResult = proccessedTrackingData
                .filter(item => item.object_type != 0)
                .map(item => {
                    item.searchedType = 1;
                    return item
                })
            if (!searchedObjectType.includes(1) || !searchedObjectType.includes(2)) { 
                searchedObjectType.push(1)
                searchedObjectType.push(2)
                showedObjects.push(1)
                showedObjects.push(2)
            }


        } else if (searchKey == OBJECTS) {
            searchResult = this.collectObjectsByLatLng(searchValue, proccessedTrackingData, markerClickPackage)

        } else if (typeof searchKey === 'object') {
            proccessedTrackingData.map(item => {
                if (searchKey.includes(item.type)) {
                    item.searched = true;
                    item.searchedType = -1;
                    item.pinColor = colorPanel[item.type];
                    searchResult.push(item)
                } 
            })

        } else {
            
            let searchResultMac = [];
            
            proccessedTrackingData.map(item => {
                if (
                    item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                    item.asset_control_number.indexOf(searchKey) >= 0 ||
                    item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 
                ) {
                    item.searched = true
                    item.searchedType = -1;
                    searchResult.push(item)
                    searchResultMac.push(item.mac_address)
                }
            })

            if(this.state.lastsearchKey != searchKey){
                axios.post(dataSrc.backendSearch,{
                    keyType : 'all attributes',
                    keyWord : searchKey,
                    mac_address : searchResultMac
                })
                .catch(err =>{
                    console.log(err)
                })
                this.setState({
                    lastsearchKey: searchKey
                })
            }
            if (!searchedObjectType.includes(-1)) { 
                searchedObjectType.push(-1)
                showedObjects.push(-1)
            }
        }

        this.setState({
            proccessedTrackingData,
            searchedObjectType,
            showedObjects,
            searchResult,
            hasSearchKey: true,
            searchKey,

        })
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer */
    processSearchResult = (searchResult, colorPanel, searchKey, searchValue, markerClickPackage) => {
        if(colorPanel) {
            this.setState({
                hasSearchKey: Object.keys(colorPanel).length === 0 ? false : true,
                searchResult,
                searchKey,
                colorPanel: colorPanel,
                clearColorPanel: false,
                clearSearchResult: false,
                hasGridButton: true,
                markerClickPackage,
            })
        } else {
            this.clearGridButtonBGColor();
            this.setState({
                hasSearchKey: true,
                searchKey,
                searchResult: searchResult,
                colorPanel: null,
                clearColorPanel: true,
                clearSearchResult: false,
                hasGridButton: false,
                searchValue,
                markerClickPackage
            })
        }
    }

    collectObjectsByLatLng = (lbPosition, proccessedTrackingData, markerClickPackage) => {
        let objectList = []
        proccessedTrackingData
        .filter(item => {
            return item.lbeacon_coordinate && 
                item.lbeacon_coordinate.toString() === lbPosition.toString()
        })
        .map(item => {
            item.searched = true;
            objectList.push(item);            
        })
        return objectList 
    }

    highlightSearchPanel = (boolean) => {
        this.setState({
            isHighlightSearchPanel: boolean
        })
    }

    handleShowPath = (mac_address) => {
        this.setState({
            pathMacAddress: mac_address
        })
    }

    handleClosePath = () => {
        this.setState({
            pathMacAddress: ''
        })
    }

    handleShowResultListForMobile = () => {
        this.setState({
            display: false
        })
    }
    
    mapButtonHandler = () => {
        this.setState({
            showMobileMap: !this.state.showMobileMap
        })
    }
    
    setShowedObjects = (value) => {
        let showedObjects = value.split(',').reduce((showedObjects, number) => {   
            number = parseInt(number)                
            if (!this.state.searchedObjectType.includes(number)) return showedObjects
            else if (this.state.showedObjects.includes(number)) {
                let index = showedObjects.indexOf(number)
                showedObjects = [...showedObjects.slice(0, index), ...showedObjects.slice(index + 1)]
            } else {
                showedObjects.push(number)
            }
            return showedObjects

        }, _.cloneDeep(this.state.showedObjects))
        this.setState({
            showedObjects
        })
    }

    render(){

        const { 
            hasSearchKey,
            colorPanel, 
            clearColorPanel,
            trackingData,
            proccessedTrackingData,
            searchResult,
            searchKey
        } = this.state;

        const style = {
            pageWrap: {
                overflow: "hidden hidden",
            },

            searchResultDiv: {
                display: this.state.hasSearchKey ? null : 'none',
                // paddingTop: 30,
            },
            
            searchPanel: {
                zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                background: 'white',
                borderRadius: 10,
                // height: '90vh'
            },

            MapAndResult:{
                //border: 'solid',
                width:'70vw'
            },

            searchPanelForTablet: {
                
                zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                background: "white",
                borderRadius: 10,
                //border: 'solid',
                height: '90vh',
                width:'30vw'
            },

            containerForMobile:{
                justifyContent: 'center'
            },
            mapForMobile: {
                display: this.state.showMobileMap ? null : 'none'
            },

            searchPanelForMobile: {
                zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                display: this.state.display ? null : 'none',
                fontSize: '2rem',
                background: "white",
                borderRadius: 10,
                //border: 'solid',
                height: '90vh',
                // width:'90vw'
            },
            searchResultList: {
                dispaly: this.state.hasSearchKey ? null : 'none',
                maxHeight: '28vh'
            },
            MapAndQrcode: {
                maxHeight: '50vh',
            },
            searchResultListFormobile: {
                maxHeight: this.state.showMobileMap ? '20vh' : '65vh'
            }
        }
        const { 
            locale, 
            auth,
        } = this.context

        return (
            /** "page-wrap" the default id named by react-burget-menu */
            <div>
                <BrowserView>
                    <div id="page-wrap" className='mx-1 my-2 overflow-hidden' style={style.pageWrap} >
                        <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0' style={style.container}>
                            <Col sm={7} md={9} lg={8} xl={8} id='searchMap' className="pl-2 pr-1" >
                                <InfoPrompt 
                                    searchKey={searchKey}
                                    searchResult={searchResult}
                                />
                                <SurveillanceContainer
                                    showPath={this.state.showPath}
                                    pathMacAddress={this.state.pathMacAddress} 
                                    proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                                    hasSearchKey={hasSearchKey}
                                    colorPanel={colorPanel}
                                    searchResult={this.state.searchResult}
                                    handleClearButton={this.handleClearButton}
                                    getSearchKey={this.getSearchKey}
                                    clearColorPanel={clearColorPanel}
                                    setMonitor={this.setMonitor}
                                    auth={auth}
                                    lbeaconPosition={this.state.lbeaconPosition}
                                    geofenceConfig={this.state.geofenceConfig}
                                    locationMonitorConfig={this.state.locationMonitorConfig}
                                    clearAlerts={this.clearAlerts}
                                    searchKey={this.state.searchKey}
                                    handleClosePath={this.handleClosePath}
                                    handleShowPath={this.handleShowPath}
                                    searchedObjectType={this.state.searchedObjectType}
                                    showedObjects={this.state.showedObjects}
                                    setShowedObjects={this.setShowedObjects}
                                />
                            </Col>

                            <Col id='searchPanel' xs={12} sm={5} md={3} lg={4} xl={4} className="w-100 px-2" style={style.searchPanel}>
                                <SearchContainer 
                                    hasSearchKey={this.state.hasSearchKey}
                                    clearSearchResult={this.state.clearSearchResult}
                                    hasGridButton={this.state.hasGridButton}
                                    auth={auth}
                                    getSearchKey={this.getSearchKey}
                                />                        
                                <div 
                                    id='searchResult' 
                                    style={style.searchResultDiv} 
                                >
                                    <SearchResultList
                                        searchResult={this.state.searchResult} 
                                        searchKey={this.state.searchKey}
                                        highlightSearchPanel={this.highlightSearchPanel}
                                        handleShowPath={this.handleShowPath}
                                        showMobileMap={this.state.showMobileMap}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </BrowserView>
                <TabletView>
                    <div id="page-wrap" className='d-flex flex-column w-100' style={{height: "90vh"}}>
                        <div id="mainContainer" className='d-flex flex-row h-100 w-100' style={style.container}>
                            {/** left area of row */}
                            <div className='d-flex flex-column' style={style.MapAndResult}>
                                {/** including QR code and map */}
                                <div className="d-flex" style={style.MapAndQrcode}>
                                    <SurveillanceContainer
                                        showPath={this.state.showPath}
                                        pathMacAddress={this.state.pathMacAddress} 
                                        proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                                        hasSearchKey={hasSearchKey}
                                        colorPanel={colorPanel}
                                        searchResult={this.state.searchResult}
                                        handleClearButton={this.handleClearButton}
                                        getSearchKey={this.getSearchKey}
                                        clearColorPanel={clearColorPanel}
                                        setMonitor={this.setMonitor}
                                        auth={auth}
                                        lbeaconPosition={this.state.lbeaconPosition}
                                        geofenceConfig={this.state.geofenceConfig}
                                        clearAlerts={this.clearAlerts}
                                        searchKey={this.state.searchKey}
                                        authenticated={this.state.authenticated}
                                        handleClosePath={this.handleClosePath}
                                        handleShowPath={this.handleShowPath}
                                        searchedObjectType={this.state.searchedObjectType}
                                        showedObjects={this.state.showedObjects}
                                    />
                                </div>
                                <div id="searchResult" className="d-flex" style={{justifyContent: 'center'}}>
                                    <SearchResultList
                                        searchResult={this.state.searchResult} 
                                        searchKey={this.state.searchKey}
                                        highlightSearchPanel={this.highlightSearchPanel}
                                        handleShowPath={this.handleShowPath}
                                        showMobileMap={this.state.showMobileMap}
                                    />
                                </div>
                            </div>
                            <div id='searchPanel' className="h-100" style={style.searchPanelForTablet}>
                                <SearchContainer
                                    hasSearchKey={this.state.hasSearchKey}
                                    clearSearchResult={this.state.clearSearchResult}
                                    hasGridButton={this.state.hasGridButton}
                                    auth={auth}
                                    getSearchKey={this.getSearchKey}
                                />
                            </div>
                        </div>
                    </div>
                </TabletView>
                <MobileOnlyView>
                    <div id="page-wrap" className='d-flex flex-column' style={{height: "90vh"}}>
                        <div className='h-100' style={{overflow: 'hidden hidden'}}>
                            <div id='searchPanel' className="h-100" style={style.searchPanelForMobile}>
                                <SearchContainer 
                                    hasSearchKey={this.state.hasSearchKey}
                                    clearSearchResult={this.state.clearSearchResult}
                                    hasGridButton={this.state.hasGridButton}
                                    auth={auth}
                                    getSearchKey={this.getSearchKey}
                                    handleShowResultListForMobile={this.handleShowResultListForMobile}
                                />
                            </div>
                            <div style={style.mapForMobile} className="m-1">
                                <SurveillanceContainer
                                    showPath={this.state.showPath}
                                    pathMacAddress={this.state.pathMacAddress} 
                                    proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                                    hasSearchKey={hasSearchKey}
                                    colorPanel={colorPanel}
                                    searchResult={this.state.searchResult}
                                    handleClearButton={this.handleClearButton}
                                    getSearchKey={this.getSearchKey}
                                    clearColorPanel={clearColorPanel}
                                    setMonitor={this.setMonitor}
                                    auth={auth}
                                    lbeaconPosition={this.state.lbeaconPosition}
                                    geofenceConfig={this.state.geofenceConfig}
                                    clearAlerts={this.clearAlerts}
                                    searchKey={this.state.searchKey}
                                    handleClosePath={this.handleClosePath}
                                    handleShowPath={this.handleShowPath}
                                    searchedObjectType={this.state.searchedObjectType}
                                    showedObjects={this.state.showedObjects}
                                    handleClearButton={this.handleClearButton}
                                    mapButtonHandler={this.mapButtonHandler}
                                />
                            </div>
                            <ButtonGroup style={{marginTop:'5px',marginBottom:'5px'}}>
                                <Button 
                                    variant='outline-primary' 
                                    onClick={this.mapButtonHandler}
                                >
                                    {this.state.showMobileMap ? locale.texts.HIDE_MAP : locale.texts.SHOW_MAP}
                                </Button>
                                <Button 
                                    variant='outline-primary' 
                                    onClick={this.handleClearButton}
                                >
                                    {locale.texts.NEW_SEARCH}
                                </Button>
                            </ButtonGroup>
                            <div className='d-flex justify-content-center'>
                                <SearchResultList
                                    searchResult={this.state.searchResult} 
                                    searchKey={this.state.searchKey}
                                    highlightSearchPanel={this.highlightSearchPanel}
                                    handleShowPath={this.handleShowPath}
                                    showMobileMap={this.state.showMobileMap}
                                />
                            </div>
                        </div>
                    </div>
                </MobileOnlyView>
            </div>
        )
    }
}

export default MainContainer




