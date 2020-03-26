import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    ButtonToolbar,
    Button
} from "react-bootstrap"
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import ReactTable from 'react-table';
import styleConfig from '../../../styleConfig';
import EditMonitorConfigForm from '../../presentational/EditMonitorConfigForm';
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { monitorConfigColumn } from '../../../tables'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
const SelectTable = selecTableHOC(ReactTable);
class MonitorSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        path: '',
        areaOptions: [],
        isEdited: false,
        selection: [],
        selectAll: false,
        exIndex : 9999,
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => { 
        this.getMonitorConfig()
    }
 
 
    getMonitorConfig = () => { 
        let { 
            auth,
            locale
        } = this.context 
        axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[this.props.type],
            areasId: auth.user.areas_id,
            roles:auth.user.roles
        })
        .then(res => { 
            let columns = _.cloneDeep(monitorConfigColumn)

            columns.push({
                Header: "action",
                minWidth: 60,
                Cell: props => (
                    <div className="d-flex justify-content-start">
                        {['edit'  ].map((item, index, original) => {
                            return  ( 
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
                                    {/* {index < original.length - 1
                                        ? <div className="mx-1">|</div>
                                        : ""
                                    } */}
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
            res.data.map((item,index) => {
                item.area = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                    id: item.area_id
                }
            }) 
            let areaOptions = auth.user.areas_id
                .filter(id => {
                    return Object.keys(config.mapConfig.areaOptions).includes(id) 
                        && !res.data.map(item => item.area_id).includes(id)
                })
                .reduce((options, id) => {
                    options.push({
                        value: config.mapConfig.areaOptions[id],
                        label: locale.texts[config.mapConfig.areaOptions[id]],
                        id,
                    })
                    return options
                }, []) 
            this.setState({
                data: res.data,
                columns,
                areaOptions
            })
            

        })
        .catch(err => {
            console.log(err)
        })
    }

    handleSubmit = (pack) => {
        let configPackage = pack ? pack : {}
        let { 
            path,
            selectedData
        } = this.state 
        configPackage["type"] = config.monitorSettingUrlMap[this.props.type]
        // configPackage["id"] = selectedData ? selectedData.id : null;
        // configPackage["id"] = this.state.selection  
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

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null,
            selection: '',
            selectAll:false
        })
    }

 
    handleClickButton = (e, value) => {
        let { name } = e.target   
        switch(name) {
            case "add rule": 
                this.setState({
                    show: true,
                    isEdited: false,
                    path: 'addMonitorConfig'
                })
                break;
            case "edit":
                this.setState({
                    show: true,
                    selectedData: value.original,
                    isEdited: true,
                    path: 'setMonitorConfig'
                })
                break;
            case "delete":
                this.setState({
                    showDeleteConfirmation: true,
                    path: 'deleteMonitorConfig', 
                })
                break;
        }
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


    componentDidUpdate = (prevProps, prevState) =>{ 
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

    render() {
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
            locale 
        } = this.context

        let {
            type
        } = this.props

        let {
            areaOptions,
            isEdited
        } = this.state
 
        let title = `edit ${type}`.toUpperCase().replace(/ /g, '_')
        return ( 
            <div>  
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='mr-2 mb-1'
                        name="add rule"
                        onClick={this.handleClickButton}
                        // disabled={areaOptions.length == 0}
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
                    getTrProps={(state, rowInfo, column, instance) => {   
                          return {
                              onClick: (e, handleOriginal) => { 
                                  this.setState({ 
                                    show: true,
                                    selectedData: rowInfo.row._original,
                                    isEdited: true,
                                    path: 'setMonitorConfig'
                                })
                              }
                          }
                      }}
                />
                <EditMonitorConfigForm
                    handleShowPath={this.props.handleShowPath} 
                    selectedData={this.state.selectedData}
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    title={title}
                    type={config.monitorSettingUrlMap[this.props.type]} 
                    handleSubmit={this.handleSubmit}
                    areaOptions={this.state.areaOptions}
                    isEdited={isEdited}
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

export default MonitorSettingBlock