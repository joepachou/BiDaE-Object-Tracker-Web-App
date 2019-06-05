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


import { Row, Col, Hidden, Visible } from 'react-grid-system';
import SurveillanceContainer from './SurveillanceContainer';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            trackingData: [],
            trackingColunm: [],
            hasSearchKey: false,
            searchedObjectData: null,
        }

        this.retrieveTrackingData = this.retrieveTrackingData.bind(this)
        this.transferSearchResultFromSearchToMap = this.transferSearchResultFromSearchToMap.bind(this);
    }



    retrieveTrackingData(data){
        let column = [];
        data.fields.map(item => {
            let field = {};
            field.Header = item.name,
            field.accessor = item.name,
            column.push(field);
        })

        this.setState({
            trackingData: data.rows,
            trackingColunm: column,
        })
    }

    transferSearchResultFromSearchToMap(data) {
        this.setState({
            hasSearchKey: true,
            searchedObjectData: data,
        })
    }

    
    render(){

        const reactTableStyle = {
            width: '100%',
            fontSize: '0.7vw',
        }
        
        const { hasSearchKey, searchedObjectData } = this.state;
        return(

            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='py-3'>
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col xl={8} >
                        <Hidden xs sm md lg>
                            <br/>
                            {/* <Surveillance retrieveTrackingData={this.retrieveTrackingData}/>
                            <ToggleSwitch title="Location Accuracy" leftLabel='Low' middleLabel='Med' rightLabel='High' /> */}
                            <SurveillanceContainer 
                                retrieveTrackingData={this.retrieveTrackingData} 
                                hasSearchKey={hasSearchKey} 
                                searchedObjectData={searchedObjectData}
                            />

                            <h5 className='mt-2'>Tracking Table</h5>
                            <ReactTable minRows={6} defaultPageSize={10} data={this.state.trackingData} columns={this.state.trackingColunm} pageSizeOptions={[5, 10]}/>
                        </Hidden>
                    </Col>
                    {/* <Col>

                        <Navs />
                    </Col> */}
                    <Col xs={12} sm={12} md={12} xl={4} className="w-100">
                        <SearchContainer transferSearchResultFromSearchToMap={this.transferSearchResultFromSearchToMap}/>
                    </Col>
                </Row>
            </div>
            
        )
    }
}