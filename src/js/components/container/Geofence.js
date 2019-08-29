/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import dataSrc from '../../../js/dataSrc'
import { geofenceTableColumn } from '../../tables';
import LocaleContext from '../../context/LocaleContext';


class Geofence extends React.Component{

    state = {
        geofenceData: [],
        geofenceColumn: [],
        locale: this.context.lang
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.lang !== prevState.locale) {
            this.getGeofenceData();
            this.setState({
                locale: this.context.lang
            })
        }
    }
  
    componentDidMount = () => {
        this.getGeofenceData();
        this.getGeofenceDataInterval = setInterval(this.getGeofenceData,10000)
    }

    componentWillUnmount = () => {
        clearInterval(this.getGeofenceDataInterval);
    }

    getGeofenceData = () => {
        let locale = this.context
        axios.post(dataSrc.geofenceData, {
            locale: this.context.abbr
        })
        .then(res => {
            let column = _.cloneDeep(geofenceTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]                    
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
            <Container 
                fluid 
                className="py-2 text-capitalize"
            >
                <Row className='d-flex w-100 justify-content-around mx-0'>
                    <Col className='py-2'>
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.geofenceData} 
                            columns={this.state.geofenceColumn}
                            defaultPageSize={15} 
                            />
                    </Col>
                </Row>
            </Container>
        )
    }
}

Geofence.contextType = LocaleContext

export default Geofence;