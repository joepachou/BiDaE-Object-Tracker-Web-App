/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container, Tabs, Tab, Nav, Button, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './EditLbeaconForm'

import axios from 'axios';
import dataSrc from '../../dataSrc';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import { 
    trackingTableColumn,
    lbeaconTableColumn,
    gatewayTableColumn
} from '../../tables';
import { AppContext } from '../../context/AppContext';

class SystemStatus extends React.Component{

    static contextType = AppContext
    state = {
        lbeaconData: [],
        lbeaconColumn: [],
        gatewayData: [],
        gatewayColunm: [],
        trackingData: [],
        trackingColunm: [],
        selectedRowData: {},
        isShowModal: false,
        locale: this.context.locale.lang
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.lang !== prevState.locale) {
            this.getLbeaconData();
            this.getGatewayData();
            this.getTrackingData();
            this.setState({
                locale: locale.lang
            })
        }
    }

    componentDidMount = () => {
        this.getLbeaconData();
        this.getGatewayData();
        this.getTrackingData()
        this.getGatewayDataInterval = this.startSetInterval ? setInterval(this.getGatewayData, config.healthReport.pollGatewayTableIntevalTime) : null;
        this.getLbeaconDataInterval = this.startSetInterval ? setInterval(this.getLbeaconData, config.healthReport.pollLbeaconTabelIntevalTime) : null;
    }

    componentWillUnmount = () => {
        clearInterval(this.getGatewayDataInterval);
        clearInterval(this.getLbeaconDataInterval);
    }

    getLbeaconData = () => {
        let { locale } = this.context
        axios.post(dataSrc.getLbeaconTable, {
            locale: locale.abbr
        })
        .then(res => {
            let column = _.cloneDeep(lbeaconTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                lbeaconData: res.data.rows,
                lbeaconColumn: column
            })
        })
        .catch(err => {
            console.log("get lbeacon data fail : " + err);
        })
    }

    getGatewayData = () => {
        let { locale } = this.context
        axios.post(dataSrc.getGatewayTable, {
            locale: locale.abbr
        })
        .then(res => {
            let column = _.cloneDeep(gatewayTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                gatewayData: res.data.rows,
                gatewayColunm: column
            })
        })
        .catch(err => {
            console.log("get gateway data fail : " + err);
        })
    }

    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{areaId}] = stateReducer
        axios.post(dataSrc.getTrackingData,{
            rssiThreshold: config.surveillanceMap.locationAccuracyMapToDefault[config.objectManage.objectManagementRSSIThreshold],
            locale: locale.abbr,
            user: auth.user,
            areaId: areaId,
        })
        .then(res => {
            let column = _.cloneDeep(trackingTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.map(item => {
                item.status = locale.texts[item.status.toUpperCase()]
                item.transferred_location = item.transferred_location 
                    ? locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')]
                    : ''
            })
            this.setState({
                trackingData: res.data,
                trackingColunm: column
            })
        })
        .catch(err => {
            console.log("get tracking data fail : " + err);
        })
    }

    handleSubmitForm = () => {
        this.setState({
            isShowModal: false
        })
        setInterval(
            this.getLbeaconData()
            ,1000
        )
    }

    handleCloseForm = () => {
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

        const { locale } = this.context;

        return(
            <Container className='py-2 text-capitalize' fluid>
                <Nav
                    activeKey="/home"
                    onSelect={selectedKey => alert(`selected ${selectedKey}`)}
                >
                </Nav>
                <Tabs defaultActiveKey="lbeacon_table" transition={false} variant="pills" className='mb-1'>
                    <Tab 
                        eventKey="lbeacon_table" 
                        title="LBeacon" 
                    > 
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
                    <Tab 
                        eventKey="gateway_table" 
                        title="Gateway"
                    >
                        <ReactTable 
                            style={style.reactTable} 
                            data={this.state.gatewayData} 
                            columns={this.state.gatewayColunm}
                            defaultPageSize={15} 
                            resizable={true}
                            freezeWhenExpanded={false}
                        />
                    </Tab>
                    <Tab 
                        eventKey="tracking_table" 
                        title={locale.texts.TRACKING}
                    >
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
                    show= {this.state.isShowModal} 
                    title={'edit lbeacon'}
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmitForm={this.handleSubmitForm}
                    handleCloseForm={this.handleCloseForm}
                />
            </Container>
        )
    }
}

export default SystemStatus;