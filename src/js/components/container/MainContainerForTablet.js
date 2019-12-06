import React from 'react';
import SearchContainer from './SearchContainer';
import 'react-table/react-table.css';
import SearchResultListForTablet from '../presentational/SearchResultListForTablet'
import { Row, Col, Toast } from 'react-bootstrap'
import SurveillanceContainerTablet from './SurveillanceContainerTablet';
import config from '../../config';
import InfoPrompt from '../presentational/InfoPrompt';
import _ from 'lodash'
import axios from 'axios';
import dataSrc from '../../dataSrc'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';
import ToastNotification from '../presentational/ToastNotification'
import SearchContainerForTablet from './SearchContainerForTablet';

const {
    ALL_DEVICES,
    MY_DEVICES,
    ALL_PATIENTS,
    MY_PATIENTS,
} = config.frequentSearchOption

class MainContainerForTablet extends React.Component{

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
            ? config.surveillanceMap.locationAccuracyMapToDefault[0]
            : config.surveillanceMap.locationAccuracyMapToDefault[1],
        auth: this.context.auth,
        shouldUpdateTrackingData: true,
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.getLbeaconPosition();
        this.getGeoFenceConfig()
        this.interval = setInterval(this.getTrackingData, config.surveillanceMap.intevalTime)
    }

    componentDidUpdate = (prevProps, prevState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, prevState.trackingData))
        let { stateReducer } = this.context
        let [{violatedObjects}] = stateReducer
        if (stateReducer[0].shouldUpdateTrackingData !== this.state.shouldUpdateTrackingData) {
            let [{shouldUpdateTrackingData}] = stateReducer
            this.interval = shouldUpdateTrackingData ? setInterval(this.getTrackingData, config.surveillanceMap.intevalTime) : clearInterval(this.interval);
            this.setState({
                shouldUpdateTrackingData
            })
        }
        if (isTrackingDataChange && this.state.hasSearchKey) {
            this.handleRefreshSearchResult()
        }
        if (!(_.isEqual(prevState.auth, this.context.auth))) {
            this.getTrackingData(this.context.stateReducer[0].areaId)
            this.setState({
                auth: this.context.auth,
            })
        } 
        // console.log(violatedObjects)
        let newViolatedObject = Object.keys(this.state.violatedObjects).filter(item => !Object.keys(prevState.violatedObjects).includes(item))
        // console.log(newViolatedObject)
        if (newViolatedObject.length !== 0 ) {
            newViolatedObject.map(item => {
                this.getToastNotification(this.state.violatedObjects[item])
            })
        }
    }

    getToastNotification = (item) => {
        switch(item.monitor_type) {
            case 1:
                toast.warn(<ToastNotification data={item} />, {
                    hideProgressBar: true,
                    autoClose: false,
                    onClose: this.onCloseToast
                })
            break;
            case 4:
                toast.error(<ToastNotification data={item} />, {
                    hideProgressBar: true,
                    autoClose: false,
                    onClose: this.onCloseToast
                })
            break;
            case 8:
                toast.info(<ToastNotification data={item} />, {
                    hideProgressBar: true,
                    autoClose: false,
                    onClose: this.onCloseToast
                })
            break;
        }
    }

    onCloseToast = (toast) => {
        let mac_address = toast.data ? toast.data.mac_address : toast.mac_address
        axios.post(dataSrc.checkoutViolation, {
            mac_address,
        })
        .then(res => {
        })
        .catch(err => {
            console.log(`checkout violation fail: ${err}`)
        })
    }

    /** Clear the record violated object */
    clearAlerts = () => {
        Object.values(this.state.violatedObjects).map(item => this.onCloseToast(item))
        toast.dismiss()
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

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    handleRefreshSearchResult = () => {
        let { searchKey, colorPanel, searchValue } = this.state
        this.getSearchKey(searchKey, colorPanel, searchValue)
    }

    changeLocationAccuracy = (locationAccuracy) => {
        const rssiThreshold = config.surveillanceMap.locationAccuracyMapToDefault[locationAccuracy]
        this.setState({
            rssiThreshold
        })
    }

    // setArea = (value) => {
    //     let { stateReducer } = this.context
    //     let [{areaId}, dispatch] = stateReducer
    //     this.getTrackingData(value)
    //     dispatch({
    //         type:'setArea',
    //         value,
    //     })
    //     this.setState({
    //         areaId, 
    //     })
    // }

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

            // let test = res.data.reduce((violatedObjects, item) => {
            //     if (!(item.mac_address in violatedObjects) && item.isViolated) {
            //         violatedObjects[item.mac_address] = item
            //     } 
            //     return violatedObjects
            // }, violatedObjects)

            // dispatch({
            //     type:'setViolatedObjects',
            //     value: test
            // })
            this.setState({
                trackingData: res.data,
                violatedObjects
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
    processSearchResult = (searchResult, colorPanel, searchKey, searchValue) => {
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
                searchValue
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
    getSearchKey = (searchKey, colorPanel = null, searchValue = null) => {
        const searchResult = this.getResultBySearchKey(searchKey, colorPanel, searchValue)
        this.processSearchResult(searchResult, colorPanel, searchKey, searchValue)
    }

    getResultBySearchKey = (searchKey, colorPanel, searchValue) => {
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
                        // console.log(item.asset_control_number)
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
                    return item
                })

        } else if (searchKey === 'coordinate') {
            searchResult = this.collectObjectsByLatLng(searchValue, proccessedTrackingData)
        } else if (typeof searchKey === 'object') {
            //console.log('good')
            proccessedTrackingData.map(item => {
                if (searchKey.includes(item.type)) {
                    item.searched = true;
                    item.searchedType = -1;
                    item.pinColor = colorPanel[item.type];
                    searchResult.push(item)
                } 
            })

            let searchResultMac = [];
            //console.log(SearchResult);
            searchResult.map(item => {
                searchResultMac.push(item.mac_address)
            })
            //console.log(searchResultMac);
        } else {
            
            let searchResultMac = [];

            proccessedTrackingData.map(item => {
                if (item.object_type == 0 && (item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0
                    || item.asset_control_number.slice(10,14).indexOf(searchKey) >= 0
                    || item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) 
                ) {

                    item.searched = true
                    item.searchedType = -1;
                    searchResult.push(item)
                    searchResultMac.push(item.mac_address)
                }
            })

            //console.log(searchResultMac)
            if(this.state.lastsearchKey != searchKey){
                axios.post(dataSrc.backendSearch,{
                    keyType : 'all attributes',
                    keyWord : searchKey,
                    mac_address : searchResultMac
                })
                .then(res => {
                    console.log(res)
                })
                .catch(err =>{
                    console.log(err)
                })
                this.setState({
                    lastsearchKey: searchKey
                })
            }
            //console.log('here')
        }

        this.setState({
            proccessedTrackingData
        })
        return searchResult
    }

    collectObjectsByLatLng = (lbPosition, proccessedTrackingData) => {
        let objectList = []
        proccessedTrackingData.map(item => {
            if (item.currentPosition && 
                item.currentPosition.toString() === lbPosition.toString() &&
                item.area_id == lbPosition[2]    
            ) {
                item.searched = true;
                item.searchedType = -1;
                objectList.push(item);
            }
        })
        return objectList 
    }

    highlightSearchPanel = (boolean) => {
        this.setState({
            isHighlightSearchPanel: boolean
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
            searchResultObjectTypeMap
        } = this.state;

        const style = {
            container: {
            },
            searchResultDiv: {
                display: this.state.hasSearchKey ? null : 'none',
                // paddingTop: 30,
            },
            
            /** left area*/
            MapAndResult:{
                flex: 7,
                //border: "solid"
            },

            /** right area */
            searchPanel: {
                flex: 3,
                zIndex: this.state.isHighlightSearchPanel ? 1060 : 1,
                background: 'white',
                borderRadius: 10,
                //border : "solid",
                height: '90vh'
            },

            /** left down area */
            searchResultList: {
                display: this.state.hasSearchKey ? null : 'none',
                //border: "solid",
                maxHeight: "40vh",
                justifyContent: "center"
            },

            /** left up area */
            MapAndQrcode: {
                maxHeight: "50vh",
                //border : "solid",
            }
        }
        const { locale, auth } = this.context
        const SearchResultListDiv = screen.height*0.6 - 100 - 65 -10;

        let { stateReducer } = this.context
        let [{areaId}] = stateReducer
        let deviceNum = this.state.trackingData.filter(item => item.found).length
        let devicePlural = deviceNum === 1 ? locale.texts.DEVICE : locale.texts.DEVICES
        let data = hasSearchKey 
            ? searchResult.length !== 0 
                ? Object.keys(searchResultObjectTypeMap).length !== 0 
                    ? searchResultObjectTypeMap
                    : {[devicePlural] : 0} 
                : {[devicePlural] : 0} 
            : {[devicePlural]: this.state.trackingData.filter(item => item.found).length}

        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='d-flex flex-column w-100' style={{height: "90vh"}}>
                <div id="mainContainer" className='d-flex flex-row h-100 w-100' style={style.container}>
                    {/** left area of row */}
                    <div className='d-flex flex-column' id='searchMap' style={style.MapAndResult}>
                        {/** including QR code and map */}
                        <div className="d-flex" style={style.MapAndQrcode}>
                            <SurveillanceContainerTablet 
                                proccessedTrackingData={proccessedTrackingData.length === 0 ? trackingData : proccessedTrackingData}
                                hasSearchKey={hasSearchKey}
                                colorPanel={colorPanel}
                                handleClearButton={this.handleClearButton}
                                getSearchKey={this.getSearchKey}
                                clearColorPanel={clearColorPanel}
                                changeLocationAccuracy={this.changeLocationAccuracy}
                                // setArea={this.setArea}
                                setFence={this.setFence}
                                auth={auth}
                                lbeaconPosition={this.state.lbeaconPosition}
                                geoFenceConfig={this.state.geoFenceConfig.filter(item => parseInt(item.unique_key) == areaId)}
                                clearAlerts={this.clearAlerts}
                                data={data}
                                searchResult={this.state.searchResult}
                                searchKey={this.state.searchKey}
                            />
                        </div>

                        {/** includeing search result */}                    
                        <div id="serchResult" className="d-flex" style={style.searchResultList}>
                                <SearchResultListForTablet
                                    searchResult={this.state.searchResult} 
                                    searchKey={this.state.searchKey}
                                    highlightSearchPanel={this.highlightSearchPanel}
                                />
                        </div>
                    </div>

                    {/** right area of row */}
                    <div id='searchPanel' className="h-100" style={style.searchPanel}>
                        <SearchContainerForTablet 
                            hasSearchKey={this.state.hasSearchKey}
                            clearSearchResult={this.state.clearSearchResult}
                            hasGridButton={this.state.hasGridButton}
                            auth={auth}
                            getSearchKey={this.getSearchKey}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default MainContainerForTablet



