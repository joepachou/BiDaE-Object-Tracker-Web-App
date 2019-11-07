import React from 'react';

/** Import Presentational Component */
import { 
    getAreaTable,
    getObjectTable,
    getPatientTable,
    editObject,
    editPatient,
    addObject,
    addPatient
} from "../../dataSrc"
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'
import LocaleContext from '../../context/LocaleContext.js';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import config from '../../config'
import { objectTableColumn } from '../../tables'
import { patientTableColumn } from '../../tables'
import EditPatientForm from './EditPatientForm'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const SelectTable = selecTableHOC(ReactTable);

class ObjectManagementContainer extends React.Component{
    state = {
        column:[],
        columnPatient:[],
        data:[],
        dataPatient:[],
        isShowEdit: false,
        isPatientShowEdit: false,
        selection: [],
        selectedRowData: [],
        selectedRowData_Patient: [],
        areaList: [],
        formTitle:'',
        formPath: '',
        selectAll: false,
        locale: this.context.abbr,
        tabIndex:0,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.abbr !== prevState.locale) {
            this.getData()
            this.getDataPatient()
            this.setState({
                locale: this.context.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getData();
        this.getDataPatient();
        this.getAreaList();
    }

    getAreaList = () => {
        axios.post(getAreaTable, {
        })
        .then(res => {
            this.setState({
                areaList: res.data.rows
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    getDataPatient = () => {
        let locale = this.context

        axios.post(getPatientTable, {
            locale: locale.abbr
        })
        .then(res => {
        let columnPatient = _.cloneDeep(patientTableColumn)
        columnPatient.map(field => {
            field.headerStyle = {
                textAlign: 'left',
            }
            field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
        })
        


        res.data.rows.map(item => {
            item.area_name = {
                value: config.mapConfig.areaOptions[item.area_id],
                label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
            }
        })
        



        this.setState({
            dataPatient: res.data.rows,
            columnPatient: columnPatient,
        })
        })
        .catch(err => {
            console.log(err);
        })
      
    }


    
    getData = () => {
        let locale = this.context
        axios.post(getObjectTable, {
            locale: locale.abbr
        })
        .then(res => {
            let column = _.cloneDeep(objectTableColumn)
            
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.rows.map(item => {
                let checkboxGroup = []
                Object.keys(config.monitorType).map(index => {
                    if (item.monitor_type & index) {
                        checkboxGroup.push(config.monitorType[index])
                    }
                })
                item.monitor_type = checkboxGroup.join(',')
                item.status = {
                    value: item.status,
                    // label: locale.texts[item.status.toUpperCase()],
                    label: locale.texts[item.status],
                }
                item.transferred_location = item.transferred_location 
                    ? {
                        value: item.transferred_location,
                        label: locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')],
                        label: item.transferred_location.toUpperCase().split(',').map(item => {
                            return locale.texts[item]
                        }).join()
                    }
                    : ''
                item.area_name = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                }
            })
            
            this.setState({
                data: res.data.rows,
                column: column,
            })
        })
        .catch(err => {
            console.log(err);
        })
    }









    handleModalForm = () => {
        this.setState({
            isShowEdit: true,
            isPatientShowEdit: true,
        })
    }

    handleCloseForm = () => {
        this.setState({
            isShowEdit: false,
            isPatientShowEdit: false,
        })
    }

    handleClickButton = (e) => {
        this.setState({
            isShowEdit: true,
            formTitle: 'add object',
            selectedRowData: [],
            selectedRowData_Patient:[],
            formPath: addObject
        })
    }

    handleSubmitForm = () => {
        setTimeout(this.getData, 500) 
        setTimeout(this.getDataPatient, 500) 
        this.setState({
            isShowEdit: false,
            isPatientShowEdit: false,
        })
    }

    toggleSelection = (key, shift, row) => {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state

        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ 
            selection 
        });

    };

    toggleAll = () => {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.selectTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                if (item._original) {
                selection.push(item._original.id);
                }
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = (key) => {
        /*
            Instead of passing our external selection state we provide an 'isSelected'
            callback and detect the selection state ourselves. This allows any implementation
            for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    handlePatientClick = (e) => {
        this.setState({
            isPatientShowEdit: true, 
            selectedRowData: [],
            selectedRowData_Patient:[],
            formTitle: 'add inpatient',
            formPath: addPatient
        })
    }


    keyUpHandler(refName, e) {
        console.log('123135');
        // prints either LoginInput or PwdInput
    }

    render(){
        const { isShowEdit, selectedRowData,selectedRowData_Patient,isPatientShowEdit } = this.state
        const locale = this.context

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





        return (
            <Container className='py-2 text-capitalize' fluid>

                <Row>
                    <Col>
                        <Button variant='primary' className='text-capitalize' onClick={this.handleClickButton}>
                            {locale.texts.ADD_OBJECT}
                        </Button>
                        {'     '}
                    {/* 新增病人 */}
                        <Button variant='primary' className='text-capitalize' onClick={this.handlePatientClick}>
                            {locale.texts.ADD_INPATIENT}
                        </Button>
                    </Col>
                </Row>

                <br/>




                {/* tabs */}
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                <TabList>
                <Tab>{locale.texts.DEVICE_FORM}</Tab>
                <Tab>{locale.texts.PATIENT_FORM}</Tab>
                </TabList>

                <TabPanel> 
                <ReactTable 
          
                            data = {this.state.data} 
                            columns = {this.state.column} 
                            noDataText="No Data Available"
                            className="-highlight"
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: this.state.data[rowInfo.index],
                                            isShowEdit: true,
                                            isPatientShowEdit: false,
                                            formTitle: 'edit object',
                                            formPath: editObject
                                        })
                                console.log(e)
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
                </TabPanel>
                <TabPanel>
               
                <ReactTable 
                            data = {this.state.dataPatient} 
                            columns = {this.state.columnPatient} 
                            noDataText="No Data Available"
                            className="-highlight"
                           
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                               
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData_Patient: this.state.dataPatient[rowInfo.index],
                                             isShowEdit: false,
                                             isPatientShowEdit: true,
                                             formTitle: 'edit patient',
                                             formPath: editPatient
                                        })
                                        this.keyUpHandler()

                                        if (handleOriginal) {
                                            handleOriginal()
                                        }
                                     }
                              }
                            }}
                        />
                </TabPanel>
                </Tabs>

                <EditPatientForm
                    show = {isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Patient || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.dataPatient}
                    areaList={this.state.areaList}
                />  

                <EditObjectForm 
                    show = {isShowEdit} 
                    title= {this.state.formTitle} 
                    selectedObjectData={selectedRowData || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.data}
                    areaList={this.state.areaList}
                />  

             



               {/*  isShowEdit = true 才會進表單 */}

               
                <Row className='d-flex w-100 justify-content-around'>
                    <Col className='py-2'>

                        <br/>
                        


                        {/* <SelectTable
                            keyField='id'
                            data={this.state.data}
                            columns={this.state.column}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            defaultPageSize={15} 

                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        let id = rowInfo.original.id
                                        this.toggleSelection(id)
                                
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
                        /> */}
                    </Col>
                </Row>            
            </Container>
                    
        )
    }
}

ObjectManagementContainer.contextType = LocaleContext
export default ObjectManagementContainer
