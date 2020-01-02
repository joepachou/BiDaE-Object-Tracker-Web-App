import React from 'react'


import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { Navbar, Nav, NavDropdown, Image, Dropdown  } from 'react-bootstrap'
import axios from 'axios';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext'
import dataSrc from '../../dataSrc'

class BatteryLevelNotification extends React.Component {
    static contextType = AppContext
    state = {
        count:0,
        runOutPowerItems: []
    }

    componentDidMount = () => {
        this.getTrackingData();
        this.interval = setInterval(this.getTrackingData, 1000)
    }
    getTrackingData = () => {
        let { auth, locale, stateReducer } = this.context
        let [{areaId, violatedObjects}, dispatch] = stateReducer
        axios.post(dataSrc.getTrackingData,{
            rssiThreshold: -50,
            locale: locale.abbr,
            user: auth.user,
            areaId,
        })
        .then(res => {
            this.setState({
                runOutPowerItems: res.data.filter(item => item.battery_voltage == 2)
            })
        })
    }


    render() {
        const {runOutPowerItems} = this.state
        let container = {
            height: '50px',
            width: '50px',
            display: 'inline-block',
            margin: '5px',
            backgroundColor: 'gray'
        }

        let title = {
            width: '100px'
        }
        return (
            <NavDropdown title={<i className="fas fa-bell" style={{fontSize: '20px'}}><NotificationBadge count={runOutPowerItems.length} effect={Effect.SCALE}/></i>}id="collasible-nav-dropdown" alignRight>
                {runOutPowerItems.map(item => {
                    return (
                            <NavDropdown.Item key = {item.mac_address}>
                                name: {item.name}, type: {item.type},MAC address: {item.mac_address}
                            </NavDropdown.Item>
                        )
                })}
            </NavDropdown> 
            
        )
    }
};
export default BatteryLevelNotification