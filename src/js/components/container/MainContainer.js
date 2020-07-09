/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        MainContainer.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/
import React, { Fragment } from 'react';
import 'react-table/react-table.css';
import config from '../../config';
import _ from 'lodash';
import axios from 'axios';
import dataSrc, { objectPackage } from '../../dataSrc'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import ToastNotification from '../presentational/ToastNotification';
import {
    BrowserView,
    MobileOnlyView,
    TabletView
} from 'react-device-detect';
import { disableBodyScroll } from 'body-scroll-lock';
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import messageGenerator from '../../helper/messageGenerator';
import TabletMainContainer from '../platform/tablet/TabletMainContainer'
import MobileMainContainer from '../platform/mobile/MobileMainContainer';
import BrowserMainContainer from '../platform/browser/BrowserMainContainer';
import apiHelper from '../../helper/apiHelper';
import {
    createLbeaconCoordinate
} from '../../helper/dataTransfer';

const {
    ALL_DEVICES,
    MY_DEVICES,
    ALL_PATIENTS,
    MY_PATIENTS,
    OBJECTS,
    OBJECT_TYPE
} = config.frequentSearchOption

const {
    MAX_SEARCH_OBJECT_NUM
} = config

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        proccessedTrackingData: [],
        lbeaconPosition: [],
        geofenceConfig: null,
        locationMonitorConfig: null,
        violatedObjects: {},
        hasSearchKey: true,
        searchKey: '',
        searchType: ALL_DEVICES,
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
        currentAreaId: this.context.stateReducer[0].areaId,
        searchObjectArray: [],
        pinColorArray: config.mapConfig.iconColor.pinColorArray.filter((item, index) => index < MAX_SEARCH_OBJECT_NUM)
    }

    errorToast = null


    componentDidMount = () => {
        /** set the scrollability in body disabled */
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);

        this.getTrackingData();
        this.getLbeaconPosition();
        this.getGeofenceConfig();
        this.getLocationMonitorConfig()
        this.interval = setInterval(this.getTrackingData, config.mapConfig.intervalTime)
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
                ?   setInterval(this.getTrackingData, config.mapConfig.intervalTime)
                :   clearInterval(this.interval);
            this.setState({
                shouldUpdateTrackingData
            })
        }

        if (!(_.isEqual(prevState.currentAreaId, stateReducer[0].areaId))){
            this.setState({
                currentAreaId: stateReducer[0].areaId
            })
        }

        /** refresh search result if the search results are change */
        if (isTrackingDataChange && this.state.hasSearchKey) {
            this.handleRefreshSearchResult()
        }

        /** clear out search result when user sign out */
        if (!(_.isEqual(prevState.authenticated, this.context.auth.authenticated))) {
            // let currentAreaId = this.context.auth.authenticated ? 
            let { stateReducer } = this.context
            let [{areaId}, dispatch] = stateReducer

            this.setState({
                authenticated: this.context.auth.authenticated,
                searchResult: [],
                searchKey: '',
                hasSearchKey: false,
                searchedObjectType: [],
                showedObjects: [],
            }, dispatch({
                type: 'setArea',
                value: this.context.auth.user.main_area
            }))
        } 

        /** send toast if there are latest violated notification */
        let newViolatedObject = Object.keys(this.state.violatedObjects).filter(item => !Object.keys(prevState.violatedObjects).includes(item))
        if (newViolatedObject.length !== 0 ) {
            newViolatedObject.map(item => {
                this.getToastNotification(this.state.violatedObjects[item])
            })
        }
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
        let { 
            searchKey, 
            searchType, 
            markerClickPackage 
        } = this.state
        
        this.getSearchKey(searchKey, searchType, markerClickPackage)
    }

    /** set the geofence and location monitor enable */
    setMonitor = (type, callback) => {

        let { 
            stateReducer 
        } = this.context

        let [
            {areaId}, 
        ] = stateReducer
        
        let configName = `${config.monitor[type].name}Config`
        let triggerMonitorFunctionName = `get${configName.replace(/^\w/, (chr) => {
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
            console.log(`set ${type} enable succeed`)
            setTimeout(() => this[triggerMonitorFunctionName](callback), 1000)
        })
        .catch(err => {
            console.log(`set ${type} enable failed ${err}`)
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
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {
            /** dismiss error message when the database is connected */
            if (this.errorToast) {
                this.errorToast = null;
                toast.dismiss(this.errorToast)
            }

            /** collect violated objects as violatedObjects */
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
        .catch(err => {
            console.log(`get tracking data failed ${err}`)

            /** sent error message when database is not connected */
            if (!this.errorToast) {
                this.errorToast = messageGenerator.setErrorMessage()
            }
        })
    }

    /** Retrieve lbeacon data from database */
    getLbeaconPosition = () => {
        let { auth, locale } = this.context

        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res => {
            let lbeaconPosition = res.data.rows.map(item => {
                item.coordinate = createLbeaconCoordinate(item.uuid).toString();
                return item;
            })
            this.setState({
                lbeaconPosition
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    /** Retrieve geofence data from database */
    getGeofenceConfig = (callback) => {
        let { stateReducer } = this.context
        let [{areaId}] = stateReducer
        
        apiHelper.geofenceApis.getGeofenceConfig(
            areaId
        )
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
            }, callback)
        })
        .catch(err => {
            console.log(`get geofence data failed ${err}`)
        })
    }

    /** Retrieve location monitor data from database */
    getLocationMonitorConfig = (callback) => {
        let { 
            stateReducer,
            auth
        } = this.context
        apiHelper.monitor.getMonitorConfig(
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
                            return createLbeaconCoordinate(uuid).toString()
                        })
                    }
                }
                return config
            }, {})
            this.setState({
                locationMonitorConfig
            }, callback)
        })
        .catch(err => {
            console.log(`get location monitor config failed ${err}`)
        })
    }

    /** remove the background color of grid button */
    clearGridButtonBGColor = () => {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }

    handleClearButton = () => {
        let {
            proccessedTrackingData
        } = this.state

        let searchResult = proccessedTrackingData
            .filter(item => {
                return item.object_type == 0 
            })
            .map(item => {
                item.searchedType = 0
                return item
            })

        this.setState({
            hasSearchKey: true,
            searchKey: ALL_DEVICES,
            lastsearchKey: '',
            searchResult,
            colorPanel: null,
            clearColorPanel: true,
            clearSearchResult: this.state.hasSearchKey ? true : false,
            proccessedTrackingData: [],
            display: true,
            searchedObjectType: [0],
            showedObjects: [0],
            showMobileMap: true,
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey = (searchKey, searchType, colorPanel = null, markerClickPackage = {}) => {
        this.getResultBySearchKey(searchKey, searchType, colorPanel, markerClickPackage)
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
    getResultBySearchKey = (searchKey, searchType, colorPanel, markerClickPackage) => {
        let searchResult = [];

        let hasSearchKey = true

        let {
            searchedObjectType,
            showedObjects,
            trackingData,
            searchObjectArray,
            pinColorArray
        } = this.state

        let { 
            auth
        } = this.context

        let proccessedTrackingData = _.cloneDeep(trackingData)  

        const devicesAccessControlNumber = auth.user.myDevice || []


        switch(searchType) {
            case ALL_DEVICES:

                searchObjectArray = [];

                searchResult = proccessedTrackingData
                    .filter(item => {
                        return item.object_type == 0 
                    })
                    .map(item => {
                        item.searchedType = 0
                        return item
                    })

                if (!searchedObjectType.includes(0)) {
                    searchedObjectType.push(0)
                    showedObjects.push(0)
                }
                break;
            
            case MY_DEVICES:

                searchObjectArray = [];
    
                proccessedTrackingData
                    .filter(item => {
                        return item.object_type == 0
                    })
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

                break;

            case ALL_PATIENTS:

                searchObjectArray = [];

                searchResult = proccessedTrackingData
                    .filter(item => {
                        return item.object_type != 0 
                    })
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

                break;

            case MY_PATIENTS: 

                searchObjectArray = [];
                
                proccessedTrackingData
                    .filter(item => {
                        return item.object_type != 0 
                    })
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
                break;

            case OBJECT_TYPE:
                
                if (searchObjectArray.includes(searchKey)) {

                } else if (searchObjectArray.length < MAX_SEARCH_OBJECT_NUM) {
                    searchObjectArray.push(searchKey)
                } else {
                    searchObjectArray.shift();
                    pinColorArray.push(pinColorArray.shift());
                    searchObjectArray.push(searchKey)
                }
                searchResult = proccessedTrackingData.filter(item => {
                    return searchObjectArray.includes(item.type)
                })

                break;

            default:
                let searchResultMac = []; 

                searchObjectArray = [];

                proccessedTrackingData
                    .map(item => {    
                         if (
                            item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
                            item.asset_control_number.indexOf(searchKey) >= 0 ||
                            item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0  ||
                            (item.nickname != undefined ?  item.nickname.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 : false)
                        ) {
                            item.searched = true;
                            item.searchedType = -1;
                            searchResult.push(item)
                            searchResultMac.push(item.mac_address)
                            
                        }
                       
                        if(item.location_description != null){ 
                            if( item.location_description.indexOf(searchKey) >= 0  ){
                                item.searched = true
                                item.searchedType = -1;
                                searchResult.push(item)
                                searchResultMac.push(item.mac_address)
                            }
                        }
    
                    })
    
                // if(this.state.lastsearchKey != searchKey) {
                //     axios.post(dataSrc.backendSearch,{
                //         keyType : 'all attributes',
                //         keyWord : searchKey,
                //         mac_address : searchResultMac
                //     })
                //     .then(res => {
                //         this.setState({
                //             lastsearchKey: searchKey
                //         })
                //     })
                //     .catch(err =>{
                //         console.log(err)
                //     })
    
                // }
    
                if (!searchedObjectType.includes(-1)) { 
                    searchedObjectType.push(-1)
                    showedObjects.push(-1)
                }
        }


        // if (searchKey === MY_DEVICES) {
        //     searchObjectArray = [];

        //     const devicesAccessControlNumber = auth.user.myDevice || []

        //     proccessedTrackingData
        //         .filter(item => {
        //             return item.object_type == 0
        //         })
        //         .map(item => {
        //             if (devicesAccessControlNumber.includes(item.asset_control_number)) {
        //                 item.searched = true;
        //                 item.searchedType = -1;
        //                 searchResult.push(item)
        //             }
        //         })
        //     if (!searchedObjectType.includes(-1)) { 
        //         searchedObjectType.push(-1)
        //         showedObjects.push(-1)
        //     }

        // } else if (searchKey === ALL_DEVICES) {

        //     searchObjectArray = [];

        //     searchResult = proccessedTrackingData
        //         .filter(item => {
        //             return item.object_type == 0 
        //         })
        //         .map(item => {
        //             item.searchedType = 0
        //             return item
        //         })
        //     if (!searchedObjectType.includes(0)) {
        //         searchedObjectType.push(0)
        //         showedObjects.push(0)
        //     }


        // } else if (searchKey === MY_PATIENTS){

        //     searchObjectArray = [];

        //     const devicesAccessControlNumber = auth.user.myDevice || []
            
        //     proccessedTrackingData
        //         .filter(item => {
        //             return item.object_type != 0 
        //         })
        //         .map(item => {
        //             if (devicesAccessControlNumber.includes(item.asset_control_number)) {
        //                 item.searched = true;
        //                 item.searchedType = -2;
        //                 searchResult.push(item)
        //             }
        //         })
        //     if (!searchedObjectType.includes(-2)) { 
        //         searchedObjectType.push(-2)
        //         showedObjects.push(-2)
        //     }


        // } else if (searchKey === ALL_PATIENTS) {
        //     searchObjectArray = [];

        //     searchResult = proccessedTrackingData
        //         .filter(item => {
        //             return item.object_type != 0 
        //         })
        //         .map(item => {
        //             item.searchedType = 1;
        //             return item
        //         })
        //     if (!searchedObjectType.includes(1) || !searchedObjectType.includes(2)) { 
        //         searchedObjectType.push(1)
        //         searchedObjectType.push(2)
        //         showedObjects.push(1)
        //         showedObjects.push(2)
        //     }


        // } else if (searchKey == OBJECTS) {
        //     searchResult = this.collectObjectsByLatLng(searchValue, proccessedTrackingData, markerClickPackage)

        // } else if (typeof searchKey === 'object') {
        //     proccessedTrackingData.map(item => {
        //         if (searchKey.includes(item.type)) {
        //             item.searched = true;
        //             item.searchedType = -1;
        //             item.pinColor = colorPanel[item.type];
        //             searchResult.push(item)
        //         } 
        //     })

        // } else if (searchKey == "") {
        //     searchResult = []
        //     hasSearchKey = false 

        // } else if (searchType == OBJECT_TYPE) {

        //     if (searchObjectArray.includes(searchKey)) {
        //     } else if (searchObjectArray.length < MAX_SEARCH_OBJECT_NUM) {
        //         searchObjectArray.push(searchKey)
        //     } else {
        //         searchObjectArray.shift();
        //         pinColorArray.push(pinColorArray.shift());
        //         searchObjectArray.push(searchKey)
        //     }
        //     searchResult = proccessedTrackingData.filter(item => {
        //         return searchObjectArray.includes(item.type)
        //     })
        // } else {
        //     let searchResultMac = []; 
        //     searchObjectArray = [];
        //     proccessedTrackingData
        //         .map(item => {    
        //              if (
        //                 item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
        //                 item.asset_control_number.indexOf(searchKey) >= 0 ||
        //                 item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0  ||
        //                 (item.nickname != undefined ?  item.nickname.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 : false)
        //             ) {
        //                 item.searched = true;
        //                 item.searchedType = -1;
        //                 searchResult.push(item)
        //                 searchResultMac.push(item.mac_address)
                        
        //             }
                   
        //             if(item.location_description != null){ 
        //                 if( item.location_description.indexOf(searchKey) >= 0  ){
        //                     item.searched = true
        //                     item.searchedType = -1;
        //                     searchResult.push(item)
        //                     searchResultMac.push(item.mac_address)
        //                 }
        //             }

        //         })

        //     // if(this.state.lastsearchKey != searchKey) {
        //     //     axios.post(dataSrc.backendSearch,{
        //     //         keyType : 'all attributes',
        //     //         keyWord : searchKey,
        //     //         mac_address : searchResultMac
        //     //     })
        //     //     .then(res => {
        //     //         this.setState({
        //     //             lastsearchKey: searchKey
        //     //         })
        //     //     })
        //     //     .catch(err =>{
        //     //         console.log(err)
        //     //     })

        //     // }

        //     if (!searchedObjectType.includes(-1)) { 
        //         searchedObjectType.push(-1)
        //         showedObjects.push(-1)
        //     }
        // }

        this.setState({
            proccessedTrackingData,
            searchedObjectType,
            showedObjects,
            searchResult,
            hasSearchKey,
            searchKey,
            searchType,
            searchObjectArray,
            pinColorArray
        })
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

    handleShowPath = (mac_address, callback) => {
        this.setState({
            pathMacAddress: mac_address
        }, callback)
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
            trackingData,
            proccessedTrackingData,
            searchResult,
            searchKey,
            searchType,
            lbeaconPosition,
            geofenceConfig,
            searchedObjectType,
            showedObjects,
            showMobileMap,
            clearSearchResult,
            showPath,
            display,
            pathMacAddress,
            isHighlightSearchPanel,
            locationMonitorConfig,
            currentAreaId,
            searchObjectArray,
            pinColorArray
        } = this.state;

        const {
            handleClearButton,
            getSearchKey,
            setMonitor,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            setShowedObjects,
            handleShowResultListForMobile,
            mapButtonHandler,
            highlightSearchPanel
        } = this

        const propsGroup = {
            handleClearButton,
            hasSearchKey,
            getSearchKey,
            setMonitor,
            clearAlerts,
            handleClosePath,
            handleShowPath,
            lbeaconPosition,
            geofenceConfig,
            searchedObjectType,
            showedObjects,
            highlightSearchPanel,
            showMobileMap,
            clearSearchResult,
            searchKey,
            searchType,
            searchResult,
            trackingData,
            proccessedTrackingData,
            showPath,
            setShowedObjects,
            handleShowResultListForMobile,
            display,
            pathMacAddress,
            mapButtonHandler,
            isHighlightSearchPanel,
            locationMonitorConfig,
            currentAreaId,
            searchObjectArray,
            pinColorArray
        }

        return (
            /** "page-wrap" the default id named by react-burget-menu */
            <Fragment>
                <BrowserView>
                    <BrowserMainContainer 
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletMainContainer 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileMainContainer 
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default MainContainer




