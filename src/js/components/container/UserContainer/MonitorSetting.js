import React from 'react';
import { AppContext } from '../../../context/AppContext';
import MonitorSettingBlock from './MonitorSettingBlock';
import GeoFenceSettingBlock from './GeoFenceSettingBlock'
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
            <div style={style.container} className="px-0 text-capitalize">
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_MOVEMENT_MONITOR}
                />
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_LONG_STAY_IN_DANGER}
                />
                <MonitorSettingBlock
                    title={config.monitorSettingType.RESIDENT_NOT_STAY_ROOM}
                />
                <GeoFenceSettingBlock
                    title={config.monitorSettingType.GEO_FENCE_VIOLENCE}
                />
            </div>
        )

    }
}

export default MonitorSetting