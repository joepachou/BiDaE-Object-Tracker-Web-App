/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */

import 'react-table/react-table.css';
import SearchResult from '../presentational/SearchResult'


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';
import AuthenticationContext from '../../context/AuthenticationContext';
import { connect } from 'react-redux'
import config from '../../config';
import InfoPrompt from '../presentational/InfoPrompt';
import _ from 'lodash'

const myDevices = config.frequentSearchOption.MY_DEVICES;
const allDevices = config.frequentSearchOption.ALL_DEVICES;

class MainContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            hasSearchKey: false,
            searchKey: '',
            searchResult: [],
            searchType: '',
            colorPanel: null,
            clearColorPanel: false,
            searchResultObjectTypeMap: {},
            clearSearchResult: false,
            hasGridButton: false,
        }

        this.processSearchResult = this.processSearchResult.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this)
        this.getSearchKey = this.getSearchKey.bind(this)
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer */
    processSearchResult(searchResult, colorPanel, searchKey) {
        /** Count the number of found object type */
        let duplicateSearchKey = []
        if (typeof searchKey === 'string') {
            searchKey === 'all devices' || searchKey === 'my devices' ? null : duplicateSearchKey.push(searchKey)
        } else {
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
                searchKey: '',
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
            })
        }
    }

    clearGridButtonBGColor() {
        var gridbuttons = document.getElementsByClassName('gridbutton')
        for(let button of gridbuttons) {
            button.style.background = ''
        }
    }

    handleClearButton() {
        this.clearGridButtonBGColor();
        this.setState({
            hasSearchKey: false,
            searchResult: [],
            colorPanel: null,
            clearColorPanel: true,
            searchResultObjectTypeMap: {},
            clearSearchResult: this.state.hasSearchKey ? true : false,
        })
    }

    /** Fired once the user click the item in object type list or in frequent seaerch */
    getSearchKey(searchKey, colorPanel = null) {
        const searchResult = this.getResultBySearchKey(searchKey, colorPanel)
        this.processSearchResult(searchResult, colorPanel, searchKey)
    }

    getResultBySearchKey(searchKey, colorPanel) {
        const auth = this.context
        let searchResult = [];

        if (searchKey === myDevices) {
            const devicesAccessControlNumber = auth.userInfo.myDevice
            this.props.objectInfo.map(item => {
                devicesAccessControlNumber.includes(item.access_control_number) ? searchResult.push(item) : null;
            })
        } else if (searchKey === allDevices) {
            searchResult = this.props.objectInfo
        } else if (typeof searchKey === 'object') {
            this.props.objectInfo.map(item => {
                searchKey.includes(item.type) ? searchResult.push(item) : null;
                item.pinColor = colorPanel[item.type];
            })
        } else {
            this.props.objectInfo.map(item => {
                if (item.type.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0
                    || item.access_control_number.slice(10,14).indexOf(searchKey) >= 0
                    || item.name.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) {
                    searchResult.push(item)
                }
            })
        }
        return searchResult
    }
    
    render(){

        const { hasSearchKey, searchResult, searchType, colorPanel, clearColorPanel } = this.state;

        const style = {
            container: {

                /** The height: 100vh will cause the page can only have 100vh height.
                 * In other word, if the seaerch result is too long and have to scroll down, the page cannot scroll down
                 */
                // height: '100vh'
            },
            searchResultDiv: {
                display: this.state.hasSearchKey ? null : 'none',
                paddingTop: 30,
            },
        }
        return(
            <AuthenticationContext.Consumer>
                {auth => (
                    /** "page-wrap" the default id named by react-burget-menu */
                    <div id="page-wrap" className='' >
                        <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                            <Col sm={7} md={9} lg={9} xl={9} id='searchMap' className="pl-2 pr-1" >
                                <br/>
                                {this.state.hasSearchKey 
                                    ?   <InfoPrompt data={this.state.searchResultObjectTypeMap} />                                        
                                    :   <InfoPrompt data={{devices: this.props.objectInfo.filter(item => item.found).length}} />
                                }     
                                <SurveillanceContainer 
                                    hasSearchKey={hasSearchKey}
                                    searchableObjectData={this.props.objectInfo} 
                                    searchResult={searchResult}
                                    searchType={searchType}
                                    colorPanel={colorPanel}
                                    handleClearButton={this.handleClearButton}
                                    getSearchKey={this.getSearchKey}
                                    clearColorPanel={clearColorPanel}

                                />
                            </Col>
                            <Col xs={12} sm={5} md={3} lg={3} xl={3} className="w-100 px-2">
                                <SearchContainer 
                                    searchableObjectData={this.props.objectInfo} 
                                    hasSearchKey={this.state.hasSearchKey}
                                    clearSearchResult={this.state.clearSearchResult}
                                    hasGridButton={this.state.hasGridButton}
                                    auth={auth}
                                    getSearchKey={this.getSearchKey}
                                />
                                
                                <div style={style.searchResultDiv} className='py-3'>
                                    <SearchResult 
                                        searchResult={this.state.searchResult} 
                                        searchKey={this.state.searchKey}
                                        processSearchResult={this.processSearchResult}
                                        colorPanel={this.state.colorPanel}
                                        auth={auth}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </AuthenticationContext.Consumer>
        )
    }
}
MainContainer.contextType = AuthenticationContext;

const mapStateToProps = (state) => {
    return {
        objectInfo: state.retrieveTrackingData.objectInfo
    }
}

export default connect(mapStateToProps)(MainContainer)



