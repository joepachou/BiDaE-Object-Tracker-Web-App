/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';
import dataSrc from '../../../js/dataSrc'
import { connect } from 'react-redux';


class HealthReport extends React.Component{

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
        this.processTrackingData = this.processTrackingData.bind(this)
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
        axios.get(dataSrc.gatewayTable).then(res => {
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
        axios.get(dataSrc.lbeaconTable).then(res => {
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

    componentDidUpdate(prepProps) {
        if (prepProps !== this.props && this.props.objectInfo !== undefined) {
            this.processTrackingData(this.props.objectInfo)
        }
    }

    processTrackingData(rawData){
        let column = [];

        let raw = rawData.fields.filter(item => {
            return item.name !== 'access_control_number' && item.name !== 'transferred_location'
        })

        raw.map(item => {
            let field = {};
            field.Header = item.name,
            field.accessor = item.name,
            column.push(field);
        })

        this.setState({
            trackingData: rawData.rows,
            trackingColunm: column,
        })
    }

    
    render(){

        const style = {
            reactTable: {
                width:'100%',
                fontSize: '1em',
            }    
        }

        const { trackingData, trackingColunm } = this.state;

        return(
            <Container className='py-2'fluid >
                <Tabs defaultActiveKey="lbeacon_table" transition={false} id="noanim-tab-example">
                    <Tab eventKey="lbeacon_table" title="LBeacon">
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.lbeaconData} 
                            columns={this.state.lbeaconColumn}
                            showPagination = {false}
                        />
                    </Tab>
                    <Tab eventKey="gateway_table" title="Gateway">
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.gatewayData} 
                            columns={this.state.gatewayColunm}
                            showPagination = {false}
                        />
                    </Tab>
                    <Tab eventKey="tracking_table" title="Track">
                        <ReactTable 
                            minRows={6} 
                            defaultPageSize={50} 
                            data={trackingData} 
                            columns={trackingColunm} 
                            pageSizeOptions={[5, 10]}
                            showPagination = {false}

                        />
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}


/** Which State do you need */
const mapStateToProps = state => {
    return {
        objectInfo: state.retrieveTrackingData
    }
}

export default connect(mapStateToProps)(HealthReport);