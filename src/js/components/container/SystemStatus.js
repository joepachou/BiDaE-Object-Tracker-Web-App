import React from 'react';
import { Container,  Nav, Button, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './../presentational/EditLbeaconForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import config from '../../config';
import { 
    deleteLBeacon,
    deleteGateway
} from "../../dataSrc"
import { 
    trackingTableColumn,
    lbeaconTableColumn,
    gatewayTableColumn
} from '../../tables';
import { AppContext } from '../../context/AppContext';
import {
    Tabs, 
    Tab,
    TabList, 
    TabPanel 
} from 'react-tabs';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import { toast } from 'react-toastify';
import LBeaconTable from './LBeaconTable'
import GatewayTable from './GatewayTable' 
 
const SelectTable = selecTableHOC(ReactTable);

class SystemStatus extends React.Component{
    static contextType = AppContext

    state = {
        lbeaconData: [],
        lbeaconColumn: [],
        gatewayData: [],
        gatewayColunm: [],
        trackingData: [],
        trackingColunm: [],
        selection: [],
        selectedRowData: {},
        showEdit: false,
        showDeleteConfirmation: false,
        toggleAllFlag:0,
        tabIndex:0,
        locale: this.context.locale.lang,
        selectedData: null,
        deleteObjectType: null
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
        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
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
            console.log(`get lbeacon data failed ${err}`);
        })

    }

    getGatewayData = () => {
        let { locale } = this.context
        retrieveDataHelper.getGatewayTable(
            locale.abbr
        )
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
            console.log(`get gateway data failed ${err}`);
        })
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
            this.setState({
                trackingData: res.data,
                trackingColunm: column
            })
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`);
        })
    }
     
    
    refreshData = () => {  
        setTimeout(this.getTrackingData, 500) 
        setTimeout(this.getGatewayData, 500) 
        setTimeout( this.getLbeaconData, 500)  
    }


    handleSubmitDeleteConfirmForm  = (pack) => {
        if (this.state.deleteObjectType == 'lbeacon'){
            this.deleteRecord()
        } else if (this.state.deleteObjectType == 'gateway'){
            this.deleteRecordGateway()
        }
    }

    handleSubmitForm = () => {
        toast.success("Edit LBeacon or Gateway Success", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            hideProgressBar: true
        });
        setTimeout(this.getLbeaconData(), 500) 
        setTimeout(this.getGatewayData(), 500) 

        this.setState({
            showEdit: false
        })
    }

    handleClose = () => {
        this.setState({
            showEdit: false,
            showDeleteConfirmation: false,
            selectedData: null,
        })
    }

    toggleSelection = (key, shift, row) => {
        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);

        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ 
            selection 
        });
    }

    toggleAll = () => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {

            if(this.state.tabIndex == '0')
            {
            this.state.lbeaconData.map (item => {
                selection.push(item.id);
            })

            }else if (this.state.tabIndex == '1') {
               this.state.gatewayData.map (item => {
                    selection.push(item.id);
                })
            }
        }
        this.setState({ selectAll, selection });
    }

    isSelected = (key) => {
        return this.state.selection.includes(key);
    }

    deleteRecord = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
        this.state.lbeaconData.map (item => {
        
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ? 
                deleteArray.push(deleteCount.toString())
                : 
                null          
            })
                deleteCount +=1
        })

        deleteArray.map( item => {
            this.state.lbeaconData[item] === undefined ?
                null
                :
                idPackage.push(parseInt(this.state.lbeaconData[item].id))
            })
            axios.post(deleteLBeacon, {
                idPackage
            })
            .then(res => {
                this.setState({
                    selection: [],
                    selectAll: false,
                    showDeleteConfirmation: false
                })
            })
            .catch(err => {
                console.log(err)
            })
            this.handleSubmitForm()
    }

    deleteRecordGateway = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
        this.state.gatewayData.map (item => {
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ? 
                deleteArray.push(deleteCount.toString())
                : 
                null          
            })
                deleteCount +=1
        })

        deleteArray.map( item => {
            this.state.gatewayData[item] === undefined ?
                null
                :
                idPackage.push(parseInt(this.state.gatewayData[item].id))
            })


            axios.post(deleteGateway, {
                idPackage
            })
            .then(res => {
                this.setState({
                    selection: [],
                    selectAll: false,
                    showDeleteConfirmation: false
                })
            })
            .catch(err => {
                console.log(err)
            })

            this.handleSubmitForm()
    }

    render(){
        const { locale } = this.context;    
        const { selectAll, selectType } = this.state;
        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        }; 
        return(
            <Container className='py-2 text-capitalize' fluid>
         
                <br/>
 
                <Nav
                    activeKey="/home"
                    onSelect={selectedKey => alert(`selected ${selectedKey}`)}
                >
                </Nav>
                <Tabs 
                    variant="pills" 
                    onSelect={tabIndex => this.setState({ tabIndex })} 
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
                        /> 
                    </TabPanel> 

                    <TabPanel>
                        <GatewayTable
                            gatewayData = {this.state.gatewayData}
                            gatewayColunm = {this.state.gatewayColunm}
                            refreshData  = {this.refreshData}
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


                    {/* <TabPanel>
                        <ButtonToolbar>
                            <Button 
                                variant="outline-primary" 
                                className='mb-1 text-capitalize mr-2'
                                onClick={() => {
                                    this.setState({
                                        deleteObjectType: 'lbeacon',
                                        showDeleteConfirmation: true
                                    })
                                }}
                            >
                                {locale.texts.DELECT_LBEACON}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.state.lbeaconData}
                            columns={this.state.lbeaconColumn}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                            showEdit: true,
                                        })
                                    }
                                }
                            }}
                        />
                    </TabPanel> 
                    <TabPanel>
                        <ButtonToolbar>
                            <Button 
                                variant="outline-primary" 
                                className='mb-1 text-capitalize mr-2'
                                onClick={() => {
                                    this.setState({
                                        deleteObjectType: 'gateway',
                                        showDeleteConfirmation: true
                                    })
                                }}
                            >
                                {locale.texts.DELECT_GATEWAY}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.state.gatewayData} 
                            columns={this.state.gatewayColunm}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: rowInfo.original,
                                        })
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                    }
                                }
                            }}
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
                    </TabPanel> */}


                </Tabs>
                <EditLbeaconForm 
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
                />
            </Container>
        )
    }
}

export default SystemStatus;