/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        trackingDataController.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const dbQueries = require('../db/dbQueries/trackingDataQueries')
const pool = require('../db/dev/connection');
const {
    MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN,
    MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW
} = require('../config/config');

moment.updateLocale('en', {
    relativeTime : MOMENT_LOCALE_RELATIVE_TIME_FORMAT_EN
});

moment.updateLocale('zh-tw', {
    relativeTime : MOMENT_LOCALE_RELATIVE_TIME_FORMAT_TW
});

/** Parse the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
    const area_id = parseInt(lbeacon_uuid.slice(0,4))
    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
    const yy = parseInt(lbeacon_uuid.slice(-8));
    return [yy, xx, area_id];
};

const calculatePosition = (item) => {
    const area_id = parseInt(item.lbeacon_uuid.slice(0,4))
    const xx = item.base_x;
    const yy = item.base_y;

    return [yy, xx, area_id]
};

const getTrackingData = (request, response) => {
    const locale = request.body.locale || 'en'
    let {
        user,
        areaId,
        key
    } = request.body

    /** The user's authenticated area id */
    let userAuthenticatedAreasId= user.areas_id

    /** User interface's current area id */
    const currentAreaId = areaId.toString()

    pool.query(dbQueries.getTrackingData(
        userAuthenticatedAreasId,
        key
    ))        
    .then(res => {
        
        console.log('get tracking data')

        /** Filter the objects that do no belong the area */
        const toReturn = res.rows
        .map((item, index) => {

            /** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
            let lbeacon_coordinate = item.lbeacon_uuid ? parseLbeaconCoordinate(item.lbeacon_uuid) : null;

            item.lbeacon_coordinate = lbeacon_coordinate

            item.currentPosition = item.lbeacon_uuid ? calculatePosition(item) : null;

            let lbeaconAreaId = lbeacon_coordinate ? lbeacon_coordinate[2] : null

            let isLbeaconMatchArea = lbeaconAreaId == currentAreaId

            let isUserSObject = userAuthenticatedAreasId.includes(parseInt(item.area_id))

            /** Flag the object that belongs to the current area or to the user's authenticated area */
            item.isMatchedObject = isUserSObject && isLbeaconMatchArea

            /** Set the boolean if the object's last_seen_timestamp is in the specific time period */
            let isInTheTimePeriod = moment().diff(item.last_reported_timestamp, 'seconds') 
                < process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC;

                /** Set the boolean if its rssi is below the specific rssi threshold  */
            let isMatchRssi = item.rssi > process.env.RSSI_THRESHOLD ? 1 : 0;
            /** Flag the object that satisfied the time period and rssi threshold */
            item.found = isInTheTimePeriod && isMatchRssi 

            /** Set the residence time of the object */
            item.residence_time = item.found 
                ? moment(item.last_seen_timestamp).locale(locale).from(moment(item.first_seen_timestamp)) 
                : item.last_reported_timestamp 
                    ? moment(item.last_reported_timestamp).locale(locale).fromNow()
                    : ""      

            /** Flag the object's battery volumn is limiting */
            if (item.battery_voltage >= parseInt(process.env.BATTERY_VOLTAGE_INDICATOR)                    
                && item.found) {
                    item.battery_indicator = 3;
            } else if (item.battery_voltage < parseInt(process.env.BATTERY_VOLTAGE_INDICATOR) && item.battery_voltage > 0 && item.found) {
                item.battery_indicator = 2;
            } else {
                item.battery_indicator = 0
            }

            /** Delete the unused field of the object */
            delete item.first_seen_timestamp
            // delete item.last_seen_timestamp
            delete item.panic_violation_timestamp
            delete item.lbeacon_uuid
            delete item.base_x
            delete item.base_y

            return item
        })
        response.status(200).json(toReturn)

    }).catch(err => {
        console.log(`get tracking data failed ${err}`)
    })
}

module.exports = {
    getTrackingData
}