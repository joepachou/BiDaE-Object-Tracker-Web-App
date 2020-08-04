/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        objectController.js

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
const dbQueries = require('../db/dbQueries/objectQueries');
const recordQueries = require('../db/dbQueries/recordQueries');
const pool = require('../db/dev/connection');
const pdf = require('html-pdf');
const path = require('path');

module.exports = {

    getObject: (request, response) => {
        let { 
            locale, 
            areas_id,
            objectType 
        } = request.query

        pool.query(dbQueries.getObject(objectType, areas_id))       
            .then(res => {
                console.log('get object table succeed')
                res.rows.map(item => {
                    item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format(process.env.TIMESTAMP_FORMAT);
                })
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get object table failed ${err}`)
            })     
    },

    addObject: (request, response) => {

        const {
            formOption,
            mode
        } = request.body

        let query;
        switch(mode) {
            case 'PERSONA':
                query = dbQueries.addPersona(formOption);
                break;
            case 'DEVICE':
                query = dbQueries.addObject(formOption);
                break;
        }

        pool.query(query)
            .then(res => {
                console.log(`add ${mode} succeed`);
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`add ${mode} failed ${err}`);
            })
    },

    addDevice: (request, response) => {
        const {
            formOption,
            mode
        } = request.body


        pool.query(dbQueries.addObject(formOption))
            .then(res => {
                console.log(`add device succeed`);
                pool.query(dbQueries.addObjectSummaryRecord(formOption.mac_address))
                    .then(res => {
                        console.log(`add record in object summary table succeed`)
                        response.status(200).json(res)
                    }) 
                    .catch(err => {
                        console.log(`add record in object summary table failed ${err}`)
                    })
            })
            .catch(err => {
                console.log(`add device failed ${err}`);
            })
    },

    addPerson: (request, response) => {
        const {
            formOption,
            mode
        } = request.body

        pool.query(dbQueries.addPersona(formOption))
            .then(res => {
                console.log(`add person succeed`);
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`add person failed ${err}`);
            })
    },

    editObject: (request, response) => {
        const { 
            formOption,
            mode
        } = request.body

        let {
            area_id
        } = formOption

        switch(mode) {
            case 'PERSONA':
                query = dbQueries.editPersona(formOption);
                break;
            case 'DEVICE':
                query = dbQueries.editObject(formOption);
                break;
        }

        pool.query(query)
            .then(res => {
                console.log(`edit ${mode} succeed`);
                if (process.env.RELOAD_GEO_CONFIG_PATH) {
                    exec(process.env.RELOAD_GEO_CONFIG_PATH, `-p 9999 -c cmd_reload_geo_fence_setting -r geofence_object -f area_one -a ${area_id}`.split(' '), function(err, data){
                        if(err){
                            console.log(`execute reload geofence setting fails ${err}`)
                            response.status(200).json(res)
                        }else{
                            console.log(`execute reload geofence setting success`)
                            response.status(200).json(res)
                        }
                    })
                } else {
                    response.status(200).json(res)
                    console.log('IPC has not set')
                }
            })
            .catch(err => {
                console.log(`edit ${mode} failed ${err}`)
            })
    },

    deleteObject: (request, response) => {
        const { formOption } = request.body
        pool.query(dbQueries.deleteObject(formOption))
            .then(res => {
                console.log('delete object succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`delete object failed ${err}`)
            })
    },

    editObjectPackage: (request, response) => {
        const { 
            formOption, 
            username, 
            pdfPackage, 
            reservedTimestamp, 
            locale
        } = request.body

        pool.query(recordQueries.addEditObjectRecord(formOption, username, pdfPackage.path))
            .then(res => {
                const record_id = res.rows[0].id
                console.log('add edited object record succeed')
                
                pool.query(dbQueries.editObjectPackage(formOption, username, record_id, reservedTimestamp))
                    .then(res => {
                        console.log('edit object package succeed')
                        if (pdfPackage) {
                            pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
                                if (err) return console.log(`edit object package error ${err}`);
                            
                                console.log("pdf create succeed");
                                response.status(200).json(pdfPackage.path)
                            });
                        } else { 
                            response.status(200).json()
                        }
                    })
                    .catch(err => {
                        console.log(`edit object package failed ${err}`)
                    })
            })
            .catch(err => {
                console.log(`edit object package failed ${err}`)
            })
    }
}