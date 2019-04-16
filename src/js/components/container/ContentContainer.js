/** React Plugin */
import React from 'react';

/** Import Container Component */
import ObjectManagementContainer from './ObjectManagementContainer';
import SearchContainer from './SearchContainer';

/** Import Presentational Component */
import SeachableObject from '../presentational/SearchableObject';
import Surveillance from '../presentational/Surveillance';
import AxiosExample from '../../axiosExample';
import ReactTableContainer from './ReactTableContainer';
import dataAPI from '../../../js/dataAPI'
import axios from 'axios';

import { Row, Col, Hidden, Visible } from 'react-grid-system';

export default class ContentContainer extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            lbeaconData: [],
            lbeaconColumn: [],
            gatewayData: [],
            gatewayColunm: [],
            trackingData: [],
            trackingColunm: [],
        }
        this.getGatewayData = this.getGatewayData.bind(this)
        this.getLbeaconData = this.getLbeaconData.bind(this)
        this.retrieveTrackingData = this.retrieveTrackingData.bind(this)
    }

    componentDidMount(){
        this.getGatewayData();
        this.getLbeaconData();
        this.getGatewayDataInterval = setInterval(this.getGatewayData,60000)
        this.getLbeaconDataInterval = setInterval(this.getLbeaconData,60000)
    }

    componentWillUnmount() {
        clearInterval(this.getGatewayDataInterval);
        clearInterval(this.getLbeaconDataInterval);
    }

    getGatewayData(){
        axios.get(dataAPI.gatewayTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
            })
            this.setState({
                gatewayData: res.data.rows,
                gatewayColunm: column,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    getLbeaconData(){
        axios.get(dataAPI.lbeaconTable).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
                
            })
            this.setState({
                lbeaconData: res.data.rows,
                lbeaconColumn: column,

            })
        })
        .catch(function (error) {
            console.log(error);
        })
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
        return(
            /** "page-wrap" the default id named by react-burget-menu */
            <div id="page-wrap" className='py-3'>
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col xl={8}>
                        <Hidden xs sm md lg><Surveillance retrieveTrackingData={this.retrieveTrackingData}/></Hidden>
                    </Col>
                    <Col xs={12} sm={12} md={12} xl={4} className="w-100">
                        <SearchContainer/>

                    </Col>
                </Row>
                {/* <Row>
                    <Col>
                        <h1>tracking table</h1>
                        <ReactTableContainer data={this.state.trackingData} column={this.state.trackingColunm}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h1>lbeacon table</h1>
                        <ReactTableContainer data={this.state.lbeaconData} column={this.state.lbeaconColumn}/>
                    </Col>
                    <Col>
                        <h1>gateway table</h1>
                        <ReactTableContainer data={this.state.gatewayData} column={this.state.gatewayColunm}/>
                    </Col>

                </Row>                 */}
            </div>
            
        )
    }
}