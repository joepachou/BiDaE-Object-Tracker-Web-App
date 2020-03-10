import React from 'react';
import { 
    Button, 
    ButtonToolbar,
    Row,
    Col 
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import EditObjectForm from '../container/EditObjectForm';
import BindForm from '../container/BindForm'
import DissociationForm from '../container/DissociationForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import Select from 'react-select';
import axios from 'axios';
import BOTInput from '../presentational/BOTInput'
import dataSrc from "../../dataSrc"

const SelectTable = selecTableHOC(ReactTable);

class ObjectTable extends React.Component{

    static contextType = AppContext

    state = {
        tabIndex:'', 
        isShowEdit:false,
        selectedRowData:'',
        selection: [],
        selectAll: false,
        isShowBind:false,
        showDeleteConfirmation:false,
        isShowEditImportTable:false,
        bindCase: 0,
        warningSelect : 0,
        selectAll: false, 
        formPath:'',
        formTitle:'',
        disableASN: false
    }

    handleClose = () => {
        this.setState({
            isShowBind:false,
            showDeleteConfirmation:false,
            isShowEditImportTable:false,
            isShowEdit:false,
            disableASN:false,
        })
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
           
        axios.post(dataSrc.deleteDevice, {
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

    handleSubmitForm = () => {
        this.setState({
            isShowEdit: false,
            showDeleteConfirmation: false,
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
            case "add object": 
                this.setState({
                    isShowEdit: true,
                    formTitle: name,
                    selectedRowData: [],
                    formPath: dataSrc.addObject,
                    disableASN:false
                })
                break;
            case "associate":
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                })
            break; 

            case "deleteObject":
                this.setState({
                     showDeleteConfirmation: true,
                     warningSelect : 1
                })
                break;
  
            case "dissociation":
                this.setState({
                    formTitle: name,
                    isShowEditImportTable: true
                })
                break; 
        }

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
                        name="associate"
                        size="sm"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.ASSOCIATE}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        name="add object"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.ADD_OBJECT}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        name="dissociation"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.DISSOCIATE}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        size="sm"
                        name="deleteObject"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.MULTIPLEDELETE}
                    </Button>
                    <div style={{width: '200px'}}>
                        
                    </div>
                    
                </ButtonToolbar>

                            
                <Row className="my-1" noGutters>
                    <Col>
                        <Select
                            name="Select Type"
                            className="float-right w-100"
                            styles={styleConfig.reactSelect}
                            onChange={(value) => { 
                                if(value){
                                    this.props.addObjectFilter(value.label, ['type'], 'type select' )
                                }else{
                                    this.props.removeObjectFilter('type select')
                                }
                            }}
                            options={this.props.typeSelection}
                            isClearable={true}
                            isSearchable={false}
                            placeholder={locale.texts.SELECT_TYPE}
                            
                        />
                    </Col>
                    <Col>
                        <Select
                            name="Select Area"
                            className='float-right w-100'
                            styles={styleConfig.reactSelect}
                            onChange={(value) => {
                                if(value){
                                    this.props.addObjectFilter(value.label, ['area'], 'area select')
                                }else{
                                    this.props.removeObjectFilter('area select')
                                }
                            }}
                            options={this.props.filterSelection.areaSelection}
                            isClearable={true}
                            isSearchable={false}
                            placeholder={locale.texts.SELECT_AREA}
                        />
                    </Col>
                    <Col>
                        <Select
                            name="Select Status"
                            className='float-right w-100'
                            styles={styleConfig.reactSelect}
                            onChange={(value) => {
                                if(value){
                                    this.props.addObjectFilter(value.label, ['status'], 'status select')
                                }else{
                                    this.props.removeObjectFilter('status select')
                                }
                            }}
                            options={this.props.filterSelection.statusOptions}
                            isClearable={true}
                            isSearchable={false}
                            placeholder={locale.texts.SELECT_STATUS}
                        />
                    </Col>
                    <Col>
                        <BOTInput
                            className='float-right'
                            placeholder={locale.texts.TYPE_SEARCH_KEYWORD}
                            getSearchKey={(key) => {
                                this.props.addObjectFilter(
                                    key, 
                                    ['name', 'type', 'area', 'status', 'macAddress', 'acn'], 
                                    'search bar',
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
                                    isShowEdit:true,
                                    selectedRowData: this.props.data[rowInfo.index],
                                    formTitle: 'edit object',
                                    formPath: dataSrc.editObject,
                                    disableASN:true
                                })
                                } 
                            },
                        }
                    }} 
                />
                <EditObjectForm 
                    show={this.state.isShowEdit} 
                    title={this.state.formTitle} 
                    selectedRowData={selectedRowData || ''} 
                    handleSubmitForm={this.handleSubmitForm}
                    handleClose={this.handleClose}
                    formPath={this.state.formPath}
                    data={this.props.data}
                    importData={this.props.importData}
                    objectTable={this.props.objectTable}
                    disableASN = {this.state.disableASN  }
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
                    formPath={'xx'}
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
                        this.state.warningSelect == 1 ?  this.objectMultipleDelete :null
                    }
                />
            </div>

        )
    }
}
export default ObjectTable
