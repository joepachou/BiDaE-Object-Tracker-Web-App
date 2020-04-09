import React from 'react';
import { AppContext } from '../../context/AppContext';
import { 
    Row, 
    Col, 
    ButtonToolbar,
    Button
} from "react-bootstrap"
import axios from "axios"
import dataSrc from "../../dataSrc"
import config from "../../config"
import ReactTable from 'react-table'
import { geofenceConfigColumn } from '../../config/tables'
import EditGeofenceConfig from '../presentational/EditGeofenceConfig'
import retrieveDataHelper from '../../helper/retrieveDataHelper'
import styleConfig from '../../config/styleConfig';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';

const SelectTable = selecTableHOC(ReactTable);
let lock = false
class GeoFenceSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        lbeaconsTable: [],
        selectedData: null,
        show: false,
        showDeleteConfirmation: false,
        locale: this.context.locale.abbr,   
        isEdited: false,
        path: ''   ,
        selection: [],
        selectAll: false,  
        exIndex:9999,
    }
 

    componentDidMount = () => { 
        this.getMonitorConfig()
        this.getLbeaconTable() 
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.exIndex != this.props.nowIndex){
            this.setState({selectAll : false,selection:'',exIndex:this.props.nowIndex}) 
        }
        if (this.context.locale.abbr !== prevState.locale) {
            this.getMonitorConfig()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    getLbeaconTable = () => {
        let { locale } = this.context
        retrieveDataHelper.getLbeaconTable(locale.abbr)
            .then(res => {
                this.setState({
                    lbeaconsTable: res.data.rows
                })
            })
    }

    getMonitorConfig = () => {
        let { 
            auth,
            locale,
        } = this.context
        axios.post(dataSrc.getGeofenceConfig, {
            type: config.monitorSettingUrlMap[this.props.type],
            areasId: auth.user.areas_id
        })
        .then(res => {
            let columns = _.cloneDeep(geofenceConfigColumn)

            columns.push({
                Header: "action",
                minWidth: 60,
                Cell: props => (
                    <div className="d-flex justify-content-start">
                        {['edit'].map((item, index, original) => {
                            return   ( 
                                <div 
                                    key={item} 
                                    className="d-flex justify-content-start"
                                >
                                    <Button
                                        variant="link" 
                                        name={item}
                                        size="sm"
                                        style={styleConfig.link}
                                        onClick={(e) => {
                                            this.handleClickButton(e, props)
                                    }} >
                                        {locale.texts[item.toUpperCase()]}
                                    </Button>
                                    {index < original.length - 1
                                        ? <div className="mx-1">|</div>
                                        : ""
                                    }
                                </div>
                            )
                        })}
                    </div>
                )
            })
            columns.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            
            res.data.rows.map((item,index) => {  
                item.key=index + 1
                item.area = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                    id: item.area_id
                }
                item.p_rssi = item.perimeters.split(',')[item.perimeters.split(',').length-2]
                item.f_rssi = item.fences.split(',')[item.fences.split(',').length-2] 
            })
            this.setState({
                data: res.data.rows,
                columns,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleClickButton = (e, value) => {
 

        let { name } = e.target
        switch(name) {
            case "add rule": 
                this.setState({
                    show: true,
                    isEdited: false,
                    path: 'addGeofenceConfig'
                })
                break;
            case "edit":
                this.setState({
                    show: true,
                    selectedData: value.original,
                    isEdited: true,
                    path: 'setGeofenceConfig'
                })
                break;
            case "delete":
                this.setState({ 
                    showDeleteConfirmation: true, 
                    path: 'deleteMonitorConfig',  
                }) 
                lock = true  
                break;
        }
    }

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null , 
        })
        lock=false 
    }

    handleSubmit = (pack) => {
        lock=true
        let configPackage = pack ? pack : {}
        let { 
            path,
            selectedData
        } = this.state 
        configPackage["type"] = config.monitorSettingUrlMap[this.props.type]
        // configPackage["id"] = selectedData ? selectedData.id : null
        // configPackage["id"] = this.state.selection  
        path == "setGeofenceConfig" ? configPackage["id"] = selectedData.id : configPackage["id"] =  this.state.selection 
        axios.post(dataSrc[path], {
            monitorConfigPackage: configPackage
        })
        .then(res => {
            setTimeout(
                () => {
                    this.getMonitorConfig(),
                    this.setState({
                        show: false,
                        showDeleteConfirmation: false,
                        selectedData: null, 
                        selection: '',
                        selectAll:false
                    })
                   
                },
                300
            )
        })
        .catch(err => { 
            console.log(err)
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
 
    render() {
        let style = {
            container: {
                minHeight: "100vh"
            },
            type: {
                fontSize: '1rem',
            },
        }
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

        let {
            type
        } = this.props

        let {
            lbeaconsTable,
            isEdited,
        } = this.state

        let { locale } = this.context

        return (
            <div>
                <ButtonToolbar>
                <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        name="add rule"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.ADD_RULE}
                    </Button>
                    <Button 
                        variant="outline-primary" 
                        className='mr-2 mb-1'
                        name="delete"
                        onClick={this.handleClickButton} 
                    >
                        {locale.texts.DELETE}
                    </Button>
                </ButtonToolbar>
                <SelectTable
                    keyField='id'
                    data={this.state.data}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)}
                    className="-highlight"
                    minRows={0}
                 
                    {...extraProps}
                    {...styleConfig.reactTable}
                    getTrProps={(state, rowInfo, column, instance) => {   
                          return {
                              onClick: (e, handleOriginal) => {  
                                   this.setState({
                                    show: true,
                                    selectedData: rowInfo.row._original,
                                    isEdited: true,
                                    path: 'setGeofenceConfig'
                                })  
                          }
                      }}
                    }
                />
            
                <EditGeofenceConfig
                    handleShowPath={this.props.handleShowPath} 
                    selectedData={this.state.selectedData}
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    title={isEdited ? 'edit geofence config' : 'add geofence config'}
                    type={config.monitorSettingUrlMap[this.props.type]} 
                    handleSubmit={this.handleSubmit}
                    lbeaconsTable={lbeaconsTable}
                    areaOptions={config.mapConfig.areaOptions}
                    isEdited={this.state.isEdited}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default GeoFenceSettingBlock
 