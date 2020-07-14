/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        recordController.js

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
const exec = require('child_process').execFile;
const moment = require('moment');
const dbQueries = require('../db/dbQueries/recordQueries')
const pool = require('../db/dev/connection');
const pdf = require('html-pdf');
const path = require('path');

module.exports = {

    getEditObjectRecord: (request, response) => {
        const { locale } = request.body

        pool.query(dbQueries.getEditObjectRecord())
            .then(res => {
                console.log('get object edited record succeed')
    
                res.rows.map(item => {
                    item.edit_time = moment.tz(item.edit_time, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                    return item
                })
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get object edited record failed ${err}`)
            })
    },

    getShiftChangeRecord: (request, response) => {
        let { locale } = request.body
        pool.query(dbQueries.getShiftChangeRecord())
            .then(res => {
                console.log('get shift change record succeed')
                res.rows.map(item => {
                    item.submit_timestamp = moment.tz(item.submit_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                    return item
                })
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get shift change record failed ${err}`)
            })
    },

    addShiftChangeRecord: (request, response) => {
        let { 
            userInfo, 
            pdfPackage,
            shift 
        } = request.body
        /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
        pool.query(dbQueries.addShiftChangeRecord(userInfo, pdfPackage.path, shift))
            .then(res => {

                /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
                pdf.create(pdfPackage.pdf, pdfPackage.options ).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
                    if (err) return console.log(`add shift change record failed ${err}`);
                
                    console.log("pdf create succeed");
                    response.status(200).json(pdfPackage.path)
                });
            })
            .catch(err => {
                console.log(`pdf create failed: ${err}`)
            })
    
    },

    addPatientRecord: (request, response) => {
        let {
            objectPackage
        } = request.body
    
        pool.query(dbQueries.addPatientRecord(objectPackage))
            .then(res => {
                console.log(`add patient record succeed`)
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`add patient record failed ${err}`)
            })
    
    }

}