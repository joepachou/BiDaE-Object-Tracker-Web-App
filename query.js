require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');
const pdf = require('html-pdf');


const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)

moment.updateLocale('en', {
    relativeTime : Object
});

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s  : '1 minute',
        ss : '1 minute',
        m:  "1 minute",
        mm: "%d minutes",
        h:  "1 hour",
        hh: "%d hours",
        d:  "1 day",
        dd: "%d days",
        M:  "1 month",
        MM: "%d months",
        y:  "1 year",
        yy: "%d years"
    }
});

const getTrackingData = (request, response) => {
    const rssiThreshold = request.body.rssiThreshold || -65
    const locale = request.body.locale || 'en'

    /** The user's authenticated area id */
    const userAreasId= request.body.user.areas_id

    /** The UI's current area id */
    const currentAreaId = request.body.areaId.toString()

    /** If the current area id is the user's authenticated area id */
    let isInUserSAuthArea = userAreasId.includes(currentAreaId)

    // console.log(user)
    pool.query(queryType.query_getTrackingData())        
        .then(res => {
            var counter = 0
            console.log('Get tracking data')

            /** Filter the objects that do no belong the area */
            const toReturn = res.rows
            .map(item => {

                /** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
                let lbeacon_coordinate = parseLbeaconCoordinate(item.lbeacon_uuid)

                /** Set the lbeacon's area id from lbeacon_coordinate*/
                let lbeacon_area_id = parseInt(lbeacon_coordinate[0])

                /** Set the object's location in the form of lbeacon coordinate parsing by lbeacon uuid  */
                item.currentPosition = item.lbeacon_uuid ? lbeacon_coordinate.slice(1, 3) : null;

                /** Set the boolean if the object scanned by Lbeacon is matched the current area */
                let isMatchedArea = lbeacon_area_id == parseInt(currentAreaId)

                /** Set the boolean if the object's last_seen_timestamp is in the specific time period */
                let isInTheTimePeriod = moment().diff(item.last_seen_timestamp, 'seconds') < 30 

                /** Set the boolean if its rssi is below the specific rssi threshold  */
                let isMatchRssi = item.rssi > rssiThreshold ? 1 : 0;

                /** Set the boolean if the object belong to the user's authenticated area id */
                let isUserSObject = userAreasId.includes(item.area_id)

                /** Set the boolean if the object belong to the current area */
                let isAreaSObject = item.area_id == parseInt(currentAreaId)

                /** Filter the object if the object scanned by the current area's Lbeacon */
                if (isMatchedArea) {

                    /** Determine if the current area is the authenticated area */
                    if (isInUserSAuthArea) {

                        /** Flag the object that belongs to the current area and to the user's authenticated area,
                         * if the current area is the authenticated area */
                        item.isMatchedObject = isAreaSObject || isUserSObject
                    } else {

                        /** Flag the object that belongs to the user's authenticated area, 
                         * if the current area is not the authenticated area */
                        item.isMatchedObject = isUserSObject
                    }
                } else {
                    item.isMatchedObject = false
                }

                /** Flag the object that satisfied the time period and rssi threshold */
                item.found = isInTheTimePeriod && isMatchRssi 

                // count++
                // switch(func) {
                //     case 'track':

                //         /** Flag the object that is the user's my device */
                //         item.myDevice = user.myDevice && user.myDevice.includes(item.access_control_number) ? 1 : 0;

                //         /** Flag the object that is found */
                //         // let isTheAuthArea = user.area === area ? 1 : 0;
                //         // let isInCurrentArea = area === item.area_name ? 1 : 0;

                //         /** Set the object's found condition */
                //         // item.found = isInTheTimePeriod && isInCurrentArea && isTheAuthArea 
                //         item.found = isInTheTimePeriod 

                //         item.found = item.myDevice ? isInCurrentArea ? 1 : 0 : item.found
                //         break;

                //     case 'systemStatus':
                //         item.found = isInTheTimePeriod
                //         break
                // }

                /** Set the residence time of the object */
                item.residence_time =  item.found 
                    ? moment(item.last_seen_timestamp).locale(locale).from(moment(item.first_seen_timestamp)) 
                    : item.last_seen_timestamp 
                        ? moment(item.last_seen_timestamp).locale(locale).fromNow()
                        : 'N/A'

                /** Flag the object that is violate geofence */
                // if (moment().diff(item.geofence_violation_timestamp, 'seconds') > 300
                //     || moment(item.first_seen_timestamp).diff(moment(item.geofence_violation_timestamp)) > 0) {
                        
                //     delete item.geofence_type
                // }

                /** Flag the object that is on sos */
                if (moment().diff(item.panic_timestamp, 'second') < 300) {
                    item.panic = true
                }

                /** Flag the object's battery volumn is limiting */
                if (item.battery_voltage >= 27) {
                    item.battery_voltage = 3;
                } else if (item.battery_voltage < 27 && item.battery_voltage > 0) {
                    item.battery_voltage = 2;
                } else {
                    item.battery_voltage = 0
                }
                /** Omit the unused field of the object */
                delete item.first_seen_timestamp
                delete item.last_seen_timestamp
                delete item.panic_timestamp
                delete item.rssi

                return item
            })
        // console.log(toReturn.length)
        // console.log(counter)
        response.status(200).json(toReturn)

    }).catch(err => {
        console.log("Get trackingData fails: " + err)
    })
}

const getObjectTable = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.query_getObjectTable(areaId))       
        .then(res => {
            console.log('Get objectTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get objectTable fails: " + err)
        })     
}

const getLbeaconTable = (request, response) => {
    let { locale } = request.body || 'en'
    pool.query(queryType.query_getLbeaconTable)
        .then(res => {
            console.log('Get lbeaconTable data')
            res.rows.map(item => {
                item.health_status =  moment().diff(item.last_report_timestamp, 'days') < 1 ? 1 : 0 
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format('lll');

            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log("Get lbeaconTable fails: " + err)
        })        


}

const getGatewayTable = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getGatewayTable)
        .then(res => {
            console.log('Get gatewayTable data')
            res.rows.map(item => {
                item.health_status =  item.health_status === 0 && moment().diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
                item.last_report_timestamp = moment.tz(item.last_report_timestamp, process.env.TZ).locale(locale).format('lll');
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format('lll');
            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log("Get gatewayTable fails: " + err)                

        })
}

const getGeofenceData = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getGeofenceData)
        .then(res =>  {
            console.log("Get Geofence Data")
            res.rows.map(item => {
                item.receive_time= moment.tz(item.receive_time, process.env.TZ).locale(locale).format('lll');
                item.alert_time = moment.tz(item.alert_time, process.env.TZ).locale(locale).format('lll');
            })
            response.status(200).json(res);
        })
        .catch(err => {
            console.log("Get Geofence Data fails: " + err)
        })
}

const editObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editObject(formOption))
        .then(res => {
            console.log("Edit object success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Edit Object Fails: " + err)
        })
}

const addObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_addObject(formOption))
        .then(res => {
            console.log("Add Object Success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Add Object Fails: " + err)
            response.status(500).json({
                message:'not good'
            })
        })
    
}

const editObjectPackage = (request, response) => {
    const { formOption, username } = request.body

    pool.query(queryType.query_addEditObjectRecord(formOption, username))
        .then(res => {
            const record_id = res.rows[0].id
            pool.query(queryType.query_editObjectPackage(formOption, record_id))
                .then(res => {
                console.log('Edit object package success')
                response.status(200).json(res)

                })
                .catch(err => {
                    console.log('Edit object package fail ' + err)
                })
        })
        .catch(err => {
            console.log('Edit object package fail ' + err)
        })
}

const signin = (request, response) => {
    const username = request.body.username.toLowerCase()
    const { password, shift } = request.body
    

    pool.query(queryType.query_signin(username))
        .then(res => {
            if (res.rowCount < 1) {
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {
                const hash = res.rows[0].password
                if (bcrypt.compareSync(password, hash)) {
                    let { 
                        name, 
                        role, 
                        mydevice, 
                        search_history,
                        areas_id
                    } = res.rows[0]

                    let userInfo = {
                        name,
                        myDevice: mydevice,
                        role,
                        searchHistory: search_history,
                        shift,
                        areas_id
                    }

                    request.session.userInfo = userInfo
                    response.json({
                        authentication: true,
                        userInfo
                    })
                    pool.query(queryType.query_setVisitTimestamp(username))
                        .catch(err => console.log(err))
                    pool.query(queryType.query_setShift(shift, username))
                        .catch(err => console.log(err))
                } else {
                    console.log(3333)
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        })
        .catch(err => {
            console.log("Login Fails: " + err)
        })

}

const signup = (request, response) => {
    const { 
        username, 
        password, 
        role,
        area 
    } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const signupPackage = {
        username: username.toLowerCase(),
        password: hash,
        area,
    }

    pool.query(queryType.query_signup(signupPackage))
        .then(res => {
            pool.query(queryType.query_insertUserData(username, role, area))
                .then(res => {
                    console.log('Sign up Success')
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch((err,res) => {
            console.log("Signup Fails" + err)
        })
}

const getUserInfo = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.query_getUserInfo(username))
        .then(res => {
            console.log('Get user info')
            response.status(200).json(res)
        })
        .catch(error => {
            console.log('Get user info Fails error: ' + error)
        })
    
}

const addUserSearchHistory = (request, response) => {
    let { username, searchHistory } = request.body;
    searchHistory = JSON.stringify(searchHistory)
    pool.query(queryType.query_addUserSearchHistory(username, searchHistory))
        .then(res => {
            console.log('Add user searech history success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('Add user search history fails: ' + err)
        })
        
}

const editLbeacon = (request, response) => {
    const low = request.body.formOption.low_rssi || null
    const med = request.body.formOption.med_rssi || null
    const high = request.body.formOption.high_rssi || null
    const uuid = request.body.formOption.uuid
    const description = request.body.formOption.description


    pool.query(queryType.query_editLbeacon(uuid, low, med, high, description), (error, results) => {
        if (error) {
            console.log('Edit lbeacon fails ' + error)
        } else {
            console.log('Edit lbeacon success')
        }
        response.status(200).json(results)
    })
}



const  generatePDF = (request, response) => {
    let { pdfFormat, userInfo, filePath } = request.body
    let options = {
        "format": "A4",
        "orientation": "portrait",
        "border": "1cm",
        "timeout": "120000"
    };
    pool.query(queryType.query_addShiftChangeRecord(userInfo.name, filePath))
        .then(res => {
            pdf.create(pdfFormat, options).toFile(filePath, function(err, result) {
                if (err) return console.log(err);
            
                console.log("pdf create");
                response.status(200).json(filePath)
            });
        })
        .catch(err => {
            console.log(`pdf create fail: ${err}`)
        })
}

const modifyUserDevices = (request, response) => {
    const {username, mode, acn} = request.body
    pool.query(queryType.query_modifyUserDevices(username, mode, acn), (error, results) => {
        if (error) {
            
        } else {
            console.log('Modify Success')
            // console.log('Get user info success')
        }
        
        response.status(200).json(results)
    })
}

const getPDFInfo = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getShiftChangeRecord())
        .then(res => {
            console.log('save pdf file success')
            res.rows.map(item => {
                item.submit_timestamp = moment.tz(item.submit_timestamp, process.env.TZ).locale(locale).format('LLL');
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(err)
        })
}

const validateUsername = (request, response) => {
    let { username } = request.body
    pool.query(queryType.query_validateUsername(username))
        .then(res => {
            let precheck = false
            res.rowCount === 0 ? precheck = true : precheck = false;
            response.status(200).json({precheck})
        })
        .catch(err => {
            console.log(err)
        })
}

const getUserList = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getUserList())
        .then(res => {
            console.log('get user list success')
            res.rows.map(item => {
                item.last_visit_timestamp = 
                    item.last_visit_timestamp && 
                    moment.tz(item.last_visit_timestamp, process.env.TZ).locale(locale).format('LLLL');
                item.registered_timestamp = moment.tz(item.registered_timestamp, process.env.TZ).locale(locale).format('LLLL');
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get user list fail ${err}`)
        })
}

const getUserRole = (request, response) => {
    var { username } = request.body
    pool.query(queryType.query_getUserRole(username))
        .then(res => {
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get user role fail ${err}`)
        })
}

const getRoleNameList = (request, response) => {
    pool.query(queryType.query_getRoleNameList())
        .then(res => {
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(err)
        })
    
}

const removeUser = (request, response) => {
    var username = request.body.username
    pool.query(queryType.query_removeUser(username), (error, results) => {
        if(error){
            console.log(error)
        }else{
            console.log('success')
            response.send('success')
        }
    })  
}

const setUserRole = (request, response) => {
    var {role, username} = request.body
    pool.query(queryType.query_setUserRole(role, username),(error, results) => {
        if(error){
            console.log(error)
        }else{
            // console.log(results.rows)
            response.send('success')
        }
    }
)}
const getEditObjectRecord = (request, response) => {
    const { locale } = request.body
    pool.query(queryType.query_getEditObjectRecord())
        .then(res => {
            console.log('get edit object record')

            res.rows.map(item => {
                item.edit_time = moment.tz(item.edit_time, process.env.TZ).locale(locale).format('LLL');
            })
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(err)
        })
}

const deleteEditObjectRecord = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.query_deleteEditObjectRecord(idPackage))
        .then(res => {
            pool.query(`UPDATE object_table SET note_id = null WHERE note_id IN (${idPackage.map(id => `${id}`)})`)
                .then(res => {
                    console.log('delete edit object record success')
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log('delete edit object record fail: ' + err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

const getAreaTable = (request, response) => {
    pool.query(queryType.query_getAreaTable())
        .then(res => {
            console.log("get area table")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("get area table fail: "+ err)
        })
}

/** Parsing the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
    /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
    // console.log(lbeacon_uuid)
    // const zz = lbeacon_uuid.slice(6,8);
    const area_id = lbeacon_uuid.slice(0,4)
    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
    const yy = parseInt(lbeacon_uuid.slice(-8));
    return [area_id, yy, xx];
}

module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    editObject,
    addObject,
    editObjectPackage,
    signin,
    signup,
    getUserInfo,
    addUserSearchHistory,
    editLbeacon,
    generatePDF,
    modifyUserDevices,
    getPDFInfo,
    validateUsername,
    getUserList,
    getUserRole,
    getRoleNameList,
    removeUser,
    setUserRole,
    getEditObjectRecord,
    deleteEditObjectRecord,
    getAreaTable
}