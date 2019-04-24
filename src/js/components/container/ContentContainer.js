/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';
import SearchContainer from './SearchContainer';

/** Import Presentational Component */
import Surveillance from '../presentational/Surveillance';
import AxiosExample from '../../axiosExample';
import dataAPI from '../../../js/dataAPI'
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


import { Row, Col, Hidden, Visible } from 'react-grid-system';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            trackingData: [],
            trackingColunm: [],
        }

        this.retrieveTrackingData = this.retrieveTrackingData.bind(this)
    }



    retrieveTrackingData(data){
        let column = [];
        data.fields.map(item => {
            let field = {};
            field.Header = item.name,
            field.accessor = item.name,
            column.push(field);
        })

        data.rows.map(item => {
            item.avg = item.avg.slice(0,6)
        })

        this.setState({
            trackingData: data.rows,
            trackingColunm: column,
        })
    }

    
    render(){

        const reactTableStyle = {
            width: '100%',
            fontSize: '0.7vw',
        }

        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='py-3'>
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col xl={8} >
                        <Hidden xs sm md lg>
                            <br></br>
                            <Surveillance retrieveTrackingData={this.retrieveTrackingData}/>
                            
                            <h5 className='mt-2'>Tracking Table</h5>
                            <ReactTable style={reactTableStyle} minRows={6} defaultPageSize={10} data={this.state.trackingData} columns={this.state.trackingColunm} pageSizeOptions={[5, 10]}/>
                        </Hidden>
                    </Col>
                    <Col xs={12} sm={12} md={12} xl={4} className="w-100">
                        <SearchContainer/>
                    </Col>
                </Row>
            </div>
            
        )
    }
}