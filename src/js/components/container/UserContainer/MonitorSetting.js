import React from 'react';
import { AppContext } from '../../../context/AppContext';
import MonitorSettingBlock from './MonitorSettingBlock';
import GeoFenceSettingBlock from './GeoFenceSettingBlock'
import { Container } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import config from '../../../config';

class MonitorSetting extends React.Component{

    static contextType = AppContext

    state = {
        tabIndex: 0
    }

    render() {
        let {
            locale
        } = this.context

        let tabs = [
            config.monitorSettingType.MOVEMENT_MONITOR,
            config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
            config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
            config.monitorSettingType.GEOFENCE_MONITOR
        ]
        return (
            <Container className='py-2 text-capitalize'>
                <Tabs 
                    selectedIndex={this.state.tabIndex} 
                    className="w-100"
                    onSelect={tabIndex => {
                        this.setState({ 
                            tabIndex
                        })
                    }}
                >
                    <TabList>
                        {tabs.map(tab => {
                            return (
                                <Tab
                                    key={tab}
                                >
                                    {locale.texts[tab.toUpperCase().replace(/ /g, '_')]}
                                </Tab>
                            )
                        })}

                    </TabList>
                    {tabs.map((tabPanel, index) => {
                        return (
                            <TabPanel 
                                key={index}
                        >
                                {index == 3 
                                    ?   <GeoFenceSettingBlock
                                            type={tabPanel}
                                        />
                                    :   <MonitorSettingBlock
                                            type={tabPanel}
                                        />
                                }
                            </TabPanel>
                        )
                    })}
                </Tabs>
            </Container>
        )
    }
}

export default MonitorSetting