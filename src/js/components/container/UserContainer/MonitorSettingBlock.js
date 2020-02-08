import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
    ButtonToolbar,
    Button
} from "react-bootstrap"
import Switcher from "../Switcher";
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import DateTimePicker from '../DateTimePicker';
import ReactTable from 'react-table';
import styleConfig from '../../../styleConfig';
import EditMonitorConfigForm from '../EditMonitorConfigForm';
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { monitorConfigColumn } from '../../../tables'

class MonitorSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        path: '',
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
            areasId: auth.user.areas_id
        })
        .then(res => {
            let columns = _.cloneDeep(monitorConfigColumn)

            columns.push({
                Header: "action",
                minWidth: 60,
                Cell: props => (
                    <div className="d-flex justify-content-start">
                        {['edit', 'delete'].map((item, index, original) => {
                            return  ( 
                                <div key={item}>
                                    <a 
                                        name={item}
                                        style={styleConfig.link}
                                        onClick={(e) => {
                                            this.handleClickButton(e, props)
                                    }} >
                                        {locale.texts[item.toUpperCase()]}
                                    </a>
                                    {index < original.length - 1
                                        ? <div className="ant-divider ant-divider-vertical" />
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
            
            res.data.map((item,index) => {
                item.key=index + 1
                item.area = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                    id: item.area_id
                }
            })
            console.log(res.data)

            this.setState({
                data: res.data,
                columns,
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
        configPackage["id"] = selectedData.id
        console.log(configPackage)
        console.log(path)
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
                    })
                },
                300
            )
        })
        .catch(err => { 
            console.log(err)
        })
    }


    // handleTimeChange = (time, name, id) => {

    //     let endTime = name == 'end' ? time.value : this.state.data[id].end_time;
    //     let startTime = name == 'start' ? time.value : this.state.data[id].start_time;
    //     if (name == 'start' && endTime.split(':')[0] <= startTime.split(':')[0]) {
    //         endTime = [parseInt(startTime.split(':')[0]) + 1, endTime.split(':')[1]].join(':')
    //     }
        
    //     let monitorConfigPackage = {
    //         type: config.monitorSettingUrlMap[this.props.type],
    //         ...this.state.data[id],
    //         start_time: startTime,
    //         end_time: endTime
    //     }
    //     axios.post(dataSrc.setMonitorConfig, {
    //         monitorConfigPackage
    //     })
    //     .then(res => {
    //         this.setState({
    //             data: {
    //                 ...this.state.data,
    //                 [id]: monitorConfigPackage
    //             }
    //         })
    //     })
    //     .catch(err => { 
    //         console.log(err)
    //     })
    // }
    
    // handleSwitcherChange = (e) => {
    //     let target = e.target
    //     let id = target.id.split(':')[1]

    //     let monitorConfigPackage = {
    //         type: config.monitorSettingUrlMap[this.props.type],
    //         ...this.state.data[id],
    //         enable: parseInt(target.value)
    //     }

    //     axios.post(dataSrc.setMonitorConfig, {
    //         monitorConfigPackage
    //     })
    //     .then(res => {
    //         this.setState({
    //             data: {
    //                 ...this.state.data,
    //                 [id]: monitorConfigPackage
    //             }
    //         })
    //     })
    //     .catch(err => { 
    //         console.log(err)
    //     })
    // }

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null,
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
                    selectedData: value.original,
                    path: 'deleteMonitorConfig'
                })
                break;
        }
    }


    render() {
        let style = {
            container: {
                minHeight: "100vh"
            },
            type: {
                fontWeight: 600,
                fontSize: '1.2rem',
            },
            subtype: {
                color: "#6c757d",
                fontSize: '1.2rem',
            },
            hr: {
                width: "95%"
            }
        }
        let {
            type
        } = this.props
        let { locale } = this.context

        return (
            <div>
                <div style={style.type} className="mb-4">
                    {locale.texts[type.toUpperCase().replace(/ /g, '_')]}
                </div>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        name="add rule"
                        onClick={this.handleClickButton}
                    >
                        {locale.texts.ADD_RULE}
                    </Button>
                </ButtonToolbar>
                <ReactTable
                    keyField='id'
                    data={this.state.data}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)}
                    className="-highlight"
                    minRows={0}
                    {...styleConfig.reactTable}
                />
                <EditMonitorConfigForm
                    handleShowPath={this.props.handleShowPath} 
                    selectedData={this.state.selectedData}
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    title={'test'}
                    type={config.monitorSettingUrlMap[this.props.type]} 
                    handleSubmit={this.handleSubmit}
                    areaOptions={config.mapConfig.areaOptions}
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