import React from 'react';

/** Import Presentational Component */
import { 
    getAreaTable,
    getObjectTable,
    getPatientTable,
    editObject,
    editPatient,
    editImport,
    addObject,
    addPatient,
    deletePatient,
    deleteDevice,
    getUserList,
    getLbeaconTable,
    objectImport,
    getImportTable,
    deleteImportData,
    getObjectTable_fromImport,
    cleanBinding
} from "../../dataSrc"
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row, Button, Nav, Container,ButtonToolbar} from 'react-bootstrap';
import EditObjectForm from './EditObjectForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import config from '../../config'
import { objectTableColumn } from '../../tables'
import { patientTableColumn } from '../../tables'
import { importTableColumn } from '../../tables'
import EditPatientForm from './EditPatientForm'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../context/AppContext';
import AddAllForm from './AddAllForm';
import XLSX from "xlsx";
import InputFiles from "react-input-files";
import BindForm from './BindForm'
import EditImportTable from './EditImportTable'
import AccessControl from '../presentational/AccessControl'
const SelectTable = selecTableHOC(ReactTable);


class ObjectManagementContainer extends React.Component{
    static contextType = AppContext

    state = {
        column:[],
        columnImport:[],
        columnPatient:[],
        data:[],
        dataPatient:[],
        isShowEdit: false,
        isPatientShowEdit: false,
        isShowAddAll: false,
        selection: [],
        selectedRowData: [],
        selectedRowData_Patient: [],
        selectedRowData_Import: [],
        areaList: [],
        formTitle: '',
        formPath: '',
        selectAll: false,
        locale: this.context.locale.abbr,
        tabIndex: 0,
        deleteFlag: 0,
        roomOptions: {},
        dataImport:[],
        isShowBind:false,
        isShowEditImportTable:false,
        dataImportThis:[],
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getData()
            this.getDataPatient()
            this.getDataImport()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getData();
        this.getDataPatient();
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

    getDataPatient = () => {
        let { locale } = this.context

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

                item.monitor_type = this.getMonitorTypeArray(item).join('/')
                
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
                item.monitor_type = this.getMonitorTypeArray(item).join('/')

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
                columnImport: columnImport,
            })
        })


        .catch(err => {
            console.log(err);
        })
      
    }




    getMonitorTypeArray = (item) => {
        return Object.keys(config.monitorType).reduce((checkboxGroup, index) => {
            if (item.monitor_type & index) {
                checkboxGroup.push(config.monitorType[index])
            }
            return checkboxGroup
        }, [])
    }

    getData = () => {
        let { locale } = this.context
        let totalArray = [];
        

        axios.post(getObjectTable_fromImport, {
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
                totalArray.push(item)
                item.monitor_type = this.getMonitorTypeArray(item).join('/')

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
                data: res.data.rows,
                column: column,
            })


        })
        .catch(err => {
            console.log(err);
        })


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

    handleModalForm = () => {
        this.setState({
            isShowEdit: true,
            isPatientShowEdit: true,
            isShowBind:true,
            isShowEditImportTable:true
        })
    }

    handleCloseForm = () => {
        this.setState({
            isShowEdit: false,
            isPatientShowEdit: false,
            isShowAddAll: false,
            isShowBind:false,
            isShowEditImportTable:false
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
                    selectedRowData_Import:[],
                    formPath: addObject
                })
                break;
            case "associate object":

                this.setState({
                    isShowBind: true,
                })
                break;
            

            // console.log(e.target.name)

                // this.setState({
                //     isShowEdit: true,
                //     formTitle: name,
                //     selectedRowData: [],
                //     selectedRowData_Patient:[],
                //     formPath: addObject
                // })

                break;
            case "delete object":
                this.deleteRecordDevice();
                break;

            case "add all":
                this.setState({
                    formTitle: name,
                    formPath: addObject
                })
                break;


             case "delete import data":
                    this.deleteRecordImport();
                 break;  
        }

    }

    deleteBind= () => {
        this.setState({
          isShowEditImportTable:true
          // selectedRowData_Import:
       })
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
            console.log("clean Binding fail : " + err);
        })
    
        this.handleSubmitForm()
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
            isShowEditImportTable:false
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
            selectedRowData_Import:[],
            formTitle: 'add inpatient',
            formPath: addPatient
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
                this.setState({
                    dataImportThis: data
                })

                

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


    render(){
        const { 
            isShowEdit, 
            selectedRowData,
            selectedRowData_Patient,
            selectedRowData_Import,
            isPatientShowEdit,
            selectAll,
            selectType,
            isShowBind,
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
                <br/>
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                    <TabList>
                       
                        <Tab>{locale.texts.DEVICE_FORM}</Tab>
                        <Tab>{locale.texts.PATIENT_FORM}</Tab>

                          <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
                        <Tab>
                        {locale.texts.TOTAL_DATA}
                        </Tab>
                       </AccessControl>
     
                    </TabList>


            


                <TabPanel>
                    <ButtonToolbar>
                         <Button 
                            variant="outline-primary" 
                            className='text-capitalize mr-2 mb-1'
                            name="associate object"
                            onClick={this.handleClickButton}
                        >
                            {locale.texts.ASSOCIATE}
                        </Button>
                     
                        <Button 
                            variant="outline-primary" 
                            className='text-capitalize mr-2 mb-1'
                            name="delete binding"
                            onClick={this.deleteBinding}
                        >
                            {locale.texts.BINDING_DELETE}
                        </Button>
                            
                        <Button 
                            variant="outline-primary" 
                            className='text-capitalize mr-2 mb-1'
                            name="add object"
                            onClick={this.handleClickButton}
                        >
                            {locale.texts.ADD_OBJECT}
                        </Button>

                         
                        {/* <Button 
                            variant="outline-primary" 
                            className='text-capitalize mr-2 mb-1'
                            name="delete bind"
                            onClick={this.deleteBind}
                        >
                            {'取消綁定：2'}
                        </Button> */}

                        {/* 
                        <Button 
                            variant="outline-primary" 
                            className='text-capitalize mr-2 mb-1'
                            name="associate object"
                            onClick={this.handleClickButton}
                        >
                            {locale.texts.ASSOCIATE}
                        </Button>
                         
                        <InputFiles accept=".xlsx, .xls" onChange={this.onImportExcel}>
                            <button 
                            className="btn btn-primary"
                            >
                            {locale.texts.IMPORT_OBJECT}
                            </button>
                        </InputFiles> */}


                    </ButtonToolbar>
                    <SelectTable
                            keyField='id'
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
                                                formPath: editImport,
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
                            }}
                        />
                    </TabPanel>
                </Tabs>

                <TabPanel> 
                    <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
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
                            getTrProps={(state, rowInfo, column, instance) => {
                            
                                return {
                                    onClick: (e, handleOriginal) => {
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
                            </AccessControl>
                </TabPanel>

                <EditPatientForm
                    show = {isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Patient || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.dataPatient}
                    objectData = {this.state.data}
                    physicianList={this.state.physicianList}
                    roomOptions={this.state.roomOptions}
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
                />

                <BindForm
                    show = {isShowBind} 
                    title=  {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Import || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.dataImport}
                />

                <EditImportTable
                    show = {isShowEditImportTable} 
                    title=  {this.state.formTitle} 
                    selectedObjectData={selectedRowData_Import || null} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleCloseForm={this.handleCloseForm}
                    data={this.state.dataImport}
                />
            </Container>
        )
    }
}

export default ObjectManagementContainer
