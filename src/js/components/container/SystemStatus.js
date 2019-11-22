/** React Library */
import React from 'react';

/** Import Components */
import { Row, Col, Container,  Nav, Button, ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './EditLbeaconForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import dataSrc from '../../dataSrc';
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
import {Tabs, Tab,TabList, TabPanel } from 'react-tabs';
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
        isShowModal: false,
        toggleAllFlag:0,
        tabIndex:0,
        locale: this.context.locale.lang,
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
        setTimeout(this.getLbeaconData(), 500) 
        setTimeout(this.getGatewayData(), 500) 
        this.setState({
            isShowModal: false
        })
    }

    handleCloseForm = () => {
        this.setState({
            isShowModal: false
        })
    }
    




            //  selectTable

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
            };

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
                // console.log('toggleAllFlag:    '  + this.state.tabIndex )
                //     const wrappedInstance = this.selectTable.getWrappedInstance();
                //     const currentRecords = wrappedInstance.getResolvedState().sortedData;
                //      console.log(currentRecords)
                //     currentRecords.forEach(item => {
                //         selection.push(item._original.id);
                //     });

                   
                }

                this.setState({ selectAll, selection });
                

            };

            isSelected = (key) => {

                return this.state.selection.includes(key);
            };

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
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })

                    this.handleSubmitForm()

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
        const { isShowEdit, selectedRowData,selectedRowData_Patient,isPatientShowEdit } = this.state
    

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
                <Tabs defaultActiveKey="lbeacon_table" transition={false} variant="pills" onSelect=
                {tabIndex => this.setState({ tabIndex })} className='mb-1'>


                <TabList>
                <Tab>{'LBeacon'}</Tab>
                <Tab>{'Gateway'}</Tab>
                <Tab>{locale.texts.TRACKING}</Tab>
                </TabList>

                <TabPanel>
                <ButtonToolbar>
                <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize mr-2'
                        onClick={this.deleteRecord}
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
                                            isShowModal: true,
                                        })
                                        let id = (rowInfo.index+1).toString()
                                        this.toggleSelection(id)
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                     }
                            }
                        }
                        }
                    />
                </TabPanel> 


                <TabPanel>
                <ButtonToolbar>
                <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize mr-2'
                        onClick={this.deleteRecordGateway}
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
                                            // let id = (rowInfo.index+1).toString()
                                            // this.toggleSelection(id)
                                            if (handleOriginal) {
                                                handleOriginal()
                                            }
                                        }
                                }
                            }
                            }
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




{/* 
                    <TabPanel>

                    </TabPanel> */}
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