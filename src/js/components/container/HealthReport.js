/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container, Tabs, Tab, Nav, Button, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './EditLbeaconForm'

import Axios from 'axios';
import dataSrc from '../../../js/dataSrc';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import { 
    trackingTable,
    lbeaconTable,
    gatewayTable
} from '../../tables';
import { retrieveDataService } from '../../retrieveDataService';


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
            selectedRowData: {},
            isShowModal: false,
        }
        this.getGatewayData = this.getGatewayData.bind(this)
        this.getLbeaconData = this.getLbeaconData.bind(this)
        this.getTrackingData = this.getTrackingData.bind(this)
        this.handleSubmitForm = this.handleSubmitForm.bind(this)
        this.handleCloseForm = this.handleCloseForm.bind(this)
        this.startSetInterval = config.healthReport.startInteval
    }

    componentDidUpdate(prepProps) {
        if (prepProps !== this.props && this.props.objectInfo) {
            this.processTrackingData(this.props.objectInfo)
        }
    }

    componentDidMount(){
        this.getLbeaconData();
        this.getGatewayData();
        this.getTrackingData()
        this.getGatewayDataInterval = this.startSetInterval ? setInterval(this.getGatewayData, config.healthReport.pollGatewayTableIntevalTime) : null;
        this.getLbeaconDataInterval = this.startSetInterval ? setInterval(this.getLbeaconData, config.healthReport.pollLbeaconTabelIntevalTime) : null;
    }

    componentWillUnmount() {
        clearInterval(this.getGatewayDataInterval);
        clearInterval(this.getLbeaconDataInterval);
    }

    getGatewayData(){
        Axios.get(dataSrc.getGatewayTable)
            .then(res => {
                this.setState({
                    gatewayData: res.data.rows,
                    gatewayColunm: gatewayTable
                })
            })
            .catch(function (error) {
                console.log(error);
            })
        }

    getLbeaconData(){
        Axios.get(dataSrc.getLbeaconTable)
            .then(res => {
                this.setState({
                    lbeaconData: res.data.rows,
                    lbeaconColumn: lbeaconTable
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getTrackingData() {
        Axios.post(dataSrc.getTrackingData,{
            rssiThreshold: config.surveillanceMap.locationAccuracyMapToDefault[config.objectManage.objectManagementRSSIThreshold]
        })
        .then(res => {
            this.setState({
                trackingData: res.data.rows,
                trackingColunm: trackingTable
            })
        })
    }

    handleSubmitForm() {
        this.setState({
            isShowModal: false
        })
        setInterval(
            this.getLbeaconData()
            ,1000
        )
    }

    handleCloseForm() {
        this.setState({
            isShowModal: false
        })
    }
    
    render(){

        const style = {
            reactTable: {
                width:'100%',
                fontSize: '1em',
            },
            container: {
                width: '100%',
                paddingRight: 15,
                paddingLeft: 15,
                margin: '0 10rem 0 10rem'
            }
        }

        const locale = this.context;

        return(
            <Container className='py-4' fluid>
            <ButtonToolbar>
                <Button variant="outline-primary">Primary</Button>
                <Button variant="outline-secondary">Secondary</Button>
                <Button variant="outline-success">Success</Button>
                <Button variant="outline-warning">Warning</Button>
                <Button variant="outline-danger">Danger</Button>
                <Button variant="outline-info">Info</Button>
                <Button variant="outline-light">Light</Button>
                <Button variant="outline-dark">Dark</Button>
            </ButtonToolbar>
            <Nav
                activeKey="/home"
                onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <Nav.Item>
                    <Button>123</Button>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="disabled" disabled>
                    Disabled
                    </Nav.Link>
                </Nav.Item>
            </Nav>
                <Tabs defaultActiveKey="lbeacon_table" transition={false} variant="pills" className='mb-1'>
                    <Tab eventKey="lbeacon_table" title="LBeacon" > 
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.lbeaconData} 
                            columns={this.state.lbeaconColumn}
                            defaultPageSize={15}
                            className="-highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                            isShowModal: true,
                                        })
                                
                                        // IMPORTANT! React-Table uses onClick internally to trigger
                                        // events like expanding SubComponents and pivots.
                                        // By default a custom 'onClick' handler will override this functionality.
                                        // If you want to fire the original onClick handler, call the
                                        // 'handleOriginal' function.
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                    }
                                }
                            }}
                        />
                    </Tab>
                    <Tab eventKey="gateway_table" title="Gateway">
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.gatewayData} 
                            columns={this.state.gatewayColunm}
                            defaultPageSize={15} 
                            resizable={true}
                            freezeWhenExpanded={false}
                        />
                    </Tab>
                    <Tab eventKey="tracking_table" title="Tracking Object">
                        <ReactTable 
                            minRows={6} 
                            defaultPageSize={15} 
                            data={this.state.trackingData} 
                            columns={this.state.trackingColunm} 
                            pageSizeOptions={[5, 10]}
                            resizable={true}
                            freezeWhenExpanded={false}
                        />
                    </Tab>
                </Tabs>
                <EditLbeaconForm 
                    show = {this.state.isShowModal} 
                    title={locale.EDIT_LBEACON}
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmitForm={this.handleSubmitForm}
                    handleCloseForm={this.handleCloseForm}
                />
            </Container>
        )
    }
}

HealthReport.contextType = LocaleContext

export default HealthReport;