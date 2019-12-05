import React from 'react';
import { AppContext } from '../../../context/AppContext';
import { 
    Row, 
    Col, 
    Container
} from "react-bootstrap"
import MonitorSettingBlock from './MonitorSettingBlock';
import config from '../../../config';

class MonitorSetting extends React.Component{

    static contextType = AppContext

    render() {
        let style = {
            container: {
                minHeight: "100vh"
            }
        }
        return (
            <Container style={style.container} className="px-0 text-capitalize">
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_MOVEMENT_MONITOR}
                />
                <hr />
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_LONG_STAY_IN_DANGER}
                />
                <hr />
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_NOT_STAY_ROOM}
                    name="what's"
                />
                <hr />
               
            </Container>
        )

    }
}

export default MonitorSetting