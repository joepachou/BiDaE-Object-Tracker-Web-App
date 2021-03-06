/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PatientTable.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React, { Fragment } from 'react';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../config/styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import BindForm from '../presentational/form/BindForm';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm';
import moment from 'moment';
import EditPatientForm from '../presentational/form/EditPatientForm';
import messageGenerator from '../../helper/messageGenerator';
const SelectTable = selecTableHOC(ReactTable);
import { patientTableColumn } from '../../config/tables';
import config from '../../config';
import dataSrc from '../../dataSrc';
import apiHelper from '../../helper/apiHelper';
import { JSONClone } from '../../helper/utilities';
import {
    BrowserView,
    MobileOnlyView,
    TabletView,
    CustomView,
    isMobile,
    isTablet
} from 'react-device-detect';
import BrowserObjectTableView from '../platform/browser/BrowserObjectTableView';
import TabletObjectTableView from '../platform/tablet/TableObjectTableView';
import MobileObjectTableView from '../platform/mobile/MobileObjectTableView';
import {
    transferMonitorTypeToString
} from '../../helper/dataTransfer';
import {
    ADD,
    BIND,
    UNBIND,
    DELETE,
    DEVICE,
    PERSON,
    SAVE_SUCCESS,
    DISASSOCIATE
} from '../../config/wordMap';


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
        data: [],
        columns: [],
        areaTable: [],
        physicianList: [],
        roomOptions: [],
        objectFilter: [],
        objectTable: [],
        importData: [],
        filteredData: [],
        filterSelection: {},
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => { 
        this.getData();
        this.getAreaTable();
    }

    componentDidUpdate = (prevProps, prevState) => {    

        if (this.context.locale.abbr !== prevState.locale) {    
            this.getRefresh()
            this.setState({ 
                locale: this.context.locale.abbr
            }) 
        } 
    }

    getRefresh = () =>{
        this.getAreaTable()

        let columns = JSONClone(patientTableColumn);

        let {
            locale
        } = this.context;

        columns.map(field => {
            field.Header = this.context.locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
        }) 

        this.state.data.map(item => {
            item.area_name.label = locale.texts[item.area_name.value]
            item.object_type.label = locale.texts[item.object_type.value.toUpperCase()]
            item.registered_timestamp = moment(item.registered_timestamp._i).locale(this.context.locale.abbr).format("lll")
            item.area_name.label == undefined ?   item.area_name.label = '*site module error*' : null 
        })

        this.state.filteredData.map(item=>{ 
            item.area_name.label = locale.texts[item.area_name.value]
            item.object_type.label = locale.texts[item.object_type.value.toUpperCase()]
            item.registered_timestamp = moment(item.registered_timestamp._i).locale(this.context.locale.abbr).format("lll")
            item.area_name.label == undefined ?   item.area_name.label = '*site module error*' : null
        })
       
        this.setState({
            columns, 
            locale: this.context.locale.abbr
        }) 
    }

    getData = (callback) => {
        let { 
            locale,
            auth
        } = this.context

        apiHelper.objectApiAgent.getObjectTable({
            locale: locale.abbr,
            areas_id: auth.user.areas_id,
            objectType: [0, 1, 2]
        })
        .then(res => {
            let columns = JSONClone(patientTableColumn);

            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            let data = res.data.rows
                .filter(item => item.object_type != 0)
                .map(item => { 
                    item.area_name = {
                        value:item.area_name,
                        label: locale.texts[item.area_name] || '*site module error*',
                        id: item.area_id
                    }
                    item.monitor_type = transferMonitorTypeToString(item);
                    item.object_type = {
                        ...config.GENDER_OPTIONS[item.object_type],
                        label: locale.texts[config.GENDER_OPTIONS[item.object_type].value.toUpperCase()]
                    }
                    item.isBind = item.mac_address ? 1 : 0;
                    item.mac_address = item.mac_address ? item.mac_address : locale.texts.NON_BINDING

                    return item
                })  

            this.getIdleMacaddrSet()

            this.setState({
                data,
                isShowEdit: false,
                isShowBind: false,
                showDeleteConfirmation: false,
                isPatientShowEdit: false,
                disableASN: false, 
                columns,
                objectTable: res.data.rows,
                locale: locale.abbr,
                filteredData:data 
            }, callback) 
        })
        .catch(err => {
            console.log(err);
        })
    }

    getIdleMacaddrSet = async () => {
        await apiHelper.objectApiAgent.getIdleMacaddr()
            .then(res => {
                let idleMacaddrSet = res.data.rows[0].mac_set
                let macOptions = idleMacaddrSet.map(mac => {
                    return {
                        label: mac,
                        value: mac.replace(/:/g, '')
                    }
                })
                this.setState({
                    idleMacaddrSet,
                    macOptions
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getAreaTable = () => {
        let {
            locale
        } = this.context

        apiHelper.areaApiAgent.getAreaTable()
            .then(res => {
                let areaSelection = res.data.rows.map(area => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name]
                    }
                })
                this.setState({
                    areaTable: res.data.rows,
                    areaSelection,
                    filterSelection: {
                        ...this.state.filterSelection,
                        areaSelection,
                    }
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
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

    handleSubmitForm = (formOption, cb) => {
        let {
            apiMethod
        } = this.state

        apiHelper.objectApiAgent[apiMethod]({
            formOption,
            mode: PERSON,
        })
        .then(res => { 
            let callback = () => {
                messageGenerator.setSuccessMessage(SAVE_SUCCESS)
            }
            this.getData(callback)
        }).catch( error => {
            console.log(error)
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
        let selection = [];
        let rowsCount = 0 ; 
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
           // const currentRecords = wrappedInstance.props.data
 
            const currentRecords = wrappedInstance.getResolvedState().sortedData ; 
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item._original.id)
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
        let {
            locale
        } = this.context
        
        switch(name) {
            case ADD: 
                this.setState({
                    isPatientShowEdit: true,
                    formTitle: name,
                    selectedRowData: [],
                    disableASN: false,
                    apiMethod: 'post',
                })
                break;
            case BIND:
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                    apiMethod: 'post',
                })
            break; 
            case UNBIND:
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                    apiMethod: 'post',
                })
            break; 
            case DELETE:
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect : 1,
                    action: DELETE,
                    message: locale.texts.ARE_YOU_SURE_TO_DELETE
                })
                break;
  
            // case DISASSOCIATE:
            //     this.setState({
            //         formTitle: name,
            //         isShowEditImportTable: true
            //     })
            //     break; 

            case DISASSOCIATE:
                this.setState({
                    showDeleteConfirmation: true,
                    action: DISASSOCIATE,
                    message: locale.texts.ARE_YOU_SURE_TO_DISASSOCIATE
                })
                break; 
        }
    }

    objectMultipleDelete = () => {


        switch(this.state.action) {

            case DISASSOCIATE:
        
                apiHelper.objectApiAgent.disassociate({
                    formOption: {
                        id: this.state.selectedRowData.id
                    }
                })
                .then(res => {
                    let callback = () => {
                        messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                    }
                    this.getData(callback)
                })
                .catch(err => {
                    console.log(err)
                })
            break;
          
            case DELETE:
                let formOption = []
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
                
                this.setState({selectAll:false})

                deleteArray.map( item => {
                
                    this.state.data[item] === undefined ?
                        null
                        :
                        formOption.push({
                            id: this.state.data[item].id,
                            mac_address: this.state.data[item].isBind ? this.state.data[item].mac_address : null
                        })
                    })

                apiHelper.objectApiAgent.deleteObject({
                    formOption
                })
                .then(res => {
                    let callback = () => {
                        messageGenerator.setSuccessMessage(SAVE_SUCCESS)
                    }
                    this.getData(callback)
                })
                .catch(err => {
                    console.log(err)
                }) 
        
                this.setState({selectAll:false,selection:[]})

                break;
        }
    }


    filterData = (data, key, filteredAttribute) => { 
        const { locale } = this.context    
        key = key.toLowerCase()
        let filteredData = data.filter(obj => { 
            if(filteredAttribute.includes('name')){

                let keyRex = new RegExp(key)
                if(obj.name.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if(filteredAttribute.includes('acn')){
                let keyRex = new RegExp(key)
                if(obj.asset_control_number.toLowerCase().match(keyRex)) return true

            }

            if (filteredAttribute.includes('area')){ 
                let keyRex = new RegExp(key) 
                if (obj.area_name.label != undefined){
                    if (obj.area_name.label.toLowerCase().match(keyRex)) {
                       return true 
                    }
                } 
            }

            if  (filteredAttribute.includes('macAddress')){ 
                let keyRex = key.replace(/:/g, '')
                if (obj.mac_address.replace(/:/g, '').toLowerCase().match(keyRex)) return true
            }

            return false
        })
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

    render(){

        const {  
            selectedRowData,
            selectAll,
            selectType,
            filterSelection,
            selection
        } = this.state

        const {
            toggleSelection,
            toggleAll,
            isSelected,
            addObjectFilter,
            removeObjectFilter,
            handleClickButton,
            handleClick
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        const propsGroup = {
            addObjectFilter,
            removeObjectFilter,
            filterSelection,
            handleClickButton,
            handleClick,
            selection
        }

        return(
            <Fragment> 
               <CustomView condition={isTablet != true && isMobile != true}>
                     <BrowserObjectTableView
                        {...propsGroup}
                    />    
                </CustomView> 
                <TabletView>
                    <TabletObjectTableView
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileObjectTableView
                        {...propsGroup}
                    />                    

                </MobileOnlyView>
                <hr/>  
                <SelectTable
                    keyField='id'
                    data={this.state.filteredData}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)} 
                    className='-highlight text-none'
                    style={{maxHeight:'70vh'}} 
                    onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    onSortedChange={(e) => {this.setState({selectAll:false,selection:''})}}
                    {...extraProps}
                    {...styleConfig.reactTable}
                    NoDataComponent={() => null}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {  
                                if (!e.target.type) { 
                                    this.setState({
                                        isPatientShowEdit: true,
                                        selectedRowData: rowInfo.original,
                                        formTitle: 'edit info',
                                        disableASN: true,
                                        apiMethod: 'put',
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
                    handleSubmit={this.handleSubmitForm}
                    handleClick={this.handleClickButton}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    objectTable= {this.state.objectTable}
                    physicianList={this.state.physicianList}
                    roomOptions={this.state.roomOptions}
                    disableASN = {this.state.disableASN}
                    areaTable={this.state.areaTable}
                    macOptions={this.state.macOptions}
                />  
                <BindForm 
                    show = {this.state.isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable}
                    areaTable={this.state.areaTable}
                    macOptions={this.state.macOptions}
                    data={this.state.importData.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item 
                        return dataMap
                        }, {})
                    }
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    message={this.state.message}
                    handleSubmit={this.objectMultipleDelete}
                />
            </Fragment>
        )
    }
}
export default PatientTable
