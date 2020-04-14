import React from 'react';
import { 
    Button, 
    ButtonToolbar,
    Row,
    Col 
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../config/styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import BindForm from '../container/BindForm'
import DissociationForm from '../container/DissociationForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import Select from 'react-select';
import BOTInput from '../presentational/BOTInput'
import axios from 'axios';
import EditPatientForm from '../container/EditPatientForm'
import { 
    editPatient,
    addPatient,
    deleteDevice,
} from "../../dataSrc"
import {
    LoaderWrapper, 
    PrimaryButton
} from '../../config/styleComponent'
import ReactLoading from "react-loading"; 
import styled from 'styled-components'
import messageGenerator from '../../helper/messageGenerator'
const SelectTable = selecTableHOC(ReactTable);
import AccessControl from './AccessControl'


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
        done:false,
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
        let callback = () => messageGenerator.setSuccessMessage(
            'save success'
        )
        this.setState({
            isPatientShowEdit:false,
            showDeleteConfirmation:false,
            disableASN:false,
        }, callback) 
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
        let rowsCount = 0 ; 
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.props.data
 
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item.id)
                } 
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

        const Loader = () => {
            return ( 
                <LoaderWrapper>
                    <ReactLoading type={"bars"} color={"black"}  /> 
                </LoaderWrapper>
            ) 
        }
        const aLoader = () => {
            return ( 
                    null
            ) 
        }
        const { locale } = this.context 
        return(
            <div> 
                <div className="d-flex justify-content-between">
                    <Row noGutters> 
                        <Col>
                            <BOTInput
                                className={'float-right'}
                                placeholder={locale.texts.SEARCH}
                                getSearchKey={(key) => {
                                    this.props.addPatientFilter(
                                        key, 
                                        ['name', 'area', 'macAddress', 'acn', 'monitor', 'physician_name'], 
                                        'search bar'
                                    )
                                }}
                                clearSearchResult={null}                                        
                            />
                        </Col>
                        <AccessControl
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Col>
                                <Select
                                    name="Select Area Patient"
                                    className='float-right w-100'
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
                                    placeholder={locale.texts.SELECT_AREA}
                                    styles={styleConfig.reactSelectSearch}
                                />
                            </Col> 
                            <Col>
                                <Select
                                    name="Select Status"
                                    className='float-right w-100'
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
                                    placeholder={locale.texts.SELECT_MONITOR_TYPE}
                                    styles={styleConfig.reactSelectSearch}
                                />
                            </Col>
                        </AccessControl>
                    </Row>
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                name="associate_patient"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ASSOCIATE}
                            </PrimaryButton>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                onClick={this.handleClick}
                            >
                                {locale.texts.ADD_INPATIENT}
                            </PrimaryButton>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                name="deletePatient"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>

                <SelectTable
                    keyField='id'
                    data={this.props.data}
                    columns={this.props.columns}
                    ref={r => (this.selectTable = r)}
                    className="-highlight text-none"
                    style={{maxHeight:'75vh'}} 
                    noDataText={this.props.loadingFlag ? '' :'No rows found'} 
                    LoadingComponent={this.props.loadingFlag? Loader :aLoader}
                    onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    {...extraProps}
                    {...styleConfig.reactTable}
                    pageSize={this.props.data.length}

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
                    areaTable={this.props.areaTable}
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
                    areaTable={this.props.areaTable}
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
                    refreshData={this.props.refreshData}  
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
