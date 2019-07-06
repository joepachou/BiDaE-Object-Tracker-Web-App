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
        }

        this.transferSearchableObjectData = this.transferSearchableObjectData.bind(this)
        this.transferSearchResult = this.transferSearchResult.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this)
    }


    /** Transfer the processed object tracking data from Surveillance to MainContainer */
    transferSearchableObjectData(processedData){
        this.setState({
            searchableObjectData: processedData
        })
    }

    /** Transfer the search result, not found list and color panel from SearchContainer, GridButton to MainContainer 
     *  The three variable will then pass into SurveillanceContainer
    */
    transferSearchResult(searchResult, colorPanel, searchKey) {
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
            searchResultObjectTypeMap: {}
        })
    }
    
    render(){

        const { hasSearchKey, searchResult, searchType, colorPanel, clearColorPanel } = this.state;

        const style = {
            container: {
                // height: '100vh'
            },
            searchResult: {
                display: this.state.hasSearchKey ? null : 'none',
                paddingTop: 30,
            },
            alertText: {
                fontWeight: '700'
            },
            alertTextTitle: {
                fontWeight: 1000,
                color: 'rgba(101, 111, 121, 0.78)'
            }

        }
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='' >
                <Row id="mainContainer" className='d-flex w-100 justify-content-around mx-0 overflow-hidden' style={style.container}>
                    <Col sm={7} md={9} lg={9} xl={9} id='searchMap' >
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
                                                <div style={style.alertText}>{this.state.searchKey}</div>
                                                &nbsp;
                                            </Alert>
                                        :    
                                            <Alert variant='secondary' className='d-flex justify-content-start'>
                                                <div style={style.alertTextTitle}>{'Found '}</div>
                                                &nbsp;
                                                &nbsp;

                                                <div style={style.alertText}>{Object.keys(this.state.searchableObjectData).length}</div>
                                                &nbsp;
                                                <div style={style.alertText}>{'devices'}</div>
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
                                transferSearchableObjectData={this.transferSearchableObjectData}
                                searchType={searchType}
                                colorPanel={colorPanel}
                                handleClearButton={this.handleClearButton}
                                transferSearchResult={this.transferSearchResult}
                                clearColorPanel={clearColorPanel}

                            />
                    </Col>
                    <Col xs={12} sm={5} md={3} lg={3} xl={3} className="w-100 px-4">
                        <SearchContainer 
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResult={this.transferSearchResult}
                            hasSearchKey={this.state.hasSearchKey}
                        />
                        
                        {/* <GridButton
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResult={this.transferSearchResult}
                            clearColorPanel={clearColorPanel}
                        /> */}
                        <div style={style.searchResult} className='py-3'>
                            <SearchResult 
                                searchResult={this.state.searchResult} 
                                searchKey={this.state.searchKey}
                                transferSearchResult={this.transferSearchResult}
                                colorPanel={this.state.colorPanel}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}