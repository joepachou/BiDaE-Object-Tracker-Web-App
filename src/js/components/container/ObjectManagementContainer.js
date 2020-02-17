import React from 'react';
import { 
    getObjectTable,
    editObject,
    editPatient,
    addObject,
    addPatient,
    deletePatient,
    deleteDevice,
    getUserList,
    getLbeaconTable,
    objectImport,
    getImportTable,
    deleteImportData,
    cleanBinding,
    getImportPatient,
    getTransferredLocation
} from "../../dataSrc"
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { 
    Button, 
    Container,
    ButtonToolbar,
} from 'react-bootstrap';
import { 
    objectTableColumn,
    patientTableColumn,
    importTableColumn
 } from '../../tables'
import EditObjectForm from './EditObjectForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import config from '../../config'
import EditPatientForm from './EditPatientForm'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../context/AppContext';
import XLSX from "xlsx";
import InputFiles from "react-input-files";
import BindForm from './BindForm'
import DissociationForm from './DissociationForm'
import AccessControl from '../presentational/AccessControl'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'

const SelectTable = selecTableHOC(ReactTable);


class ObjectManagementContainer extends React.Component{
    static contextType = AppContext
    
    state = {
        column:[], //設備列表的欄位設定
        columnImport:[],//匯入的欄位設定
        columnPatient:[],//病人列表的欄位設定
        data:[],//object data
        dataImport: [],//object import data
        dataPatient:[],//patient data
        dataImportPatient:[],// patient import data
        objectTable: [],//ＤＢ抓出來的object table data
        isShowEdit: false, //點資料後的編輯視窗 object
        isPatientShowEdit: false, //點資料後的編輯視窗 patient
        selection: [], //存勾選的資料
        selectedRowData: [], // onclick的資料
        selectedRowData_Patient: [], // onclick的資料
        formTitle: '', //表單的標題
        formPath: '',
        selectAll: false,
        locale: this.context.locale.abbr,
        tabIndex: 0, 
        roomOptions: {},
        isShowBind:false,
        isShowEditImportTable:false, //DissociationForm的show
        bindCase:0, // １是Object 2是Patient
        physicianName:'',//存onclick後的醫生資料
        physicianIDNumber:0,//存onclick後的醫生ID
        disableASN:false,//編輯不能更改ASN,新增可以
        transferredLocationList: [],
        showDeleteConfirmation: false, //確定刪除的form
        warningSelect : 0, //if 0 ，就warn完就執行delete patien 否則delete object
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getData()
            this.getDataImport()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getTransferredLocation();
        this.getData();
        this.getDataImport()
        this.getUserList();
        this.getLbeaconData();
    }

    getUserList = () => {
        let { locale } = this.context
        axios.post(getUserList, {
            locale: locale.abbr 
        })
        .then(res => {
            let physicianList = res.data.rows.filter(user => {
                return user.role_type == "care_provider"
            })
            this.setState({
                physicianList,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    getDataImport = () => {
        let { locale } = this.context
        axios.post(getImportTable, {
            locale: locale.abbr
        })
        .then(res => {
            let columnImport = _.cloneDeep(importTableColumn)
            columnImport.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            res.data.rows.map(item => {

                item.status = {
                    value: item.status,
                    label: item.status ? locale.texts[item.status.toUpperCase()] : null,
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
                dataImport: res.data.rows,
                columnImport
            })
        })
        .catch(err => {
            console.log(err);
        })


        axios.post(getImportPatient, {
            locale: locale.abbr
        })
        .then(res =>{
            this.setState({
                dataImportPatient: res.data.rows,
            })
        })
        .catch(err => {
            console.log(err);
        })

       
    }

    getTransferredLocation = () => {
        let { locale } = this.context
        let  lang    = locale.lang == 'tw' ? 'chinese' : 'english'
        axios.get(getTransferredLocation)
        .then(res => {
            const transferredLocationOptions = res.data.map(branch => {

                return {          
                    label: branch.branch_name[lang],
                    value: branch.branch_name['english'],
                    options: branch.offices
                        .map((department, index) => {
                            return {
                                label: `${department[lang]},${branch.branch_name[lang]}`,
                                value: {
                                    chinese: `${department['chinese']},${branch.branch_name['chinese']}`,
                                    english: `${department['english']},${branch.branch_name['english']}`,
                                    departmentId: index,
                                    branchId: branch.id
                                },

                            }
                    }),
                    id: branch.id
                }

            })
            this.setState({
                transferredLocationList: transferredLocationOptions
            })
        })
    }

    getData = () => {
        let { locale } = this.context
        axios.post(getObjectTable, {
            locale: locale.abbr,
            objectType: [0, 1, 2]
        })
        .then(res => {
          
            let column = _.cloneDeep(objectTableColumn)
            let columnPatient = _.cloneDeep(patientTableColumn)
            let data = [], dataPatient = []

            column.push({
                // Header: locale.texts['remove'.toUpperCase().replace(/ /g, '_')],
                Header: "",
                accessor: "Delete Option",
                minWidth: 60,
                Cell: props =>
                    <Button 
                        variant="outline-danger" 
                        className='text-capitalize ml-3 mr-2 py-0'
                        style={{background: 'none'}}
                        onClick={()=>this.handleRemove(props)}
                    >
                        {locale.texts.REMOVE}
                    </Button>
            })

            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            columnPatient.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            res.data.rows.map(item => {
                if (item.object_type != 0) {
                    item.monitor_type = this.getMonitorTypeArray(item, 'patient').join('/')
                    item.object_type = locale.texts.genderSelect[item.object_type]
                    dataPatient.push(item)
                } else {
                    item.monitor_type = this.getMonitorTypeArray(item, 'object').join('/')

                    item.status = {
                        value: item.status,
                        label: item.status ? locale.texts[item.status.toUpperCase()] : null,
                    }
                    if (item.transferred_location){
                        let branch = this.state.transferredLocationList.filter(branch => {
                                if (branch.id == item.transferred_location.branchId){
                                    return true
                                }
                            return false
                        })
                        let department = branch[0] ? branch[0].options[item.transferred_location.departmentId] : null
                        item.transferred_location = department
                    }
                    
                    data.push(item)
                }

                item.area_name = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                }
            })

            this.setState({
                data,
                filteredData: data,
                column,
                dataPatient,
                filteredPatient: dataPatient,
                columnPatient,
                objectTable: res.data.rows
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    getMonitorTypeArray = (item, type) => {
        return Object.keys(config.monitorType)
            .reduce((checkboxGroup, index) => {
                if (item.monitor_type & index) {
                    checkboxGroup.push(config.monitorType[index])
                }
                return checkboxGroup
            }, [])
    }

    getLbeaconData = () => {
        let { locale } = this.context
        axios.post(getLbeaconTable, {
            locale: locale.abbr
        })
        .then(res => {
            let roomOptions = []
            res.data.rows.map(item => {
                if (item.room) {
                    roomOptions.push({
                        value: item.id,
                        label: item.room
                    })
                }
            })
            this.setState({
                roomOptions,
            })
        })
        .catch(err => {
            console.log("get lbeacon data fail : " + err);
        })
    }

    handleClose = () => {
        this.setState({
            isShowEdit: false,
            isPatientShowEdit: false,
            isShowBind:false,
            bindCase:0,
            isShowEditImportTable:false,
            showDeleteConfirmation: false,
            warningSelect:0
        })
    }

    handleClickButton = (e) => {
        let { name } = e.target
        switch(name) {
            case "add object": 
                this.setState({
                    isShowEdit: true,
                    formTitle: name,
                    selectedRowData: [],
                    selectedRowData_Patient:[],
                    formPath: addObject,
                    disableASN:false
                })
                break;
            case "associate":
                this.setState({
                    isShowBind: true,
                    bindCase:1,
                })
            break;
            case "associate_patient":
                this.setState({
                    isShowBind: true,
                    bindCase:2,
                })
            break;

            case "deleteObject":
                this.setState({
                     showDeleteConfirmation: true,
                     warningSelect : 1
                })
                break;

            case "add all":
                this.setState({
                    formTitle: name,
                    formPath: addObject
                })
                break;
            case "delete import data":
                    this.setState({
                        showDeleteConfirmation: true,
                        warningSelect : 2
                   })
                break;  
            case "dissociation":
                this.setState({
                    formTitle: name,
                    isShowEditImportTable: true
                })
                break;
            case "deletePatient":
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect : 0
                })
        }

    }

    deleteBinding = () => {
        let { locale } = this.context
       
        axios.post(cleanBinding, {
            locale: locale.abbr,
            formOption:this.state.selection
        })
        .then(res => {
            this.setState({
                selection: [],
                selectAll: false,
            })
        })
        .catch(err => {
            console.log("clean Binding fail" + err);
        })    
    }

    deleteRecordImport = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
    
     
        axios.post(deleteImportData, {
           idPackage: this.state.selection
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
        setTimeout(this.getData, 500) 
        setTimeout(this.getDataPatient, 500) 
        setTimeout(this.getDataImport, 500) 
        this.setState({
            isShowEdit: false,
            isPatientShowEdit: false,
            isShowBind:false,
            bindCase:0,
            isShowEditImportTable:false,
            showDeleteConfirmation: false,
            selection: [],
            selectAll: false,
            warningSelect:0,
        })
    }

    getMonitorTypeGroup = () => {
        return Object.keys(config.monitorType).map((checkboxGroup, index) => {
            if (item.monitor_type & index) {
                checkboxGroup.push(config.monitorType[index])
            }
            return checkboxGroup
        }, [])
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
  
            const currentRecords = wrappedInstance.props.data
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item => {
                selection.push(item.id);
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
                    ?   deleteArray.push(deleteCount.toString())
                    :   null          
            })
            deleteCount +=1
        })

        this.state.dataPatient.map(dataItem => {
            this.state.selection.map(deleteItem =>{
                dataItem.id == deleteItem 
                    ?   idPackage.push(parseInt(dataItem.id))
                    :   null
            })
        })

        axios.post(deletePatient, {
            idPackage
        })
        .then(res => {
            this.handleSubmitForm()
        })
        .catch(err => {
            console.log(err)
        })
    }


    objectMultipleDelete = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
 
        this.state.data.map (item => {
         
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
            formPath: addPatient,
            physicianName:'',
            physicianIDNumber:0,
            disableASN:false,
        })
    }

    onImportExcel = files => {
     
        // 獲取上傳的文件對象
        //const { files } = file.target; // 通過FileReader對象讀取文件
        const fileReader = new FileReader();
        //console.log(fileReader);
        for (let index = 0; index < files.length; index++) {
            fileReader.name = files[index].name;
        }
      
        fileReader.onload = event => {
            try {
                // 判斷上傳檔案的類型 可接受的附檔名
                const validExts = new Array(".xlsx", ".xls");
                const fileExt = event.target.name;
     
                if (fileExt == null) {
                    throw "檔案為空值";
                }
    
                const fileExtlastof = fileExt.substring(fileExt.lastIndexOf("."));
                if (validExts.indexOf(fileExtlastof) == -1) {
                    throw "檔案類型錯誤，可接受的副檔名有：" + validExts.toString();
                }
  
                const { result } = event.target; // 以二進制流方式讀取得到整份excel表格對象
                const workbook = XLSX.read(result, { type: "binary" });
                let data = []; // 存儲獲取到的數據 // 遍歷每張工作表進行讀取（這裡默認只讀取第一張表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                        data = data.concat(
                            XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                        ); // break; // 如果只取第一張表，就取消註釋這行
                    }
                } 

                

                // ＩＭＰＯＲＴ時把ＡＣＮ重複的擋掉
                let newData = []
                let reapetFlag = false;
                let DataNameIsNull = '';
                let ReapeName = '';

                data.map(importData =>{
                    reapetFlag = false;
                    this.state.dataImport.map(dataOrigin=>{
                       importData.asset_control_number === dataOrigin.asset_control_number ? reapetFlag=true : null
                       importData.asset_control_number == dataOrigin.asset_control_number ? reapetFlag=true : null
                    })
                   if( reapetFlag == false) {
                       if(importData.asset_control_number !=undefined ){
                             newData.push(importData) 
                       }else{
                           DataNameIsNull += importData.name + ','
                       }
                    }else{
                        ReapeName += importData.name   + ','
                    }
                })



                DataNameIsNull!='' ? alert('ASN必須不等於空:' + DataNameIsNull) : null 
                ReapeName!='' ?    alert(ReapeName + '的ASN與其他筆資料重複')  : null
                //沒被擋掉的存到newData後輸出
        
                 let { locale } = this.context
                
                axios.post(objectImport, {
                    locale: locale.abbr ,
                    newData
                })
                .then(res => {
                })
                .catch(err => {
                    console.log(err)
                    
                })
            this.handleSubmitForm()

            } catch (e) {
                // 這裡可以拋出文件類型錯誤不正確的相關提示
                alert(e);
                //console.log("文件類型不正確");
                return;
            }
       
        }; // 以二進制方式打開文件
         fileReader.readAsBinaryString(files[0]);
    };

    handleRemove = (key) => {
        deleteFlag = true 

        this.setState({
            selectedObjectData: key.original,
            isShowEditImportTable: true,
            formTitle: "dissociation" 
        })
    }
    filterData = (data, key, filteredAttribute) => {
        
        let filteredData = data.filter(obj => {
            if(filteredAttribute.includes('name')){
                let keyRex = new RegExp(key)
                if(obj.name.toLowerCase().match(keyRex)){
                    return true
                }
            }
            if(filteredAttribute.includes('type')){
                let keyRex = new RegExp(key)
                if(obj.type.toLowerCase().match(keyRex)){
                    return true
                }
            }
            if(filteredAttribute.includes('acn')){
                let keyRex = new RegExp(key)
                if(obj.asset_control_number.toLowerCase().match(keyRex)){
                    return true
                }
            }
            if(filteredAttribute.includes('status')){
                // statement
            }
            if(filteredAttribute.includes('area')){
                // statement
            }
            if(filteredAttribute.includes('monitor type')){
                // statement
            }
            if(filteredAttribute.includes('mac address')){
                // statement
            }
            return false
        })
        return filteredData
        
    }

    filterObjects = (key) => {
        let filteredAttribute = ['name', 'type','acn']
        let filteredData = this.filterData(this.state.data, key, filteredAttribute)
        this.setState({
            filteredData
        })
    }

    filterPatients = (key) => {
        let filteredAttribute = ['name', 'type','acn']
        let filteredPatient = this.filterData(this.state.dataPatient, key, filteredAttribute)
        this.setState({
            filteredPatient
        })

    }

    render(){
        const { 
            isShowEdit, 
            selectedRowData,
            selectedRowData_Patient,
            isPatientShowEdit,
            selectAll,
            selectType,
            isShowBind,
            bindCase,
            isShowEditImportTable,
        } = this.state

        const { locale } = this.context

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
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                    <TabList>
                        <Tab>{locale.texts.DEVICE_FORM}</Tab>
                        <Tab>{locale.texts.PATIENT_FORM}</Tab>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
                            <Tab>{locale.texts.TOTAL_DATA}</Tab>
                        </AccessControl>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
                             <Tab>{locale.texts.IMPORT_PATIENT_DATA}</Tab>
                        </AccessControl>
                    </TabList>

                    <TabPanel>
                        <ButtonToolbar>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="associate"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ASSOCIATE}
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="add object"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ADD_OBJECT}
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="dissociation"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DISSOCIATE}
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="deleteObject"
                                onClick={this.handleClickButton}
                                // onClick={this.deleteRecordPatient}    
                            >
                                {locale.texts.MULTIPLEDELETE}
                            </Button>
                        </ButtonToolbar>
                        {/* <Searchbar 
                            className={'float-right'}
                            placeholder={''}
                            getSearchKey={this.filterObjects}
                            clearSearchResult={null}    
                        /> */}

                        <SelectTable
                            keyField='id'
                            data={this.state.filteredData}
                            columns={this.state.column}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}

                            getTrProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: (e) => {
                                        if (!e.target.type) {
                                            this.setState({
                                                selectedRowData: this.state.filteredData[rowInfo.index],
                                                isShowEdit: true,
                                                isPatientShowEdit: false,
                                                formTitle: 'edit object',
                                                formPath: editObject,
                                                disableASN:'true'
                                            })
                                        }
              
                                        let id = (rowInfo.index+1).toString()
                                        this.toggleSelection(id)
                                    },
                                }
                            }}
                            getTdProps={() => {
                                return {
                                    style: {
                                        borderRight: 'none'
                                    }
                                }
                            }}
                            getTheadThProps={() => {
                                return {
                                    style: {
                                        borderRight: 'none'
                                    }
                                }
                            }}
                        />
                    </TabPanel>

                    <TabPanel>
                        <ButtonToolbar>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="associate_patient"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ASSOCIATE}
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                onClick={this.handlePatientClick}
                            >
                                {locale.texts.ADD_INPATIENT}
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="deletePatient"
                                onClick={this.handleClickButton}
                                // onClick={this.deleteRecordPatient}    
                            >
                                {locale.texts.DELETE}
                            </Button>
                        </ButtonToolbar>
                        {/* <Searchbar 
                            className={'float-right'}
                            placeholder={''}
                            getSearchKey={this.filterPatients}
                            clearSearchResult={null}    
                        /> */}
                        <SelectTable
                            keyField='id'
                            data={this.state.filteredPatient}
                            columns={this.state.columnPatient}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                            getTrProps={(state, rowInfo, column, instance) => {
                            
                                return {
                                    onClick: (e, handleOriginal) => {

                                        this.setState({
                                            physicianName:this.state.filteredPatient[rowInfo.index].physician_name,
                                            physicianIDNumber:this.state.filteredPatient[rowInfo.index].physician_id,
                                            selectedRowData_Patient: this.state.filteredPatient[rowInfo.index],
                                            isShowEdit: false,
                                            isPatientShowEdit: true,
                                            formTitle: 'edit patient',
                                            formPath: editPatient,
                                            disableASN:true,
                                        })
                                        let id = (rowInfo.index+1).toString()
                                        this.toggleSelection(id)
                                        if (handleOriginal) {
                                            handleOriginal()
                                        }

                                            
                                    }
                                }
                            }}
                        />
                    </TabPanel>

                    <TabPanel> 
                        <ButtonToolbar>
                            <InputFiles accept=".xlsx, .xls" onChange={this.onImportExcel}>
                                <Button 
                                variant="outline-primary" 
                                className="btn btn-primary mr-2 mb-1"
                                >
                                {locale.texts.IMPORT_OBJECT}
                                </Button>
                            </InputFiles>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="delete import data"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.state.dataImport}
                            columns={this.state.columnImport}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                        />
                    </TabPanel>

                    

                    <TabPanel> 
                        <ButtonToolbar>
                            <InputFiles accept=".xlsx, .xls" name="import_patient" onChange={this.onImportExcel}>
                                <Button 
                                variant="outline-primary" 
                                className="btn btn-primary mr-2 mb-1"
                                >
                                {locale.texts.IMPORT_OBJECT}
                                </Button>
                            </InputFiles>
                            <Button 
                                variant="outline-primary" 
                                className='text-capitalize mr-2 mb-1'
                                name="delete import data"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </Button>
                        </ButtonToolbar>
                        <SelectTable
                            keyField='id'
                            data={this.state.dataImportPatient}
                            columns={this.state.columnImport}
                            ref={r => (this.selectTable = r)}
                            className="-highlight"
                            style={{height:'75vh'}}
                            {...extraProps}
                        />
                    </TabPanel>
                </Tabs>
                <EditPatientForm
                    show = {isPatientShowEdit && !this.state.DeleteFlag} 
                    title= {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Patient || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.state.dataPatient}
                    objectData = {this.state.data}
                    physicianList={this.state.physicianList}
                    roomOptions={this.state.roomOptions}
                    physicianName = {this.state.physicianName}
                    physicianIDNumber = {this.state.physicianIDNumber}
                    disableASN = {this.state.disableASN}
                />  
                <EditObjectForm 
                    show={isShowEdit} 
                    title={this.state.formTitle} 
                    selectedObjectData={selectedRowData || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    importData={this.state.dataImport}
                    objectTable={this.state.objectTable}
                    disableASN = {this.state.disableASN}
                />
                <BindForm
                    show = {isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable}
                    ImportData= {this.state.dataImport}
                    PatientImportData = {this.state.dataImportPatient}
                    data={this.state.dataImport.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item
                        return dataMap
                        }, {})
                    }
                />
                <DissociationForm
                    show={isShowEditImportTable} 
                    title={this.state.formTitle} 
                    selectedObjectData={this.state.selectedObjectData || 'handleAllDelete'} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    objectTable={this.state.objectTable}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                        }, {})
                    }
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={
                        this.state.warningSelect == 0 ? this.deleteRecordPatient  
                    :this.state.warningSelect ==1 ?  this.objectMultipleDelete 
                    : this.state.warningSelect ==2 ?  this.deleteRecordImport : null 
                    }
                />
            </Container>
        )
    }
}

export default ObjectManagementContainer
