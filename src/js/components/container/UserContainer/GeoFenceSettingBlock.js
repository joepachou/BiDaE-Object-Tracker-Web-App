import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
} from "react-bootstrap"
import Switcher from "../Switcher";
import axios from "axios"
import dataSrc from "../../../dataSrc"
import config from "../../../config"
import DateTimePicker from '../DateTimePicker';
import AreaPicker from './AreaPicker';
import LBeaconPicker from './LBeaconPicker';


class GeoFenceSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.title],
        data: [],
        selectedArea: null,
        selectedBeacon: null
    }

    componentDidMount = () => {
        let { auth } = this.context
        axios.post(dataSrc.getGeoFenceConfig, {
            type: config.monitorSettingUrlMap[this.props.title],
            areasId: auth.user.areas_id
        })
        .then(res => {

            this.setState({
                data: res.data.rows,
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    handleTimeChange = (time, name, rule_id) => {

        let endTime = name == 'end' ? time.value : this.state.data[rule_id].end_time;
        let startTime = name == 'start' ? time.value : this.state.data[rule_id].start_time;
        if (name == 'start' && endTime.split(':')[0] <= startTime.split(':')[0]) {
            endTime = [parseInt(startTime.split(':')[0]) + 1, endTime.split(':')[1]].join(':')
        }

        let geofenceConfigPackage = {
            ...this.state.data[rule_id],
            start_time: startTime,
            end_time: endTime
        }
        axios.post(dataSrc.setGeoFenceConfigRows, geofenceConfigPackage)
        .then(res => {
            this.setState({
                data: {
                    ...this.state.data,
                    [rule_id]: geofenceConfigPackage
                }
            })
        })
        .catch(err => { 
            console.log(err)
        })
    }
    
    handleSwitcherChange = (e) => {
        let target = e.target
        let id = target.id.split(':')[1]

        let monitorConfigPackage = {
            ...this.state.data[id],
            enable: parseInt(target.value)
        }

        axios.post(dataSrc.setMonitorConfig, {
            monitorConfigPackage
        })
        .then(res => {
            this.setState({
                data: {
                    ...this.state.data,
                    [id]: monitorConfigPackage
                }
            })
        })
        .catch(err => { 
            console.log(err)
        })
    }
    sendToBackEnd = (rule) => {

        for(var i in rule.perimeters['uuids']){

            if (Array.isArray(rule.perimeters['uuids'][i])){
                rule.perimeters['uuids'][i] = rule.perimeters['uuids'][i].join('')
            }
        }
        axios.post(dataSrc.setGeoFenceConfigRows, rule)
            .then(res => {
                this.setState({})
            })
            .catch(err => { 
                console.log(err)
        })
    }
    handleAreaSelect = (area, rule_id) => {
        this.state.data[rule_id]['area_id'] = area['value']

        this.sendToBackEnd(this.state.data[rule_id])
    }
    handleBeaconSelect = (beacon, rule_id, beacon_id) => {
        this.state.data[rule_id].perimeters['uuids'][beacon_id] = beacon.uuid.replace(/-/g, '');
        this.sendToBackEnd(this.state.data[rule_id])
        
    }
    render() {
        let style = {
            container: {
                minHeight: "100vh"
            },
            title: {
                fontWeight: 600,
                fontSize: '1.3rem',
            },
            subTitle: {
                color: "#6c757d",
                fontWeight: 500,
                fontSize: '1.2rem',
            },
            hr: {
                width: "95%"
            }
        }
        let {
            title
        } = this.props
        let { locale } = this.context
        return (
            <div>
                {Object.keys(this.state.data).length !== 0 
                    ?   <>
                            <Row className="my-3">
                                <Col>
                                    <div style={style.title}>
                                        {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                                    </div>
                                </Col>
                            </Row>
                            {Object.values(this.state.data).map((item,index) => {
                                return  (
                                    <div key={index}>
                                        {index > 0 && <hr style={style.hr}/>}
                                        <Row
                                            className="mx-4"
                                        >
                                            <Col xl={9}>
                                                <div style={style.subTitle}>
                                                    {
                                                        // config.mapConfig.areaOptions[item.area_id] 
                                                        // ?   locale.texts[config.mapConfig.areaOptions[item.area_id]]
                                                        // :   null
                                                    }
                                                    監控時間
                                                </div>
                                                <Row 
                                                    className="my-3"
                                                    noGutters
                                                >
                                                    <Col
                                                        className="d-flex justify-content-around"
                                                        xl={6}
                                                    >
                                                        <Col 
                                                            className="d-flex align-items-center justify-content-start px-0"                                
                                                            xl={3}
                                                        >
                                                            <div>                                
                                                                {locale.texts.ENABLE_START_TIME}:
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <DateTimePicker
                                                                id={index}
                                                                value={item.start_time}
                                                                getValue={this.handleTimeChange}
                                                                name="start"
                                                                start="0"
                                                                end="23"
                                                            />

                                                        </Col>
                                                    </Col>
                                                    <Col
                                                        className="d-flex justify-content-around"
                                                        xl={6}
                                                    >
                                                        <Col 
                                                            className="d-flex align-items-center justify-content-start px-0"                                
                                                            xl={3}
                                                        >
                                                            <div>                                
                                                                {locale.texts.ENABLE_END_TIME}:
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <DateTimePicker
                                                                id={index}
                                                                value={item.end_time}
                                                                getValue={this.handleTimeChange}
                                                                name="end"
                                                                start={parseInt(item.start_time.split(':')[0]) + 1}
                                                                end="24"
                                                            />
                                                        </Col>
                                                    </Col>
                                                </Row>
                                                <Row 
                                                    className="my-3"
                                                    noGutters
                                                >
                                                    <Col
                                                        className="d-flex justify-content-around"
                                                        xl={6}
                                                    >
                                                        <Col 
                                                            className="d-flex align-items-center justify-content-start px-0"                                
                                                            xl={3}
                                                        >
                                                            <div>      
                                                                地點:                         
                                                                {
                                                                    // locale.texts.ENABLE_START_TIME
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <AreaPicker
                                                                id={index}
                                                                value={item.start_time}
                                                                area_id = {item.area_id}
                                                                getValue={this.handleAreaSelect}
                                                                name="start"
                                                            />

                                                        </Col>
                                                    </Col>
                                                    <Col
                                                        className="d-flex justify-content-around"
                                                        xl={6}
                                                    >
                                                        <Col 
                                                            className="d-flex align-items-center justify-content-start px-0"                                
                                                            xl={3}
                                                        >
                                                            <div>                                
                                                               {
                                                                // {locale.texts.ENABLE_END_TIME}:
                                                            }
                                                            Beacon:
                                                            </div>
                                                        </Col>
                                                        <Col 
                                                            className=""                                
                                                            xl={9}
                                                        >
                                                            <Row 
                                                                className="w-100 p-0 m-0"
                                                            >
                                                            {
                                                                item.perimeters['uuids'].map((beacon, beacon_index) => {
                                                                    return (
                                                                        <Col 
                                                                            className="p-0 m-0"                                
                                                                            xl={12}
                                                                            key={beacon}
                                                                        >
                                                                            <LBeaconPicker
                                                                                area={item['area_id']}
                                                                                id={index}
                                                                                beacon_id={beacon_index}
                                                                                value={beacon}
                                                                                getValue={this.handleBeaconSelect}
                                                                            />
                                                                        </Col>
                                                                    )
                                                                    
                                                                })
                                                            }

                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={3} className="d-flex justify-content-end">
                                                <Switcher
                                                    leftLabel="on"
                                                    rightLabel="off"
                                                    onChange={this.handleSwitcherChange}
                                                    status={item.enable}
                                                    title={this.props.title}
                                                    subId={item.id}
                                                />
                                            </Col>

                                        </Row>
                                    </div>
                                )
                            })}
                            <hr />
                        </>
                    :   null
                }
            </div>
        )
    }
}

export default GeoFenceSettingBlock
                                                            // <Button><i className="fas fa-plus-circle" style={{fontSize: '30px'}}></i>
// 