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
        let style = {
            container: {
                minHeight: "100vh"
            }
        }
        let tabs = [
            config.monitorSettingType.MOVEMENT_MONITOR,
            config.monitorSettingType.LONG_STAY_IN_DANGER_MONITOR,
            config.monitorSettingType.NOT_STAY_ROOM_MONITOR,
            // config.monitorSettingType.GEOFENCE_MONITOR
        ]
        return (
            <Container className='py-2 text-capitalize' fluid>
                <Tabs 
                    selectedIndex={this.state.tabIndex} 
                    onSelect={tabIndex => this.setState({ tabIndex })}
                >
                    <TabList>
                        {tabs.map(tab => {
                            console.log(tab)
                            return (
                                <Tab
                                    key={tab}
                                >
                                    {locale.texts[tab.toUpperCase().replace(/ /g, '_')]}
                                </Tab>
                            )
                        })}

                    </TabList>
                    {tabs.map(tabPanel => {
                        return (
                            <TabPanel>
                                <MonitorSettingBlock
                                    type={tabPanel}
                                />
                            </TabPanel>
                        )
                    })}

                    {/* <TabPanel>
                        <MonitorSettingBlock
                            type={config.monitorSettingType.RESIDENT_MOVEMENT_MONITOR}
                        />
                    </TabPanel>
                    <TabPanel>
                        <MonitorSettingBlock
                            type={config.monitorSettingType.RESIDENT_LONG_STAY_IN_DANGER}
                        />
                    </TabPanel>
                    <TabPanel>
                        <MonitorSettingBlock
                            type={config.monitorSettingType.RESIDENT_NOT_STAY_ROOM}
                        /> 
                    </TabPanel>
                    <TabPanel>
                        <GeoFenceSettingBlock
                            type={config.monitorSettingType.GEO_FENCE_VIOLENCE}
                        />
                    </TabPanel> */}
                </Tabs>

            </Container>
        )

    }
}

export default MonitorSetting