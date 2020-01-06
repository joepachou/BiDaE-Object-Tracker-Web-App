import React from 'react';
import SearchContainer from './SearchContainer';
import 'react-table/react-table.css';
import SearchResultList from '../presentational/SearchResultList'
import { Row, Col, Toast } from 'react-bootstrap'
import SurveillanceContainer from './SurveillanceContainer';
import config from '../../config';
import InfoPrompt from '../presentational/InfoPrompt';
import _ from 'lodash'
import axios from 'axios';
import dataSrc from '../../dataSrc'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';
import ToastNotification from '../presentational/ToastNotification'
import SearchResult from '../presentational/SearchResultList';
import AntPath from "leaflet-ant-path";


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
        geoFenceConfig: [],
        violatedObjects: {},
        hasSearchKey: false,
        searchKey: '',
        lastsearchKey: '',
        searchResult: [],
        colorPanel: null,
        clearColorPanel: false,
        searchResultObjectTypeMap: {},
        clearSearchResult: false,
        hasGridButton: false,
        isHighlightSearchPanel: false,
        rssiThreshold: window.innerWidth < config.mobileWidowWidth
            ? config.mapConfig.locationAccuracyMapToDefault[0]
            : config.mapConfig.locationAccuracyMapToDefault[1],
        authenticated: this.context.auth.authenticated,
        shouldUpdateTrackingData: true,
        markerClickPackage: {},
        showPath: false,
        pathMacAddress:''
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.getLbeaconPosition();
        this.getGeoFenceConfig()
        this.interval = setInterval(this.getTrackingData, config.mapConfig.intervalTime)
    }

    componentDidUpdate = (prevProps, prevState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, prevState.trackingData))
        let { stateReducer } = this.context
        let [{violatedObjects}] = stateReducer
        if (stateReducer[0].shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData) {
            let [{shouldUpdateTrackingData}] = stateReducer
            this.interval = shouldUpdateTrackingData ? setInterval(this.getTrackingData, config.mapConfig.intervalTime) : clearInterval(this.interval);
            this.setState({
                shouldUpdateTrackingData
            })
        }
        if (isTrackingDataChange && this.state.hasSearchKey) {
            this.handleRefreshSearchResult()
        }
        if (!(_.isEqual(prevState.authenticated, this.context.auth.authenticated))) {
            this.getTrackingData(this.context.stateReducer[0].areaId)
            this.setState({
                authenticated: this.context.auth.authenticated,
                searchResult: [],
                searchKey: '',
                hasSearchKey: false
            })
        } 

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
        let isStateChange = !(_.isEqual(this.state, nextState))
        let isLbeaconDataChange = !(_.isEqual(this.state.lbeaconPosition, nextState.lbeaconPosition))
        let isGeoFenceDataChange = !(_.isEqual(this.state.geoFenceConfig, nextState.geoFenceConfig))
        let isViolatedObjectChange = !(_.isEqual(this.state.isViolatedObjectChange, nextState.isViolatedObjectChange))

        let isHighlightSearchPanelChange = !(_.isEqual(this.state.isHighlightSearchPanel, nextState.isHighlightSearchPanel))
        let shouldUpdate = isTrackingDataChange || 
                                hasSearchKey || 
                                isSearchKeyChange || 
                                isSearchResultChange || 
                                isHighlightSearchPanelChange || 
                                isGeoFenceDataChange ||
                                isViolatedObjectChange
        return shouldUpdate
    }

    getToastNotification = (item) => {
        item.notification.map(event => {
            if (event.type == 2) return 
            let toastId = `${item.id}:${event.type}`
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
        return toast[config.toastMonitorMap[type]](<ToastNotification data={data} time={time} type={type}/>, option)
    }

    onCloseToast = (toast) => {
        let mac_address = toast.data ? toast.data.mac_address : toast.mac_address;
        let monitor_type = toast.type
        axios.post(dataSrc.checkoutViolation, {
            mac_address,
            monitor_type
        })
        .then(res => {
        })
        .catch(err => {
            console.log(`checkout violation fail: ${err}`)
        })
    }

    /** Clear the record violated object */
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

    handleRefreshSearchResult = () => {
        let { searchKey, colorPanel, searchValue, markerClickPackage } = this.state
        this.getSearchKey(searchKey, colorPanel, searchValue, markerClickPackage)
    }

    changeLocationAccuracy = (locationAccuracy) => {
        const rssiThreshold = config.mapConfig.locationAccuracyMapToDefault[locationAccuracy]
        this.setState({
            rssiThreshold
        })
    }

    async setFence (value, areaId) {
        let result = await axios.post(dataSrc.setGeoFenceConfig, {
            value,
            areaId,
        })
        return result
    }

    getTrackingData = () => {
        let { auth, locale, stateReducer } = this.context
        let [{areaId, violatedObjects}, dispatch] = stateReducer
        axios.post(dataSrc.getTrackingData,{
            rssiThreshold: this.state.rssiThreshold,
            locale: locale.abbr,
            user: auth.user,
            areaId,
        })
        .then(res => {

            let violatedObjects = res.data.reduce((violatedObjects, item) => {
                if (!(item.mac_address in violatedObjects) && item.isViolated) {
                    violatedObjects[item.mac_address] = item
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

    getLbeaconPosition = () => {
        let { auth, locale } = this.context

        axios.post(dataSrc.getLbeaconTable, {
            locale: locale.abbr
        })
        .then(res => {
            let lbeaconPosition = res.data.reduce((activatedLbeacons, item) => {
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

    /** Retrieve geo fence data from database */
    getGeoFenceConfig = () => {
        let { stateReducer } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getGeoFenceConfig, {
            areaId
        })
        .then(res => {
            this.setState({
                geoFenceConfig: res.data.rows
            })
        })
        .catch(err => {
            console.log(`get geo fence data fail: ${err}`)
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

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer */
    processSearchResult = (searchResult, colorPanel, searchKey, searchValue, markerClickPackage) => {
        /** Count the number of found object type */
        let duplicateSearchKey = []

        if (typeof searchKey !== 'string') {
            duplicateSearchKey = [...searchKey]
        }

        duplicateSearchKey.filter(key => {
            return key !== 'all devices' || key !== 'my devices'
        })

        let searchResultObjectTypeMap = searchResult
            .filter(item => item.found)
            .reduce((allObjectTypes, item) => {
                if (item.type in allObjectTypes) allObjectTypes[item.type]++
                else {
                    allObjectTypes[item.type] = 1
                    let index = duplicateSearchKey.indexOf(item.type)
                    if (index > -1) {
                        duplicateSearchKey.splice(index, 1)
                    }
                }
                return allObjectTypes
        }, {})

        duplicateSearchKey.map(key => searchResultObjectTypeMap[key] = 0)
        
        if(colorPanel) {
            this.setState({
                hasSearchKey: Object.keys(colorPanel).length === 0 ? false : true,
                searchResult: searchResult,
                searchKey,
                colorPanel: colorPanel,
                clearColorPanel: false,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                clearSearchResult: false,
                hasGridButton: true,
                markerClickPackage,
            })
        } else {
            this.clearGridButtonBGColor();
            this.setState({
                hasSearchKey: true,
                searchKey: searchKey,
                searchResult: searchResult,
                colorPanel: null,
                clearColorPanel: true,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                clearSearchResult: false,
                hasGridButton: false,
                searchValue,
                markerClickPackage
            })
        }
    }

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
            searchResultObjectTypeMap: {},
            clearSearchResult: this.state.hasSearchKey ? true : false,
            proccessedTrackingData: []
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = (searchKey, colorPanel = null, searchValue = null, markerClickPackage = {}) => {
        const searchResult = this.getResultBySearchKey(searchKey, colorPanel, searchValue, markerClickPackage)
        this.processSearchResult(searchResult, colorPanel, searchKey, searchValue, markerClickPackage)
    }

    getResultBySearchKey = (searchKey, colorPanel, searchValue, markerClickPackage) => {
        let searchResult = [];
        let { auth } = this.context

        let proccessedTrackingData = _.cloneDeep(this.state.trackingData)
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
        } else if (searchKey === ALL_DEVICES) {
            searchResult = proccessedTrackingData
                .filter(item => item.object_type == 0)
                .map(item => {
                    if (auth.user.areas_id.includes(item.area_id)) {
                        item.searchedType = 0
                    }
                    return item
                })

        } else if (searchKey === MY_PATIENTS){
            const devicesAccessControlNumber = auth.user.myDevice || []

            proccessedTrackingData
                .filter(item => item.object_type != 0)
                .map(item => {
                    if (devicesAccessControlNumber.includes(item.asset_control_number)) {
                        item.searched = true;
                        // item.searched = auth.user.areas_id.includes(item.area_id) ? true : false
                        item.searchedType = -2;
                        searchResult.push(item)
                    }
                })

        } else if (searchKey === ALL_PATIENTS) {

            searchResult = proccessedTrackingData
                .filter(item => item.object_type != 0)
                .map(item => {
                    // item.searched = auth.user.areas_id.includes(item.area_id) ? true : false
                    item.searchedType = 1;
                    return item
                })

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

            let searchResultMac = [];
            searchResult.map(item => {
                searchResultMac.push(item.mac_address)
            })
        } else {
            
            let searchResultMac = [];

            proccessedTrackingData.map(item => {
                if (item.object_type == 0 && (item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0
                    // fix 4.7.3
                    || item.asset_control_number.indexOf(searchKey) >= 0
                    // original
                    // || item.asset_control_number.slice(10,14).indexOf(searchKey) >= 0
                    // 
                    || item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) 
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
                .then(res => {
                })
                .catch(err =>{
                    console.log(err)
                })
                this.setState({
                    lastsearchKey: searchKey
                })
            }
        }

        this.setState({
            proccessedTrackingData
        })
        return searchResult
    }

    collectObjectsByLatLng = (lbPosition, proccessedTrackingData, markerClickPackage) => {
        let objectList = []
        proccessedTrackingData
        .filter(item => {
            return item.currentPosition && 
                item.currentPosition.toString() === lbPosition.toString()
        })
        .map(item => {
            item.searched = true;
            // item.searchedType = markerClickPackage[item.mac_address].searchedType
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
        //console.log(mac_address)
        this.setState({
            showPath: true,
            pathMacAddress: mac_address
        })
    }

    handleClosePath = () => {
        this.setState({
            showPath: false
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
            searchResultObjectTypeMap,
            searchKey
        } = this.state;

        const style = {
            pageWrap: {
                overflow: "hidden hidden",
            },

            container: {
                /** The height: 100vh will cause the page can only have 100vh height.
                 * In other word, if the seaerch result is too long and have to scroll down, the page cannot scroll down
                 */
                // height: '100vh'
                
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
            }
        }
        const { 
            locale, 
            auth,
            stateReducer,
        } = this.context

        let [{areaId}] = stateReducer


        let deviceNum = this.state.trackingData.filter(item => item.found).length
        let devicePlural = deviceNum === 1 ? locale.texts.DEVICE : locale.texts.DEVICES
        return (
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='mx-1 my-2 overflow-hidden' style={style.pageWrap} >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0' style={style.container}>
                    <Col sm={7} md={9} lg={8} xl={8} id='searchMap' className="pl-2 pr-1" >
                        <InfoPrompt 
                            searchKey={searchKey}
                            searchResult={searchResult}
                            title={locale.texts.FOUND} 
                            title2={locale.texts.NOT_FOUND}
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
                            changeLocationAccuracy={this.changeLocationAccuracy}
                            setFence={this.setFence}
                            auth={auth}
                            lbeaconPosition={this.state.lbeaconPosition}
                            geoFenceConfig={this.state.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                            clearAlerts={this.clearAlerts}
                            searchKey={this.state.searchKey}
                            authenticated={this.state.authenticated}
                            handleClosePath={this.handleClosePath}
                            handleShowPath={this.handleShowPath}
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
                            />
                        </div>
                    </Col>
                    
                </Row>
            </div>
        )
    }
}

export default MainContainer




