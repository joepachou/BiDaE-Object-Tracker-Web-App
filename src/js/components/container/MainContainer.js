/** React Plugin */
import React from 'react';

/** Import Container Component */
import SearchContainer from './SearchContainer';

/** Import Presentational Component */

import 'react-table/react-table.css';
import SearchResult from '../presentational/SearchResult'


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';
import GridButton from './GridButton';
import { Alert } from 'react-bootstrap';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            hasSearchKey: false,
            searchKey: '',
            searchableObjectData: [],
            searchResult: [],
            searchType: '',
            colorPanel: null,
            clearColorPanel: false,
            searchResultObjectTypeMap: {},
            clearSearchResult: false,
        }

        this.transferSearchableObjectDataToMain = this.transferSearchableObjectDataToMain.bind(this)
        this.transferSearchResultToMain = this.transferSearchResultToMain.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this)
    }


    /** Transfer the processed object tracking data from Surveillance to MainContainer */
    transferSearchableObjectDataToMain(processedData){
        this.setState({
            searchableObjectData: processedData
        })
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer
    */
    transferSearchResultToMain(searchResult, colorPanel, searchKey) {
        let searchResultObjectTypeMap = {}
        searchResult.map( item => {
            if (!(item.type in searchResultObjectTypeMap)){
                searchResultObjectTypeMap[item.type] = 1
            } else {
                searchResultObjectTypeMap[item.type] = searchResultObjectTypeMap[item.type] + 1
            }
        })

        if(colorPanel) {
            this.setState({
                hasSearchKey: colorPanel.size === 0 ? false : true,
                searchResult: searchResult,
                colorPanel: colorPanel,
                clearColorPanel: false,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
                clearSearchResult: false,
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
                clearSearchResult: false
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

                                                <div style={style.alertText}>{Object.keys(this.state.searchableObjectData).length}</div>
                                                &nbsp;
                                                <div style={style.alertText}>{'device'}</div>
                                            </Alert>
                                    : 
                                        <Alert variant='secondary' className='d-flex justify-content-start'>
                                            <div style={style.alertTextTitle}>{'Found '}</div>

                                            {Object.keys(this.state.searchResultObjectTypeMap).map((item) => {
                                                return  <>
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
                                                        </>
                                                })}
                                        </Alert> 
                                    
                                } 
                            </div>
                            <SurveillanceContainer 
                                hasSearchKey={hasSearchKey} 
                                searchResult={searchResult}
                                transferSearchableObjectDataToMain={this.transferSearchableObjectDataToMain}
                                searchType={searchType}
                                colorPanel={colorPanel}
                                handleClearButton={this.handleClearButton}
                                transferSearchResultToMain={this.transferSearchResultToMain}
                                clearColorPanel={clearColorPanel}

                            />
                    </Col>
                    <Col xs={12} sm={5} md={3} lg={3} xl={3} className="w-100 px-2">
                        <SearchContainer 
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResultToMain={this.transferSearchResultToMain}
                            hasSearchKey={this.state.hasSearchKey}
                            clearSearchResult={this.state.clearSearchResult}
                        />
                        
                        {/* <GridButton
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResultToMain={this.transferSearchResultToMain}
                            clearColorPanel={clearColorPanel}
                        /> */}
                        <div style={style.searchResultDiv} className='py-3'>
                            <SearchResult 
                                searchResult={this.state.searchResult} 
                                searchKey={this.state.searchKey}
                                transferSearchResultToMain={this.transferSearchResultToMain}
                                colorPanel={this.state.colorPanel}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}