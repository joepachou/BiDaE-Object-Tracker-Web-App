import React from 'react';
import { Form, Button,Container,   ButtonToolbar,Row,Col } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import EditObjectForm from '../container/EditObjectForm';
import BindForm from '../container/BindForm'
import DissociationForm from '../container/DissociationForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import Select from 'react-select';
import config from '../../config'
import BOTInput from '../presentational/BOTInput'
import axios from 'axios';
import EditPatientForm from '../container/EditPatientForm'
import { 
    editPatient,
    addPatient,
    deletePatient,
    deleteDevice,
} from "../../dataSrc"
const SelectTable = selecTableHOC(ReactTable);


class PatientTable extends React.Component{
    
    static contextType = AppContext
    
    state = {
        isShowBind:false,
        isPatientShowEdit:false,
        showDeleteConfirmation:false,
        selectedRowData:'',
        selectAll: false,
        selection: [],
        formPath:'',
        formTitle:'',
        disableASN: false,
    }

    handleClose = () => {
        this.setState({
            isShowBind:false,
            isPatientShowEdit:false,
            showDeleteConfirmation:false,
            selectedRowData:'',
            disableASN:false,
        })
    }

    handleClick = (e) => {
        this.setState({
            disableASN:false,
            isPatientShowEdit:true,
            formTitle: 'add inpatient',
            formPath: addPatient,
        })
    }

    handleSubmitForm = () => {
        this.setState({
            isPatientShowEdit:false,
            showDeleteConfirmation:false,
            disableASN:false,
        })
        this.props.refreshData()
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
        let selection = [];
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.props.data
 
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item => {
                selection.push(item.id);
            });
        }else{
            selection = [];
        }
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };


    handleClickButton = (e) => {

        let { name } = e.target
        switch(name) {
            case "associate_patient":
                this.setState({
                    isShowBind: true,
                    bindCase: 2,
                })
            break;
            case "deletePatient":
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect : 0,
                })
            break;
        }

    }

    objectMultipleDelete = () => {
        let formOption = []
        var deleteArray = [];
        var deleteCount = 0;
 
        this.props.data.map (item => {
         
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
         
            this.props.data[item] === undefined ?
                null
                :
                formOption.push(this.props.data[item].mac_address)
            })
           
        axios.post(deleteDevice, {
            formOption
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
        const {  
            selectedRowData,
            selectAll,
            selectType,
        } = this.state

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
       
        const { locale } = this.context 
        return(
            <div> 
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        name="associate_patient"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.ASSOCIATE}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        onClick={this.handleClick}
                    >
                        {locale.texts.ADD_INPATIENT}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        name="deletePatient"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.DELETE}
                    </Button>
                </ButtonToolbar>
                <Row className="my-1" noGutters> 
                    <Col>
                        <Select
                            name={"Select Area Patient"}
                            className={'float-right w-100'}
                            styles={styleConfig.reactSelect}
                            onChange={(value) => {
                                if(value){
                                    this.props.addPatientFilter(value.label, ['area'], 'area select')
                                }else{
                                    this.props.removePatientFilter('area select')
                                }
                            }}
                            options={this.props.filterSelection.areaSelection}
                            isClearable={true}
                            isSearchable={false}
                            placeholder={'Select Area'}
                        />
                    </Col> 
                    <Col>
                        <Select
                            name={"Select Status"}
                            className={'float-right w-100'}
                            styles={styleConfig.reactSelect}
                            onChange={(value) => {
                                if(value){
                                    this.props.addPatientFilter(value.label, ['monitor'], 'monitor select')
                                }else{
                                    this.props.removePatientFilter('monitor select')
                                }
                            }}
                            options={this.props.filterSelection.monitorTypeOptions}
                            isClearable={true}
                            isSearchable={false}
                            placeholder={'Monitor Status'}
                        />
                    </Col>
                    <Col>
                        <BOTInput
                            className={'float-right'}
                            placeholder={''}
                            getSearchKey={(key) => {
                                this.props.addPatientFilter(
                                    key, 
                                    ['name', 'area' , 'macAddress', 'acn','monitor','physician_name'], 
                                    'search bar'
                                )
                            }}
                            clearSearchResult={null}                                        
                        />
                    </Col>
                </Row>
                
                <SelectTable
                    keyField='id'
                    data={this.props.data}
                    columns={this.props.columns}
                    ref={r => (this.selectTable = r)}
                    className="-highlight"
                    name={'obj_table'}
                    style={{height:'75vh'}}
                    {...extraProps}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => { 
                                if (!e.target.type) { 
                                    this.setState({
                                    isPatientShowEdit:true,
                                    selectedRowData: this.props.data[rowInfo.index],
                                    formTitle: 'edit patient',
                                    disableASN: true,
                                    formPath: editPatient,
                                })
                                } 
                            },
                        }
                    }} 
                />

                <EditPatientForm
                    show = {this.state.isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedRowData={selectedRowData  || ''} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.props.data}
                    objectData = {this.props.objectTable}
                    physicianList={this.props.physicianList}
                    roomOptions={this.props.roomOptions}
                    disableASN = {this.state.disableASN}
                />  
 
                <BindForm
                    show = {this.state.isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.props.objectTable}
                    ImportData= {this.props.importData}
                    PatientImportData = {this.props.dataImportPatient}
                    data={this.props.importData.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item 
                        return dataMap
                        }, {})
                    }
                />
                <DissociationForm
                    show={this.state.isShowEditImportTable} 
                    title={this.state.formTitle} 
                    selectedRowData={this.state.selectedRowData || 'handleAllDelete'} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    objectTable={this.props.objectTable}
                    handleClose={this.handleClose}
                    data={this.props.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                        }, {})
                    }
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={
             
                    this.state.warningSelect == 0 ?  this.objectMultipleDelete :null
              
                    }
                />
            </div>

        )
    }
}
export default PatientTable
