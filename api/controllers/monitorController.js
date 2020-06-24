/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        monitorController.js

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
const dbQueries = require('../db/dbQueries/monitorQueries');
const pool = require('../db/dev/connection');

module.exports = {

    getMonitorConfig: (request, response) => {
        let {
            type,
        } = request.body
        console.log(type)
        pool.query(dbQueries.getMonitorConfig(type))
            .then(res => {
                console.log(`get ${type} success`)
                let toReturn = res.rows
                .map(item => {
                    item.start_time = item.start_time.split(':').filter((item,index) => index < 2).join(':')
                    item.end_time = item.end_time.split(':').filter((item,index) => index < 2).join(':')
                    return item
                })
                response.status(200).json(toReturn)
            })
            .catch(err => {
                console.log(`get ${type} fail ${err}`)
            })
    }
}