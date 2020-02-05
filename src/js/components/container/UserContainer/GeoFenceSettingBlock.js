import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
    ButtonToolbar,
    Button
} from "react-bootstrap"
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import ReactTable from 'react-table'
import { geofenceConfigColumn } from '../../../tables'
import EditGeofenceConfig from '../EditGeofenceConfig'
import retrieveData from '../../../helper/retrieveData'
import styleConfig from '../../../styleConfig';


class GeoFenceSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        lbeaconsTable: [],
        selectedArea: null,
        selectedBeacon: null,
        selectedData: null,
        show: false,
        locale: this.context.locale.abbr,        
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
            columns.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.rows.map(item => {
                item.area_id = locale.texts[config.mapConfig.areaOptions[item.area_id]]
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

    handleClickButton = (e) => {
        let { name } = e.target
        switch(name) {
            case "add rule": 
                this.setState({
                    show: true
                })
                break;
        }
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    handleSubmit = (monitorConfigPackage) => {
        axios.post(dataSrc.setMonitorConfig, {
            monitorConfigPackage
        })
        .then(res => {
            setTimeout(
                () => {
                    this.getMonitorConfig(),
                    this.setState({
                        show: false
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
                fontWeight: 600,
                fontSize: '1.3rem',
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
            lbeaconsTable
        } = this.state

        let { locale } = this.context

        return (
            <div>
                <Row className="my-3">
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
                    getTrProps= {(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {
                                this.setState({
                                    show: true,
                                    selectedData: rowInfo.original
                                })
                            },
                        }
                    }}
                />
                <EditGeofenceConfig
                    handleShowPath={this.props.handleShowPath} 
                    selectedData={this.state.selectedData}
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    title={'edit geofence config'}
                    type={config.monitorSettingUrlMap[this.props.type]} 
                    handleSubmit={this.handleSubmit}
                    lbeaconsTable={lbeaconsTable}
                />
            </div>
        )
    }
}

export default GeoFenceSettingBlock
 