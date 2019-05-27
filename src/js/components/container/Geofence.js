/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';
import dataSrc from '../../../js/dataSrc'


export default class HealthReport extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            geofenceData: [],
            geofenceColumn: [],

        }
        this.getGeofenceData = this.getGeofenceData.bind(this)
    }

    componentDidMount(){
        this.getGeofenceData();
        this.getGeofenceDataInterval = setInterval(this.getGeofenceData,60000)
    }

    componentWillUnmount() {
        clearInterval(this.getGeofenceDataInterval);
    }

    getGeofenceData(){
        axios.get(dataSrc.geofenceData).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name,
                field.accessor = item.name,
                column.push(field);
                
            })
            this.setState({
                geofenceData: res.data.rows,
                geofenceColumn: column,

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
                        <ReactTable style={reactTableStyle} data={this.state.geofenceData} columns={this.state.geofenceColumn}/>
                    </Col>
                </Row>
        )
    }
}