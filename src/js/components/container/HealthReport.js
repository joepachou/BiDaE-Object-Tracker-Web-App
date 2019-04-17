/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';
import dataAPI from '../../../js/dataAPI'


export default class HealthReport extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            lbeaconData: [],
            lbeaconColumn: [],
            gatewayData: [],
            gatewayColunm: [],
        }
        this.getGatewayData = this.getGatewayData.bind(this)
        this.getLbeaconData = this.getLbeaconData.bind(this)
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
    
    render(){

        const reactTableStyle = {
            width:'100%',
            fontSize: '1vw',
        }
        return(
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col>
                        <h5>lbeacon table</h5>
                        <ReactTable style={reactTableStyle} data={this.state.lbeaconData} columns={this.state.lbeaconColumn}/>
                    </Col>
                    <Col>
                        <h5>gateway table</h5>
                        <ReactTable style={reactTableStyle} data={this.state.gatewayData} columns={this.state.gatewayColunm}/>
                    </Col>

                </Row>
        )
    }
}