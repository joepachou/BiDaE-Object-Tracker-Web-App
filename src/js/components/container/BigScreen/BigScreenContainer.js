import React from 'react';
import 'react-table/react-table.css';
import { 
    Row, 
    Col 
} from 'react-bootstrap'
import SurveillanceContainer from './SurveillanceContainer';
import config from '../../../config';
import _ from 'lodash'
import axios from 'axios';
import dataSrc from '../../../dataSrc'
import { AppContext } from '../../../context/AppContext'

const {
    ALL_DEVICES,
    MY_DEVICES,
    ALL_PATIENTS,
    MY_PATIENTS,
} = config.frequentSearchOption

class MainContainer extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        proccessedTrackingData: [],
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
        auth: this.context.auth,
        shouldUpdateTrackingData: true,
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.interval = setInterval(this.getTrackingData, config.mapConfig.intervalTime)
    }

    componentDidUpdate = (prevProps, prevState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, prevState.trackingData))
        let { stateReducer } = this.context
        
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
        if (!(_.isEqual(prevState.auth, this.context.auth))) {
            this.getTrackingData(this.context.stateReducer[0].areaId)
            this.setState({
                auth: this.context.auth,
            })
        } 
    }

    shouldComponentUpdate = (nextProps,nextState) => {
        let isTrackingDataChange = !(_.isEqual(this.state.trackingData, nextState.trackingData))
        let hasSearchKey = nextState.hasSearchKey !== this.state.hasSearchKey
        let isSearchKeyChange = this.state.searchKey !== nextState.searchKey
        let isSearchResultChange = !(_.isEqual(this.state.searchResult, nextState.searchResult))
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


    addSearchedIndex = (trackingData, queue) => {
        for(var i in queue){
            var addresses = queue[i].result_mac_address
            trackingData = trackingData.map(item =>{
                if(addresses.includes(item.mac_address)){
                    item.searched = parseInt(i) + 1
                    item.pinColor = queue[i].pin_color_index
                }
                return item
            } )
        }
        trackingData = trackingData.map(item => {
            if(item.searched === undefined){
                item.searched = -1
                item.pinColor = -1
            }
            return item
        })

        return trackingData
    } 

    countItemsInQueue = (data, index) => {
        
        var count = data.filter(item => {
            return item.searched == index + 1
        }).length
        return count
    }

    getTrackingData = () => {
        let { auth, locale, stateReducer } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getTrackingData,{
            locale: locale.abbr,
            user: auth.user,
            areaId,
        })
        .then(res => {
            // console.log(dataSrc.getSearchQueue)
            axios.post(dataSrc.getSearchQueue,{}).then(searchQueue => {
                const rawTrackingData = res.data
                const queue = searchQueue.data

                // used for legend, with text description and image icon
                var trackingData = this.addSearchedIndex(rawTrackingData, queue)
                // console.log(queue)
                var legendDescriptor = queue.map((queue1, index) => {
                    return {
                        text: queue1.key_word,
                        pinColor: config.mapConfig.iconColor.pinColorArray[queue1.pin_color_index],
                        itemCount:  this.countItemsInQueue(trackingData, index)
                    }    
                })                

                let violatedObjects = trackingData.reduce((violatedObjects, item) => {
                    if (!(item.mac_address in violatedObjects) && item.isViolated) {
                        violatedObjects[item.mac_address] = item
                    } 
                    return violatedObjects
                }, _.cloneDeep(this.state.violatedObjects))
                this.setState({
                    trackingData: res.data,
                    violatedObjects,
                    legendDescriptor,
                })
            })
        })
        .catch(error => {
            console.log(error)
        })
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
            // console.log('good')
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
                    || item.asset_control_number.slice(10,14).indexOf(searchKey) >= 0
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

        } = this.state;

        const style = {
            pageWrap: {
                overflow: "hidden hidden",
            },
        }

        const { 
            locale, 
            auth,
            stateReducer,
        } = this.context

        
        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='mx-1 my-2 overflow-hidden' style={style.pageWrap} >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                    <Col id='searchMap' className="pl-2 pr-1" >
                        <SurveillanceContainer 
                            proccessedTrackingData={trackingData}
                            hasSearchKey={hasSearchKey}
                            colorPanel={colorPanel}
                            handleClearButton={this.handleClearButton}
                            getSearchKey={this.getSearchKey}
                            clearColorPanel={clearColorPanel}
                            auth={auth}
                            clearAlerts={this.clearAlerts}
                            legendDescriptor = {this.state.legendDescriptor}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MainContainer




