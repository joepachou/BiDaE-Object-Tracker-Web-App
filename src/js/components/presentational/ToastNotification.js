import React from 'react'
import { AppContext } from '../../context/AppContext';
import moment from 'moment'
import config from '../../config'

const ToastNotification = ({
    data
}) => {

    const { locale }= React.useContext(AppContext);
    
    return (
        <div>
            {data.name} {data.location_description} {moment(data.violation_timestamp).format(config.geoFenceViolationTimeFormat)}
        </div>
    )
}

export default ToastNotification