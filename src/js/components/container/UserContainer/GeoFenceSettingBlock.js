import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
    ButtonToolbar,
} from "react-bootstrap"
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import ReactTable from 'react-table'
import { geofenceConfigColumn } from '../../../tables'
import EditGeofenceConfig from '../EditGeofenceConfig'
import retrieveData from '../../../helper/retrieveData'
import styleConfig from '../../../styleConfig';
import { Menu, Icon, Button, Table } from 'antd';
const { SubMenu } = Menu;
import DeleteConfirmationForm from '../DeleteConfirmationForm'


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
        path: ''     
    }

    componentDidMount = () => {
        this.getMonitorConfig()
        this.getLbeaconTable()

    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getMonitorConfig()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }
    getLbeaconTable = () => {
        let { locale } = this.context
        retrieveData.getLbeaconTable(locale.abbr)
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
        axios.post(dataSrc.getGeoFenceConfig, {
            type: config.monitorSettingUrlMap[this.props.type],
            areasId: auth.user.areas_id
        })
        .then(res => {
            let columns = _.cloneDeep(geofenceConfigColumn)

            columns.push({
                Header: "action",
                minWidth: 60,
                Cell: props => (
                    <div>
                        <a 
                            name="edit"
                            style={styleConfig.link}
                            onClick={(e) => {
                                this.handleClickButton(e, props)
                        }} >
                            {locale.texts.EDIT}
                        </a>
                        &nbsp;
                        <a 
                            name="delete"
                            style={styleConfig.link}
                            onClick={(e) => {
                                this.handleClickButton(e, props)
                        }} >
                            {locale.texts.DELETE}
                        </a>
                    </div>
                )
            })
            columns.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.title = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                field.dataIndex = field.Header
                field.key = field.Header  
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            
            res.data.rows.map((item,index) => {
                item.key=index + 1
                item.area = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                    id: item.area_id
                }
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

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null,
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

    render() {
        let style = {
            container: {
                minHeight: "100vh"
            },
            type: {
                // fontWeight: 600,
                fontSize: '1rem',
            },
            subtype: {
                color: "#6c757d",
                fontWeight: 500,
                fontSize: '1.2rem',
            },
            hr: {
                width: "95%"
            }
        }
        let {
            type
        } = this.props

        let {
            lbeaconsTable,
            isEdited,
            current
        } = this.state

        let { locale } = this.context

        return (
            <div>
                <Row>
                    <Col>
                        <div style={style.type}>
                            {locale.texts[type.toUpperCase().replace(/ /g, '_')]}
                        </div>
                    </Col>
                </Row>
                <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className='text-capitalize mr-2 mb-1'
                        name="add rule"
                        onClick={this.handleClickButton}
                    >
                        Add rule
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
                    // getTrProps= {(state, rowInfo, column, instance) => {
                    //     return {
                    //         onClick: (e) => {
                    //             this.setState({
                    //                 show: true,
                    //                 selectedData: rowInfo.original,
                    //                 isEdited: true,
                    //                 path: 'setMonitorConfig'
                    //             })
                    //         },
                    //     }
                    // }}
                />
                {/* <Table 
                    dataSource={this.state.data}
                    columns={this.state.columns}
                /> */}
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
                    type={config.monitorSettingUrlMap[this.props.type]} 
                />
            </div>
        )
    }
}

export default GeoFenceSettingBlock
 