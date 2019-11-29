import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
    Container
} from "react-bootstrap"
import TimePicker from 'react-bootstrap-time-picker';
import Switcher from "../Switcher";
import TimePickerWrap from "../TimePickerWrap"
import axios from "axios"
import dataSrc from "../../../dataSrc"
import moment from "moment"
import config from "../../../config"
import DateTimePicker from '../DateTimePicker';

class MonitorSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        time: 0,
        startTime: "15",
        endTime : "0",
        enable: 0,
        type: config.monitorSettingUrlMap[this.props.title]
    }

    componentDidMount = () => {

        axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[this.props.title]
        })
        .then(res => {
            let { 
                enable,
                start_time,
                end_time
            } = res.data.rows[0]

            // start_time = moment(start_time, 'HH:mm:ss').format('HH:mm')
            // end_time = moment(end_time, 'HH:mm:ss').format('HH:mm')

            start_time = `${start_time.split(':')[0]}:00`
            end_time = `${end_time.split(':')[0]}:00`

            this.setState({
                enable,
                startTime: start_time,
                endTime: end_time
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    handleTimeChange = (time, name) => {
        let configPackage = {
            ...this.state,
            startTime: name == 'start' ? time.value : this.state.startTime,
            endTime: name == 'end' ? time.value : this.state.endTime,
        }
        this.setState(configPackage);

        axios.post(dataSrc.setMonitorConfig, {
            configPackage
        })
        .then(res => {
            this.setState(configPackage);
        })
        .catch(err => { 
            console.log(err)
        })
    }
    
    handleSwitcherChange = (e) => {

        let target = e.target
        let configPackage = {
            ...this.state,
            enable: target.value
        }

        this.setState({
            enable: target.value
        })

        axios.post(dataSrc.setMonitorConfig, {
            configPackage
        })
        .then(res => {
            this.setState({ 
                enable: target.value
            });

        })
        .catch(err => { 
            console.log(err)
        })
    }


    render() {
        let style = {
            container: {
                minHeight: "100vh"
            }
        }
        let {
            title
        } = this.props
        let { locale } = this.context

        let adjustedStartTime = parseInt(this.state.startTime.split(':')[0]) + 1

        return (
            <Row className="my-3">
                <Col xl={9}>
                    <h5>
                        {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                    </h5>
                    <Row 
                        className="my-4"
                        noGutters
                    >
                        <Col
                            className="d-flex justify-content-around"
                            xl={6}
                        >
                            <Col 
                                className="d-flex align-items-center justify-content-center px-0"                                
                                xl={4}
                            >
                                <div>                                
                                    {locale.texts.ENABLE_START_TIME}:
                                </div>
                            </Col>
                            <Col 
                                className=""                                
                                xl={8}
                            >
                                <DateTimePicker
                                    value={this.state.startTime}
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
                                className="d-flex align-items-center justify-content-center px-0"                                
                                xl={4}
                            >
                                <div>                                
                                    {locale.texts.ENABLE_END_TIME}:
                                </div>
                            </Col>
                            <Col 
                                className=""                                
                                xl={8}
                            >
                                <DateTimePicker
                                    value={this.state.endTime}
                                    getValue={this.handleTimeChange}
                                    name="end"
                                    start={adjustedStartTime}
                                    end="24"
                                />
                            </Col>
                        </Col>
                    </Row>
                </Col>
                <Col xl={3} className="d-flex justify-content-end">
                    <Switcher
                        leftLabel="on"
                        rightLabel="off"
                        onChange={this.handleSwitcherChange}
                        status={this.state.enable}
                        title={this.props.title}
                        id={this.props.title}
                    />
                </Col>
            </Row>
        )
    }
}

export default MonitorSettingBlock