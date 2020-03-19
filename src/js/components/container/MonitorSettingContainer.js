import React from 'react';
import { AppContext } from '../../context/AppContext';
import MonitorSettingBlock from './UserContainer/MonitorSettingBlock';
import GeoFenceSettingBlock from './UserContainer/GeoFenceSettingBlock'
import config from '../../config';
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import {
    isBrowser
} from 'react-device-detect'
import { 
    Tab, 
    ListGroup,
    Container
} from 'react-bootstrap';

const style = {

    sidenav: {
        width: 150,
    },
    sidemain:{
        marginLeft: 150
    },
    container: {
        overflowX: 'hide'
    },
}

class MonitorSetting extends React.Component{

    static contextType = AppContext

    state = {
        tabIndex: 0,
        areaTable: [],
    }

    tabList = [
        {
            name: config.monitorSettingType.MOVEMENT_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
            component: (props) => <MonitorSettingBlock {...props}/>
        },
        {
            name: config.monitorSettingType.GEOFENCE_MONITOR,
            component: (props) => <GeoFenceSettingBlock {...props}/>
        },
    ]

    defaultActiveKey = "movement_monitor"

    componentDidMount = () => {
        this.getAreaTable()
    }

    getAreaTable = () => {
        retrieveDataHelper.getAreaTable()
            .then(res => {
                this.setState({
                    areaTable: res.data.rows
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    render() {
        let {
            locale
        } = this.context

        return (
            <Container 
                fluid 
                className="mt-5 text-capitalize"
                style={style.container}
            >     
                <Tab.Container 
                    transition={false} 
                    defaultActiveKey={this.defaultActiveKey}
                    className='mt-5' 
                >
                    <div 
                        className="border-0 BOTsidenav"
                        style={style.sidenav}
                    >            
                        <ListGroup 
                            variant="flush" 
                            className="border-0"
                        >
                            {this.tabList.map((tab, index) => {
                                return (
                                    <ListGroup.Item 
                                        key={index}
                                        className="border-0 m-0 my-1" 
                                        eventKey={tab.name.replace(/ /g, '_')}
                                        action
                                    >
                                        {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                                    </ListGroup.Item>
                                )
                            })}  
                        </ListGroup>      
                                      
                    </div>
                    <div
                        className="BOTsidemain"
                        style={style.sidemain}
                    >           
                        <Tab.Content>
                            {this.tabList.map((tab, index) => {
                                let props = {
                                    type: tab.name,
                                    areaTable: this.state.areaTable
                                }
                                return (
                                    <Tab.Pane 
                                        eventKey={tab.name.replace(/ /g, '_')}
                                        key={tab.name.replace(/ /g, '_')}
                                    >
                                        <div
                                            className='h5'
                                        >
                                            {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                                        </div>
                                        {tab.component(props)}
                                    </Tab.Pane>
                                )
                            })}
                        </Tab.Content>         
                    </div>
                </Tab.Container>
            </Container>
        )
    }
}

export default MonitorSetting