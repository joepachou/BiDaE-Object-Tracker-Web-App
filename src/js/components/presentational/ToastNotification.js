import React from 'react'
import { AppContext } from '../../context/AppContext';
import moment from 'moment'
import config from '../../config'

const ToastNotification = ({
    data,
    time,
    type
}) => {
    const { locale }= React.useContext(AppContext);
    return (
        <div>
            {data.name} {config.monitorType[type]} {data.location_description} {moment(time).format(config.geoFenceViolationTimeFormat)}
        </div>
    )
}

export default ToastNotification