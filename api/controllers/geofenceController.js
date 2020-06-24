/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        geofenceController.js

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
require('moment-timezone');
const dbQueries = require('../db/dbQueries/geofenceQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getGeofenceConfig: (request, response) => {
        let { areaId } = request.body
        pool.query(dbQueries.getGeofenceConfig(areaId))
            .then(res => {
                res.rows.map(item => {
                    item.start_time = item.start_time.split(':').filter((item,index) => index < 2).join(':')
                    item.end_time = item.end_time.split(':').filter((item,index) => index < 2).join(':')
                    item.parsePerimeters = parseGeoFenceConfig(item.perimeters)
                    item.parseFences = parseGeoFenceConfig(item.fences)
                })
                console.log("get geofence config success")
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get geofence config fail ${err}`)
            })
    }
}

/** Parse geo fence config */
const parseGeoFenceConfig = (field = []) => {
    let fieldParse = field.split(',')
    let number = parseInt(fieldParse[0])
    let lbeacons = fieldParse
        .filter((item, index) => index > 0  && index <= number)
    let rssi = fieldParse[number + 1]
    let coordinates = lbeacons.map(item => {
        const area_id = parseInt(item.slice(0,4))
        const xx = parseInt(item.slice(12,20));
        const yy = parseInt(item.slice(-8));
        return [yy, xx]
    })
    return {
        number,
        lbeacons,
        rssi,
        coordinates
    }
}
