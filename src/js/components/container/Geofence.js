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
        this.getGeofenceDataInterval = setInterval(this.getGeofenceData,10000)
    }

    componentWillUnmount() {
        clearInterval(this.getGeofenceDataInterval);
    }

    getGeofenceData(){
        axios.get(dataSrc.geofenceData).then(res => {
            let column = [];
            res.data.fields.map(item => {
                let field = {};
                field.Header = item.name.replace(/_/g, ' ')
                    .toLowerCase()
                    .split(' ')
                    .map( s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),                
                field.accessor = item.name,
                field.headerStyle={
                    textAlign: 'left',
                }
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

        const style = {
            reactTable: {
                width:'100%',
                fontSize: '1em',
            }    
        }
        return(
            <Container fluid className="py-2">
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col className='py-2'>
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.geofenceData} 
                            columns={this.state.geofenceColumn}

                            />
                    </Col>
                </Row>
            </Container>
        )
    }
}