/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        userController.js

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
const moment = require('moment');
const dbQueries = require('../db/dbQueries/userQueries');
const pool = require('../db/dev/connection');
const session = require('express-session');
const authQueries = require('../db/dbQueries/authQueries');
const encrypt = require('../service/encrypt');

module.exports = {

    getAllUser: (request, response) => {
        let { locale } = request.query
        pool.query(dbQueries.getAllUser())
            .then(res => {
                console.log('get all user succeed')
                res.rows.map(item => {
                    item.last_visit_timestamp = 
                        item.last_visit_timestamp && 
                        moment.tz(item.last_visit_timestamp, process.env.TZ)
                            .locale(locale)
                            .format(process.env.TIMESTAMP_FORMAT);
                    item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ)
                        .locale(locale)
                        .format(process.env.TIMESTAMP_FORMAT);
                })
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`get all user failed ${err}`)
            })
    },

    addUser: (request, response) => {
        const { 
            name, 
            password, 
            email,
            roles,
            area_id,
        } = request.body;    

        const hash = encrypt.createHash(password);
          
        const signupPackage = {
            name: name.toLowerCase(),
            password: hash,
            email,
            area_id
        } 
        request.session.regenerate(() => {
            request.session.user = name 
        })

        pool.query(authQueries.signin(name))
            .then(ress => {  
                if (ress.rowCount < 1) { 
                    pool.query(dbQueries.addUser(signupPackage))
                    .then(res => {
                        pool.query(dbQueries.insertUserData(name.toLowerCase(), roles, area_id))
                            .then(res => {
                                console.log('sign up succeed')
                                response.status(200).json(res)
                            })
                            .catch(err => {
                                console.log(`sinup failed ${err}`)
                            })
                    })
                    .catch(err => {
                        console.log(`signup failed ${err}`)
                    })
                }else{ 
                    console.log('signup failed : repeat username')
                }
            })

       
    },

    editUserInfo: (request, response) => { 
        var {
            user
        } = request.body
        pool.query(dbQueries.editUserInfo(user))
            .then(res => {
                console.log(`edit user info succeed`)
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`edit user info failed ${err}`)
            })
    },

    deleteUser: (request, response) => {
        var username = request.body.username
        pool.query(dbQueries.deleteUser(username))
            .then(res => {
                console.log('delete user succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`delete user failed ${err}`)
            })  
    },

    editSecondaryArea: (request, response) => {
        const {
            user
        } = request.body
        pool.query(dbQueries.editSecondaryArea(user))
            .then(res => {
                console.log(`set secondary area succeed`)
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`set secondary area failed ${err}`)
            })
    },

    editPassword: (request, response) => {
        const { 
            user_id, 
            password
        } = request.body;    
    
        const hash = encrypt.createHash(password);
    
        pool.query(dbQueries.editPassword(user_id,hash)) 
            .then(res => {
                console.log('edit password succeed')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`edit password failed ${err}`)
            })  
    },

    setLocale: (request, response) => {
        const {
            userId,
            localeName
        } = request.body

        pool.query(dbQueries.setLocale(userId, localeName))
            .then(res => {
                console.log("set locale succeed");
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`set locale failed ${err}`)
            })
    },

    addSearchHistory: (request, response) => {
        let { 
            username, 
            keyType, 
            keyWord 
        } = request.body;
        
        pool.query(dbQueries.addSearchHistory(username, keyType, keyWord))
            .then(res => {
                console.log('add user searech history success')
                response.status(200).json(res)
            })
            .catch(err => {
                console.log(`add user search history fails ${err}`)
            })
    },

    editMyDevice: (request, response) => {
        const {
            username, 
            mode, 
            acn
        } = request.body

        pool.query(dbQueries.editMyDevice(username, mode, acn))
            .then(res => {
                console.log('edit mydevice succeed')
                response.status(200).json()
            })
            .catch(err => {
                console.log(`edit mydevice failed ${err}`)
            })            
    },

    editMaxSearchHistoryCount: (request, response) => {
        const {username, info} = request.body
        pool.query(dbQueries.editMaxSearchHistoryCount(username, info))
            .then(res => {
                console.log('modify user info success')
                response.status(200).send('ok')
            })
            .catch(err => {
                console.log(`modify user info fail ${err}`)
            })
        
    },

    editKeywordType: (request, response) => {
        let {
            userId,
            keywordTypeId
        } = request.body;

        pool.query(dbQueries.editKeywordType(userId, keywordTypeId))
            .then(res => {
                console.log(`edit keyword type succeed`);
                response.status(200).json(res);
            })
            .catch(err => {
                console.log(`edit keyword type failed ${err}`)
            })
    },

    editListId: (request, response) => {
        let {
            userId,
            listId
        } = request.body

        pool.query(dbQueries.editListId(userId, listId))
            .then(res => {
                console.log(`edit list id succeed`);
                response.status(200).json(200);
            })
            .catch(err => {
                console.log(`edit list id failed ${err}`)
            })
    }

}
