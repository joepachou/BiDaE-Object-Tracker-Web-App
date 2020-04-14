import React, { Fragment } from 'react';
import { 
    getObjectTable,
    getAreaTable, 
    getUserList,
    getLbeaconTable, 
    getImportTable,  
    getImportPatient,
    getTransferredLocation
} from "../../../dataSrc"
import { 
    Fade,
    
} from 'react-transition-group'
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import { 
    objectTableColumn,
    patientTableColumn,
    importTableColumn
 } from '../../../config/tables' 
import config from '../../../config' 
import { 
    Nav,
    Tab,
} from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../../context/AppContext';
import AccessControl from '../../presentational/AccessControl'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'
import ImportObjectTable from '../../presentational/ImportObjectTable'
import ImportPatientTable from '../../presentational/ImportPatientTable' 
import DissociationForm from '../DissociationForm'
import retrieveDataHelper from '../../../helper/retrieveDataHelper'
import {
    BOTContainer,
    BOTNavLink,
    BOTNav,
    PageTitle
} from '../../../config/styleComponent'


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
        locale: this.context.locale.abbr,
        tabIndex: 0, 
        roomOptions: {}, 
        transferredLocationList: [], 
        filterSelection: {
            statusOptions: config.statusOptions.map(item => {
                return {
                    value: item,
                    label: this.context.locale.texts[item.replace(/ /g, '_').toUpperCase()]
                }
            }),
            monitorTypeOptions: config.monitorOptions.map(item => {
                return {
                    value: item,
                    label: item 
                }
            })
           
        },
        objectFilter: [],
        patientFilter: [],
        formTitle:'',
        areaTable: [],
        loadingFlag : false,
        filteredData: []
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getData()
            this.getDataImport()
            this.getImportPatient()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    async  getDataContontainer(){
   
        var transferredLocationList = ( Promise.resolve( this.getTransferredLocation() )  );
        await   transferredLocationList.then(function(result){transferredLocationList = result})
 
        var physicianList = ( Promise.resolve(  this.getPhysicianList() )  );
        await   physicianList.then(function(result){physicianList = result})

        var lbeaconData = ( Promise.resolve( this.getLbeaconData())  );
        await   lbeaconData.then(function(result){lbeaconData = result})

        var areaTable = ( Promise.resolve(  this.getAreaTable())  );
        await   areaTable.then(function(result){areaTable = result})

        var data = ( Promise.resolve(  this.getData())  );
        await   data.then(function(result){data = result})

        var dataImport = ( Promise.resolve(  this.getDataImport()  )  );
        await   dataImport.then(function(result){dataImport = result})
    
        var importPatient = ( Promise.resolve(  this.getImportPatient())  );
        await  importPatient.then(function(result){importPatient = result}) 
  
        this.setState({
            ...transferredLocationList,
            ...physicianList,
            roomOptions :lbeaconData,
            areaTable: areaTable.areaTable, 
            ...data,
            filterSelection: {
                ...data.filterSelection,
                ...areaTable.filterSelection,
            },
            ...dataImport,
            dataImportPatient: importPatient
        }) 
   
    }

    componentDidMount = () => {
        this.getDataContontainer();
  
    }

    async getAreaTable(){
        let {
            locale
        } = this.context
        return await retrieveDataHelper.getAreaTable()
        .then(res => {
            let areaSelection = res.data.rows.map(area => {
                return {
                    value: area.name,
                    label: locale.texts[area.name]
                }
            })

            return({
                areaTable: res.data.rows,
                filterSelection: {
                    ...this.state.filterSelection,
                    areaSelection,
                }
              })
            // this.setState({
            //     areaTable: res.data.rows,
            //     filterSelection: {
            //         ...this.state.filterSelection,
            //         areaSelection,
            //     }
            // })
        })
        .catch(err => {
            console.log(`get area table failed ${err}`)
        })
    }

     async    getPhysicianList(){
        let { locale } = this.context
        return await  axios.post(getUserList, {
            locale: locale.abbr 
        })
        .then(res => {

            let physicianList = res.data.rows
                .filter(user => {
                    return user.role_type.includes("care_provider")
                })

          return physicianList
        })
        .catch(err => {
            console.log(err)
        })
    }

    async   getDataImport(){
        let { locale } = this.context
        return await  axios.post(getImportTable, {
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
            
            return({
                dataImport: res.data.rows,
                columnImport
            })
        })
        .catch(err => {
            console.log(err);
        })

 
    
    }


    async  getImportPatient(){
        let { locale } = this.context
        return await  axios.post(getImportPatient, {
            locale: locale.abbr
        })
        .then(res =>{
            return res.data.rows
            // this.setState({
            //     dataImportPatient: res.data.rows,
            // })
        })
        .catch(err => {
            console.log(err);
        })
    }


    async   getTransferredLocation(){
        let { locale } = this.context
        return await   axios.get(getTransferredLocation)
        .then(res => {
            const transferredLocationOptions = res.data.map(branch => {
                return {          
                    label: branch.branch_name,
                    value: branch,
                    options: branch.department
                        .map((department, index) => {
                            return {
                                label: `${department},${branch.branch_name}`,
                                value: {
                                    branch,
                                    departmentId: index,
                                }
                            }
                    }),
                    id: branch.id
                }

            })
            return transferredLocationOptions
            // this.setState({
            //     transferredLocationList: transferredLocationOptions
            // }) 
        })
    }

   async getData(){
        let { 
            locale,
            auth
        } = this.context

       return await retrieveDataHelper.getObjectTable(
            locale.abbr,
            auth.user.areas_id,
            [0, 1, 2]
        )
        .then(res => {
            let column = _.cloneDeep(objectTableColumn)
            let columnPatient = _.cloneDeep(patientTableColumn)
            let data = [] 
            let dataPatient = []
            let typeList = {} 
            // column.push({
            //     Header: "",
            //     accessor: "Delete Option",
            //     minWidth: 60,
            //     Cell: props =>
            //         <Button 
            //             variant="outline-danger" 
            //             className='text-capitalize ml-3 mr-2 py-0'
            //             style={{background: 'none'}}
            //             onClick={()=>this.handleRemove(props)}
            //         >
            //             {locale.texts.REMOVE}
            //         </Button>
            // })

            column.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            columnPatient.map(field => {
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

                    if(item.transferred_location){
                        let ids = item.transferred_location.split(',')
                        let branchId = ids[0], departmentId = ids[1]
                        if (item.transferred_location){
                            let branch = this.state.transferredLocationList.filter(branch => {
                                    if (branch.id == branchId){
                                        return true
                                    }
                                return false
                            })
                            let department = branch[0] ? branch[0].options[departmentId] : null
                            item.transferred_location = department
                        }
                    }
 
                    if (!Object.keys(typeList).includes(item.type)) { 
                       typeList[item.type] = {
                           value: item.type,
                           label: item.type
                       }
                    }
                    data.push(item)
                }
                item.area_name = {
                    value: item.area_name,
                    label: locale.texts[item.area_name],
                    id: item.area_id
                }
            })

            return ({
                data,
                filteredData: data,
                column,
                dataPatient,
                filteredPatient: dataPatient,
                columnPatient,
                objectTable: res.data.rows,
                filterSelection: {
                    ...this.state.filterSelection,
                    typeList,
                }
            })

            // this.setState({
            //     data,
            //     filteredData: data,
            //     column,
            //     dataPatient,
            //     filteredPatient: dataPatient,
            //     columnPatient,
            //     objectTable: res.data.rows,
            //     filterSelection: {
            //         ...this.state.filterSelection,
            //         typeList,
            //     }
            // })
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

    async getLbeaconData(){
        let { locale } = this.context
        return await axios.post(getLbeaconTable, {
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
            return roomOptions
            // this.setState({
            //     roomOptions,
            // })
        })
        .catch(err => {
            console.log("get lbeacon data fail : " + err);
        })
    }
 
    refreshData = () => { //重整用 
        if (this.state.tabIndex >=2){
            this.setState({
                tabIndex : (this.state.tabIndex -1)
            })
            this.setState({
                tabIndex : (this.state.tabIndex +1)
            })           
        }
        this.getDataContontainer()
    }
 

    handleRemove = (key) => { //button在欄位裡，欄位在OBJECT MANAGER裡創的
        this.setState({ 
            selectedObjectData: key.original,
            isShowEditImportTable: true,
            formTitle: "dissociation"
        })
    }

    handleClose =() =>{
        this.setState({ 
            selectedObjectData: '',
            isShowEditImportTable: false,
            formTitle: ""
        })
    }

    filterData = (data, key, filteredAttribute) => {
                    
        this.setState({
            loadingFlag:  true
        })
        const { locale } = this.context  
        key = key.toLowerCase()
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
                if(obj.asset_control_number.toLowerCase().match(keyRex)) return true

            }

            if  (filteredAttribute.includes('status')){
                
                let keyRex = new RegExp(key.toLowerCase())

                if(obj.status.label.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if (filteredAttribute.includes('area')){ 
                let keyRex = new RegExp(key) 
                if (obj.area_name.label != undefined){
                    if (obj.area_name.label.match(keyRex)) {
                       return true 
                    }
                } 
            }

            if (filteredAttribute.includes('monitor')){
                let keyRex = new RegExp(key)
                if(obj.monitor_type.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if  (filteredAttribute.includes('macAddress')){

                let keyRex = key.replace(/:/g, '')
                if (obj.mac_address.replace(/:/g, '').toLowerCase().match(keyRex)) return true
            }

            if(filteredAttribute.includes('sex')){
               
                if (obj.object_type == key){
                    return true
                }
            }
 
            if(filteredAttribute.includes('physician_name')){
              
                let keyRex = new RegExp(key)

                if (obj.physician_name && obj.physician_name.toLowerCase().match(keyRex)){
                    return true
                } 
            }

            return false
        })
        this.setState({ loadingFlag:  false })
        return filteredData
        
    }

    addObjectFilter = (key, attribute, source) => {

        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        
        this.state.objectFilter.push({
            key, attribute, source
        })
        this.filterObjects()
    }

    removeObjectFilter = (source) => {
        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        this.filterObjects()
    }

    filterObjects = () => {
        let filteredData = this.state.objectFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.data)

        this.setState({
            filteredData
        })
    }

    addPatientFilter = (key, attribute, source) => {
        this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
        this.state.patientFilter.push({
            key, attribute, source
        }) 
       
        this.filterPatients()
    }

    removePatientFilter = (source) => {
        this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
        this.filterPatients()
    }

    filterPatients = () => {
        let filteredPatient = this.state.patientFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.dataPatient)
        this.setState({
            filteredPatient
        }) 
    }
 
    tabList = [
        {
            name: 'object table',
            component: (props) => <ObjectTable {...props}/>,
            platform: ['browser'],
        },
        {
            name: "patient table",
            component: (props) => <PatientTable {...props}/>
        },
        {
            name: "import object table",
            component: (props) => <ImportObjectTable {...props}/>
        },
        {
            name: "import patient",
            component: (props) => <ImportPatientTable {...props}/>
        },
    ]

    defaultActiveKey = "devices_table"

    render(){
        const {  
            filterSelection
        } = this.state

        const { locale } = this.context


        const style = {

            sidenav: {
                width: 150,
            },
            sidemain:{
                marginLeft: 150
            },
        } 
        let typeSelection = filterSelection.typeList ? Object.values(filterSelection.typeList) : null;
        return (     
            <BOTContainer>     
                <PageTitle>                                            
                    {locale.texts.OBJECT_MANAGEMENT}
                </PageTitle>
                <Tab.Container 
                    transition={Fade}
                    defaultActiveKey={this.defaultActiveKey}
                >
                    <BOTNav>
                        <Nav.Item>
                            <BOTNavLink eventKey="devices_table">
                                {locale.texts.DEVICE_FORM}
                            </BOTNavLink>
                        </Nav.Item>
                        <Nav.Item>
                            <BOTNavLink eventKey="patients_table">
                                {locale.texts.PATIENT_FORM}
                            </BOTNavLink>
                        </Nav.Item>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey="import_devices">
                                    {locale.texts.IMPORT_DEVICES_DATA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey="import_patients">
                                    {locale.texts.IMPORT_PATIENTS_DATA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                    </BOTNav>
                    <Tab.Content
                        className="my-3"
                    >
                        <Tab.Pane eventKey="devices_table"> 
                            <ObjectTable
                                data={this.state.filteredData}
                                columns={this.state.column}
                                refreshData={this.refreshData}  
                                importData={this.state.dataImport}
                                objectTable={this.state.objectTable} 
                                addObjectFilter = {this.addObjectFilter}
                                removeObjectFilter ={ this.removeObjectFilter}
                                typeSelection = {typeSelection}
                                filterSelection={this.state.filterSelection}
                                areaTable={this.state.areaTable}
                                loadingFlag = {this.state.loadingFlag}
                            /> 
                        </Tab.Pane>

                        <Tab.Pane eventKey="patients_table">
                            <PatientTable
                                data={this.state.filteredPatient}
                                columns={this.state.columnPatient} 
                                refreshData={this.refreshData}  
                                importData={this.state.dataImport}
                                objectTable={this.state.objectTable} 
                                addPatientFilter = {this.addPatientFilter}
                                removePatientFilter = {this.removePatientFilter}
                                typeSelection = {typeSelection}
                                filterSelection={this.state.filterSelection}
                                dataImportPatient = {this.state.dataImportPatient}
                                physicianList={this.state.physicianList}
                                roomOptions={this.state.roomOptions} 
                                areaTable={this.state.areaTable}
                                loadingFlag = {this.state.loadingFlag}
                            />
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="import_devices">
                            <ImportObjectTable
                                dataImport = {this.state.dataImport}
                                columnImport = {this.state.columnImport}
                                refreshData={this.refreshData}
                            />
                        </Tab.Pane>

                        <Tab.Pane eventKey="import_patients">
                            <ImportPatientTable
                                dataImportPatient = {this.state.dataImportPatient}
                                columnImport = {this.state.columnImport}
                                refreshData={this.refreshData} 
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
                <DissociationForm
                    show={this.state.isShowEditImportTable}
                    title={this.state.formTitle}
                    selectedObjectData={this.state.selectedObjectData || 'handleAllDelete'}
                    refreshData={this.refreshData}
                    formPath={this.state.formPath}
                    objectTable={this.state.objectTable}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                        }, {})
                    }
                />
            </BOTContainer>
        )
    }
}

export default ObjectManagementContainer
