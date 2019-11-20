import React from 'react';

/** Import Presentational Component */
import { 
    getAreaTable,
    getObjectTable,
    getPatientTable,
    editObject,
    editPatient,
    addObject,
    addPatient,
    deletePatient,
    deleteDevice,
} from "../../dataSrc"
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container,ButtonToolbar} from 'react-bootstrap';
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
        deleteFlag:0
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
            item.object_type = locale.texts.genderSelect[item.object_type]
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
                    label: locale.texts[item.status.toUpperCase()],
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
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
          
            currentRecords.forEach(item => {

                selection.push(item.name);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };




    deleteRecordPatient = () => {
        let idPackage = []


        var deleteArray = [];
        var deleteCount = 0;

        this.state.dataPatient.map (item => {
         
            this.state.selection.map(itemSelect => {
                itemSelect === item.name
                ? 
                 deleteArray.push(deleteCount.toString())
                : 
                null          
            })
                 deleteCount +=1
        })

         
        deleteArray.map( item => {
        this.state.dataPatient[item] === undefined ?
              null
            :
            idPackage.push(parseInt(this.state.dataPatient[item].id))
        })
        console.log(idPackage)
        axios.post(deletePatient, {
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





    deleteRecordDevice = () => {
        let idPackage = []
   

        var deleteArray = [];
        var deleteCount = 0;

        this.state.data.map (item => {
         
            this.state.selection.map(itemSelect => {
                
                itemSelect === item.name
                ? 
                 deleteArray.push(deleteCount.toString()) 
                : 
                null          
            })
                 deleteCount +=1
        })

        
        deleteArray.map( item => {
        this.state.data[item] === undefined ?
              null
            :
            idPackage.push(parseInt(this.state.data[item].id))
        })

        axios.post(deleteDevice, {
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
































    handlePatientClick = (e) => {
        this.setState({
            isPatientShowEdit: true, 
            selectedRowData: [],
            selectedRowData_Patient:[],
            formTitle: 'add inpatient',
            formPath: addPatient
        })
    }

    handleDelectDevice = (e) => {
        this.setState({
        
        })
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

             









                <br/>


                {/* tabs */}
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                <TabList>
                <Tab>{locale.texts.DEVICE_FORM}</Tab>
                <Tab>{locale.texts.PATIENT_FORM}</Tab>
                </TabList>

                <TabPanel> 


               

                    <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize mr-2'
                        onClick={this.handleClickButton}
                    >
                         {locale.texts.ADD_OBJECT}
                         
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        onClick={this.deleteRecordDevice}    
                    >
                        {locale.texts.DELECT_DEVICE}
                    </Button>
                </ButtonToolbar>
                <SelectTable
                        keyField='name'
                        data={this.state.data}
                        columns={this.state.column}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        style={{height:'75vh'}}
                        {...extraProps}
                        getTrProps={(state, rowInfo, column, instance) => {
                           
                            return {
                                onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData: this.state.data[rowInfo.index],
                                             isShowEdit: true,
                                             isPatientShowEdit: false,
                                             formTitle: 'edit object',
                                             formPath: editObject,
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
                        onClick={this.handlePatientClick}
                    >
                         {locale.texts.ADD_INPATIENT}
                         
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='mb-1 text-capitalize'
                        onClick={this.deleteRecordPatient}    
                    >
                        {locale.texts.DELETE}
                    </Button>
                </ButtonToolbar>

                <SelectTable
                        keyField='name'
                        data={this.state.dataPatient}
                        columns={this.state.columnPatient}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        style={{height:'75vh'}}
                        {...extraProps}
                        getTrProps={(state, rowInfo, column, instance) => {
                           
                            return {
                                onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedRowData_Patient: this.state.dataPatient[rowInfo.index],
                                             isShowEdit: false,
                                             isPatientShowEdit: true,
                                             formTitle: 'edit patient',
                                             formPath: editPatient,
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
                </Tabs>

                <EditPatientForm
                    show = {isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Patient || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.dataPatient}
                    objectData = {this.state.data}
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
                    dataPatient = {this.state.dataPatient}
                    areaList={this.state.areaList}
                />  

             



               {/*  isShowEdit = true 才會進表單 */}

               
                <Row className='d-flex w-100 justify-content-around'>
                    <Col className='py-2'>

                        <br/>
                    
                    </Col>
                </Row>            
            </Container>
                    
        )
    }
}

ObjectManagementContainer.contextType = LocaleContext
export default ObjectManagementContainer
