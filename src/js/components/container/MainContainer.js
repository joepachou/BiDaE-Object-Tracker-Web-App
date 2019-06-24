/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';
import SearchContainer from './SearchContainer';

/** Import Presentational Component */
import dataSrc from '../../dataSrc'
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ModalForm from './ModalForm';
import Navs from '../presentational/Navs'
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
            searchableObjectData: null,
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

    /** Transfer the searched object data from SearchContainer, GridButton to MainContainer */
    transferSearchResult(searchResult, colorPanel) {
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
                hasSearchKey: true,
                searchResult: searchResult,
                colorPanel: colorPanel,
                clearColorPanel: false,
                searchResultObjectTypeMap: searchResultObjectTypeMap, 
            })
        } else {
            this.clearGridButtonBGColor();
            this.setState({
                hasSearchKey: true,
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
            }

        }
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='' style={style.container}>
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col xl={8} >
                        <Hidden xs sm md lg>
                            <br/>
                            <div>
                                    {this.state.searchResult.length === 0
                                        ? this.state.searchableObjectData ? <Alert variant='secondary'>{Object.keys(this.state.searchableObjectData).length + ' devices found'}</Alert>: <br></br>
                                        : Object.keys(this.state.searchResultObjectTypeMap).map((item,index) => {
                                            return <Alert variant='secondary' key={index}>{this.state.searchResultObjectTypeMap[item]} {item} found</Alert> 
                                        })
                                    } 
                            </div>
                            <SurveillanceContainer 
                                hasSearchKey={hasSearchKey} 
                                searchResult={searchResult}
                                transferSearchableObjectData={this.transferSearchableObjectData}
                                searchType={searchType}
                                colorPanel={colorPanel}
                                handleClearButton={this.handleClearButton}
                            />
                        </Hidden>
                    </Col>
                    <Col xs={12} sm={12} md={12} xl={4} className="w-100">
                        <SearchContainer 
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResult={this.transferSearchResult}
                            hasSearchKey={this.state.hasSearchKey}
                        />
                        
                        <GridButton
                            searchableObjectData={this.state.searchableObjectData} 
                            transferSearchResult={this.transferSearchResult}
                            clearColorPanel={clearColorPanel}
                        />
                        <div style={style.searchResult} className='py-3'>
                            <SearchResult 
                                result={searchResult} 
                                searchKey={this.state.searchKey}    
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}