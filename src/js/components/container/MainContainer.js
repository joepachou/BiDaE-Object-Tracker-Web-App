/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */

import 'react-table/react-table.css';
import SearchResult from '../presentational/SearchResult'


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';
import { Alert } from 'react-bootstrap';
import AuthenticationContext from '../../context/AuthenticationContext';
import { connect } from 'react-redux'

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

        this.transferSearchResultToMain = this.transferSearchResultToMain.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this)
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer
    */
    transferSearchResultToMain(searchResult, colorPanel, searchKey) {

        /** Count Object Type */
        let searchResultObjectTypeMap = searchResult.reduce((allObjectTypes, item) => {
            item.type in allObjectTypes ? allObjectTypes[item.type] ++ : allObjectTypes[item.type] = 1 ;
            return allObjectTypes
        }, {})

        if(colorPanel) {
            this.setState({
                hasSearchKey: colorPanel.size === 0 ? false : true,
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
            alertText: {
                fontSize: '1.2rem',
                fontWeight: '700'
            },
            alertTextTitle: {
                fontSize: '1.2rem',
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            }

        }
        return(
            <AuthenticationContext.Consumer>
                {auth => (
                    /** "page-wrap" the default id named by react-burget-menu */
                    <div id="page-wrap" className='' >
                        <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                            <Col sm={7} md={9} lg={9} xl={9} id='searchMap' className="pl-2 pr-1" >
                                    <br/>
                                    <div>
                                        {this.state.searchResult.length === 0
                                            ? this.state.hasSearchKey 
                                                ?
                                                    <Alert variant='secondary' className='d-flex justify-content-start'>
                                                        <div style={style.alertTextTitle}>{'Found '}</div>
                                                        &nbsp;
                                                        &nbsp;

                                                        <div style={style.alertText}>{this.state.searchResult.length}</div>
                                                        &nbsp;
                                                        <div style={style.alertText}>{'device'}</div>
                                                        &nbsp;
                                                    </Alert>
                                                :    
                                                    <Alert variant='secondary' className='d-flex justify-content-start'>
                                                        <div style={style.alertTextTitle}>{'Found '}</div>
                                                        &nbsp;
                                                        &nbsp;

                                                        <div style={style.alertText}>
                                                            {Object.keys(this.props.objectInfo.filter(item => item.found)).length}
                                                        </div>
                                                        &nbsp;
                                                        <div style={style.alertText}>{'device'}</div>
                                                    </Alert>
                                            : 
                                                <Alert variant='secondary' className='d-flex justify-content-start'>
                                                    <div style={style.alertTextTitle}>{'Found '}</div>

                                                    {Object.keys(this.state.searchResultObjectTypeMap).map((item,index) => {
                                                        return  <div key={index} className="d-inline-flex">
                                                                    &nbsp;
                                                                    &nbsp;

                                                                    <div style={style.alertText}>
                                                                        {this.state.searchResultObjectTypeMap[item]}
                                                                    </div>
                                                                    &nbsp;
                                                                    <div style={style.alertText}>
                                                                        {item}
                                                                    </div>
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    &nbsp;
                                                                </div>
                                                        })}
                                                </Alert> 
                                            
                                        } 
                                    </div>
                                    <SurveillanceContainer 
                                        hasSearchKey={hasSearchKey}
                                        searchableObjectData={this.props.objectInfo} 
                                        searchResult={searchResult}
                                        searchType={searchType}
                                        colorPanel={colorPanel}
                                        handleClearButton={this.handleClearButton}
                                        transferSearchResultToMain={this.transferSearchResultToMain}
                                        clearColorPanel={clearColorPanel}

                                    />
                            </Col>
                            <Col xs={12} sm={5} md={3} lg={3} xl={3} className="w-100 px-2">
                                <SearchContainer 
                                    searchableObjectData={this.props.objectInfo} 
                                    transferSearchResultToMain={this.transferSearchResultToMain}
                                    hasSearchKey={this.state.hasSearchKey}
                                    clearSearchResult={this.state.clearSearchResult}
                                    hasGridButton={this.state.hasGridButton}
                                    auth={auth}
                                />
                                
                                <div style={style.searchResultDiv} className='py-3'>
                                    <SearchResult 
                                        searchResult={this.state.searchResult} 
                                        searchKey={this.state.searchKey}
                                        transferSearchResultToMain={this.transferSearchResultToMain}
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

const mapStateToProps = (state) => {
    return {
        objectInfo: state.retrieveTrackingData.objectInfo
    }
}

export default connect(mapStateToProps)(MainContainer)



