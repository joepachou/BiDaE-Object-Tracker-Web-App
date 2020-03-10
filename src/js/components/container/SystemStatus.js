import React from 'react';
import { 
    Container
} from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { AppContext } from '../../context/AppContext';
import {
    Tabs, 
    Tab,
    TabList, 
    TabPanel 
} from 'react-tabs';
import {
    trackingTableColumn
} from '../../tables'
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import { toast } from 'react-toastify';
import LBeaconTable from './LBeaconTable'
import GatewayTable from './GatewayTable' 
 

class SystemStatus extends React.Component{
    static contextType = AppContext

    state = {
        trackingData: [],
        trackingColunm: [],
        tabIndex: 0,
        locale: this.context.locale.lang,
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.lang !== prevState.locale) {
            this.getTrackingData();
            this.setState({
                locale: locale.lang
            })
        }
    }

    componentDidMount = () => {
        this.getTrackingData()
    }

    componentWillUnmount = () => {
        toast.dismiss(this.toastId)
    }


    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
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
                item.transferred_location = ''
                // item.transferred_location 
                //     ? locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')]
                //     : ''
            })
            this.setErrorMessage(false)
            this.setState({
                trackingData: res.data,
                trackingColunm: column
            })
        })
        .catch(err => {
            this.setErrorMessage(true)
            console.log(`get tracking data failed ${err}`);
        })
    }

    setErrorMessage = (isSetting) => {
        const {
            locale
        } = this.context
        if (isSetting && !this.toastId) {
            this.toastId = toast(locale.texts.CONNECT_TO_DATABASE_FAILED, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                className: 'toast-error-notice-container',
                bodyClassName: "toast-notice-body",
                hideProgressBar: true,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
            });
        } else if (!isSetting) {
            this.toastId = null;
        }
    }

    setMessage = (type, msg, isSet) => {
        const {
            locale
        } = this.context
        switch(type) {
            case "success": 
            toast.success(locale.texts[msg.toUpperCase().replace(/ /g, '_')], {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                className: 'toast-success-notice-container',
                bodyClassName: "toast-notice-body",
                hideProgressBar: true,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
            });
        }

    }

    render(){
        const { locale } = this.context;    

        return(
            <Container className='py-2 text-capitalize' fluid>
                <br/>
                <Tabs 
                    variant="pills" 
                    onSelect={tabIndex => {
                        if (!this.toastId) {
                            toast.dismiss(this.toastId)
                        }
                        this.setState({ 
                            tabIndex 
                        })
                    }} 
                    className='mb-1'
                >
                    <TabList>
                        <Tab>{'LBeacon'}</Tab>
                        <Tab>{'Gateway'}</Tab>
                        <Tab>{locale.texts.TRACKING}</Tab> 
                    </TabList>
                    <TabPanel>
                        <LBeaconTable
                            lbeaconData = {this.state.lbeaconData}
                            lbeaconColumn = {this.state.lbeaconColumn}
                            refreshData  = {this.refreshData}
                            setErrorMessage={this.setErrorMessage}
                            setMessage={this.setMessage}
                        /> 
                    </TabPanel> 
                    <TabPanel>
                        <GatewayTable
                            gatewayData = {this.state.gatewayData}
                            gatewayColunm = {this.state.gatewayColunm}
                            refreshData  = {this.refreshData}
                            setErrorMessage={this.setErrorMessage}
                            setMessage={this.setMessage}
                        /> 
                    </TabPanel> 
                    <TabPanel>
                        <ReactTable 
                            minRows={6} 
                            defaultPageSize={15} 
                            data={this.state.trackingData} 
                            columns={this.state.trackingColunm} 
                            pageSizeOptions={[5, 10]}
                            resizable={true}
                            freezeWhenExpanded={false}
                        />
                    </TabPanel> 
                </Tabs>
                {/* <EditLbeaconForm 
                    show= {this.state.showEdit} 
                    title={'edit lbeacon'}
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmit={this.handleSubmitForm}
                    handleClose={this.handleClose}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmitDeleteConfirmForm}
                /> */}
            </Container>
        )
    }
}

export default SystemStatus;