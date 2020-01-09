import React from 'react'


import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { NavDropdown, Row  } from 'react-bootstrap'
import axios from 'axios';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext'
import dataSrc from '../../dataSrc'
import config from '../../config'
import { getDescription } from '../../helper/descriptionGenerator'

class BatteryLevelNotification extends React.Component {
    
    static contextType = AppContext
    
    state = {
        count:0,
        runOutPowerItems: [],
        locale: this.context.locale.abbr,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getTrackingData()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    }

    componentDidMount = () => {
        this.getTrackingData();
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

        let { locale } = this.context

        const style = {
            list: {
                wordBreak: 'keep-all',
                zIndex: 1,
                overFlow: 'hidden scroll'
            },
            dropdown: {
                overflow: 'hidden scroll',
                maxHeight: '300px',
            }
        }

        return (
            <NavDropdown 
                id="collasible-nav-dropdown"
                alignRight
                title={
                    <i className="fas fa-bell" style={{fontSize: '20px'}}>
                        <NotificationBadge 
                            count={runOutPowerItems.length} 
                            effect={Effect.SCALE}
                        />
                    </i>
                }
            >
                <div style={style.dropdown}>
                    
                    {runOutPowerItems.map(item => {
                        return (
                            <NavDropdown.Item 
                                key={item.mac_address}
                            >
                                <Row>
                                    <div 
                                        className='d-inline-flex justify-content-start text-left' 
                                        style={style.list}
                                    >   
                                        {/* {selection.indexOf(item.mac_address) >= 0 
                                            ? <i className="fas fa-check mx-2 py-1" style={style.icon}></i> 
                                            : config.mapConfig.iconOptions.showNumber
                                                ?   <p className='d-inline-block mx-2'>{index + 1}.</p>
                                                :   <p className='d-inline-block mx-2'>&#9642;</p>
                                        } */}
                                        {getDescription(item, locale, config)}
                                    </div>
                                </Row>
                            </NavDropdown.Item>
                        )
                    })}
                </div>
            </NavDropdown> 
            
        )
    }
};
export default BatteryLevelNotification