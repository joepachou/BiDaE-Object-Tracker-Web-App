require('dotenv').config();
require('moment-timezone')
const moment = require('moment');
const queryType = require ('./queryType');
const bcrypt = require('bcrypt');
const pg = require('pg');
const pdf = require('html-pdf');
const csv =require('csvtojson')
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
    }
})

const upload = multer({ storage: storage }).single('file')

moment.updateLocale('en', {
    relativeTime : Object
});

moment.updateLocale('en', {
    relativeTime : {
        future: "being here for the past %s",
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

moment.updateLocale('zh-tw', {
    relativeTime : {
        future: "已 %s",
    }
});

const getTrackingData = (request, response) => {

    const rssiThreshold = process.env.RSSI_THRESHOLD

    const locale = request.body.locale || 'en'

    /** The user's authenticated area id */
    const userAuthenticatedAreaId= request.body.user.areas_id
    /** The UI's current area id */
    const currentAreaId = request.body.areaId.toString()
    let counter = 0

    pool.query(queryType.query_getTrackingData())        
        .then(res => {

            console.log('get tracking data')

            /** Filter the objects that do no belong the area */
            const toReturn = res.rows
            .filter(item => item.mac_address)
            .map((item, index) => {

                /** Flag the object that belongs to the current area or to the user's authenticated area */
                item.isMatchedObject = checkMatchedObject(item, userAuthenticatedAreaId, currentAreaId)

                /** Set the boolean if the object's last_seen_timestamp is in the specific time period */
                let isInTheTimePeriod = moment().diff(item.last_seen_timestamp, 'seconds') 
                    < process.env.OBJECT_FOUND_TIME_INTERVAL_IN_SEC;

                /** Set the boolean if its rssi is below the specific rssi threshold  */
                let isMatchRssi = item.rssi > rssiThreshold ? 1 : 0;

                /** Flag the object that satisfied the time period and rssi threshold */
                item.found = isInTheTimePeriod && isMatchRssi 

                item.id = item.found ? ++counter : ""
                /** Set the residence time of the object */
                item.residence_time =  item.found 
                    ? moment(item.last_seen_timestamp).locale(locale).from(moment(item.first_seen_timestamp)) 
                    : item.last_seen_timestamp 
                        ? moment(item.last_seen_timestamp).locale(locale).fromNow()
                        : 'N/A'      

                /** Flag the object that is violate geofence */
                item.isViolated = item.notification ? 1 : 0;

                /** Flag the object that is on sos */
                item.panic = moment().diff(item.panic_violation_timestamp, 'second') 
                    < process.env.PANIC_TIME_INTERVAL_IN_SEC ? 1 : 0

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
                delete item.last_seen_timestamp
                delete item.panic_violation_timestamp
                delete item.rssi
                delete item.lbeacon_uuid
                delete item.monitor_type

               
                /** format timestamp*/
                item.reserved_timestamp_LT = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('LT');
                item.reserved_timestamp_MMDD = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('MM/DD');
                item.reserved_timestamp_final = moment(item.reserved_timestamp).add(30,"minutes").format("LT");
                item.reserved_timestamp = moment.tz(item.reserved_timestamp, process.env.TZ).locale(locale).format('lll');

                return item
            })

        response.status(200).json(toReturn)

    }).catch(err => {
        console.log("Get tracking data fails: " + err)
    })
}

const getObjectTable = (request, response) => {
    let { locale, areaId, objectType } = request.body
    pool.query(queryType.query_getObjectTable(areaId, objectType))       
        .then(res => {
            console.log('Get objectTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get objectTable fails: " + err)
        })     
}

const getTrackingTableByMacAddress = (request, response) => {
    let{ locale, object_mac_address, i, second} = request.body
    pool.query(queryType.query_getTrackingTableByMacAddress(object_mac_address, i, second))
        .then(res => {
            console.log("get tracking table by mac address")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('get trackingTableByMacAddress: ' + err)
        })
}

const getPatientTable = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.query_getPatientTable(areaId))       
        .then(res => {
            console.log('Get getPatientTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get getPatientTable fails: " + err)
        })     
}

const getImportPatient = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.query_getImportPatient())       
        .then(res => {
            console.log('get ImportPatient data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("get ImportPatient fails: " + err)
        })     
}

const getImportTable = (request, response) => {
    let { locale, areaId } = request.body
    pool.query(queryType.query_getImportTable())       
        .then(res => {
            console.log('Get getImportTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get getImportTable fails: " + err)
        })     
}

const getImportData = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    pool.query(queryType.query_getImportData(formOption))       
        .then(res => {
            console.log('Get getImportData data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get getImportData fails: " + err)
        })     
}

const addAssociation = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    pool.query(queryType.query_addAssociation(formOption))       
        .then(res => {
            console.log('edit import data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("edit import data fails" + err)
        })     
}

const cleanBinding = (request, response) => {
    let { locale, areaId } = request.body
    const formOption = request.body.formOption
    formOption.map( item => {
       pool.query(queryType.query_cleanBinding(item))       
        .then(res => {
            console.log('clean Binding')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("clean Binding fails: " + err)
        })      
    })
}


const getLbeaconTable = (request, response) => {

    let { locale } = request.body 
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

const editImport = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editImport(formOption))
        .then(res => {
            console.log("Edit Import success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Edit Import Fails: " + err)
        })
}

const editPatient = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editPatient(formOption))
        .then(res => {
            console.log("edit Patient success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("edit Patient Fails: " + err)
        })
}

const objectImport = (request, response) => {
    const idPackage = request.body.newData
       pool.query(queryType.query_objectImport(idPackage))
        .then(res => {
            console.log("import objects success");
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("import objects Fails: " + err)
        })   


}

const addObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_addObject(formOption))
        .then(res => {
            console.log("add object success");
            pool.query(queryType.query_addImport(formOption))
                .then(res => {
                    console.log("add import success");
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log("add object fails: " + err)
                })
        })
        .catch(err => {
            console.log("add object fails: " + err)

        })
}

const addPatient = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_addPatient(formOption))
        .then(res => {
            console.log("Add Patient Success");
            response.status(200).json(res)
        })
        .catch(err => {
 
            console.log("Add Patient Fails: " + err)
            response.status(500).json({
                message:'not good'
            })
        })
    
}



const editObjectPackage = (request, response) => {
    const { formOption, username, pdfPackage,isDelayTime,locale } = request.body
   
    // moment.tz(item.submit_timestamp, process.env.TZ).locale(locale).format('LLL');
    // moment(item.reserved_timestamp).add(30,"minutes")
    let time = ''
    isDelayTime ? time = moment(Date.now()).add(40,"minutes")._d
    : time = moment(Date.now()).add(30,"minutes")._d

    pool.query(queryType.query_addEditObjectRecord(formOption, username))
        .then(res => {
            const record_id = res.rows[0].id
            console.log('Add edited object record success')
            pool.query(queryType.query_editObjectPackage(formOption,username, record_id,time))
                .then(res => {
                    console.log('Edit object package success')
                    if (pdfPackage) {
                        pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(pdfPackage.path, function(err, result) {
                            if (err) return console.log(err);
                        
                            console.log("pdf create success");
                            response.status(200).json(pdfPackage.path)
                        });
                    } else {
                        response.status(200).json()
                    }
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
                console.log(`Sign in fail: username or password is incorrect`)
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
                        areas_id,
                        shift,
                        id
                    } = res.rows[0]

                    let userInfo = {
                        name,
                        myDevice: mydevice,
                        role,
                        searchHistory: search_history,
                        shift,
                        id,
                        areas_id
                    }

                    request.session.userInfo = userInfo
                    response.json({
                        authentication: true,
                        userInfo
                    })
                    pool.query(queryType.query_setVisitTimestamp(username))
                        .catch(err => console.log(err))
                    // pool.query(queryType.query_setShift(shift, username))
                    //     .catch(err => console.log(err))
                    console.log(`Sign in success: ${name}`)
                } else {
                    console.log(`Sign in fail: password is incorrect`)
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        })
        .catch(err => {
            console.log("Login Fails: " + err)       })
}

const signup = (request, response) => {
    const { 
        username, 
        password, 
        role,
        area_id,
        shiftSelect
    } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const signupPackage = {
        username,
        password: hash,
        shiftSelect
    }
    pool.query(queryType.query_signup(signupPackage))
        .then(res => {
            pool.query(queryType.query_insertUserData(username, role, area_id))
                .then(res => {
                    console.log('sign up success')
                    response.status(200).json(res)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log("signup fails" + err)
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
    const { formOption } = request.body    
    pool.query(queryType.query_editLbeacon(formOption))
        .then(res => {
            console.log('Edit lbeacon success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log('Edit lbeacon fails ' + err)
        })

}

const generatePDF = (request, response) => {
    let { pdfPackage } = request.body

    /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
    pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(pdfPackage.path, function(err, result) {
        if (err) return console.log(err);
    
        console.log("pdf create");
        response.status(200).json(pdfPackage.path)
    });
}

const addShiftChangeRecord = (request, response) => {
    let { userInfo, pdfPackage } = request.body

    /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
    pool.query(queryType.query_addShiftChangeRecord(userInfo, pdfPackage.path))
        .then(res => {

             /** If there are some trouble when download pdf, try npm rebuild phantomjs-prebuilt */
            pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(pdfPackage.path, function(err, result) {
                if (err) return console.log(err);
            
                console.log("pdf create");
                response.status(200).json(pdfPackage.path)
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
            console.log('get shift change record success')
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

const deleteUser = (request, response) => {
    var username = request.body.username
    pool.query(queryType.query_deleteUser(username))
        .then(res => {
            console.log('delete user success')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`delete user failer ${err}`)
        })  
}

const setUserRole = (request, response) => {
    var {
        username,
        roleSelect,
        shiftSelect
    } = request.body
    pool.query(queryType.query_setUserRole(username, roleSelect, shiftSelect))
        .then(res => {
            console.log(`set user success`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set user fail ${err}`)
        })
}

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




const deleteShiftChangeRecord = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.query_deleteShiftChangeRecord(idPackage))
    .then(res => {
                console.log('delete shift change record success')
                response.status(200).json(res)
    })
    .catch(err => {
        console.log(err)
    })
}


const deletePatient = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.query_deletePatient(idPackage))
    .then(res => {
                console.log('deletePatient change record success')
                response.status(200).json(res)
    })
    .catch(err => {
        console.log(err)
    })
}


const deleteLBeacon = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.query_deleteLBeacon(idPackage))
    .then(res => {
                console.log('delete LBeacon record success')
                response.status(200).json(res)
    })
    .catch(err => {
        console.log(err)
    })
}

const deleteGateway = (request, response) => {
    const { idPackage } = request.body
    pool.query(queryType.query_deleteGateway(idPackage))
    .then(res => {
        console.log('delete Gateway record success')
        response.status(200).json(res)
    })
    .catch(err => {
        console.log(err)
    })
}


const deleteDevice = (request, response) => {
    const { idPackage, formOption } = request.body
    pool.query(queryType.query_deleteDevice(idPackage, formOption))
    .then(res => {
        console.log('delete Device success')
        response.status(200).json(res)
    })
    .catch(err => {
        console.log(err)
    })
}

const deleteImportData = (request, response) => {
    const { idPackage } = request.body

        pool.query(queryType.query_deleteImportData(idPackage))
        .then(res => {
                    console.log('delete ImportData success')
                    response.status(200).json(res)
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

const getGeoFenceConfig = (request, response) => {
    let { areaId } = request.body
    pool.query(queryType.query_getGeoFenceConfig(areaId))
        .then(res => {
            res.rows.map(item => {
                item.perimeters = parseGeoFenceConfig(item.perimeters)
                item.fences = parseGeoFenceConfig(item.fences)
            })
            console.log("get geo fence config")
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`get geo fence config fail: ${err}`)
        })
}


const setGeoFenceConfig = (request, response) =>{
    let { value, areaId } = request.body
    pool.query(queryType.query_setGeoFenceConfig(value, areaId))
        .then(res => {
            console.log(`set geo fence config`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set geo fence config fail: ${err}`)
        })
}

const setGeoFenceConfigRows = (request, response) =>{
    let config = request.body
    pool.query(queryType.query_setGeoFenceConfigRows(config))
        .then(res => {
            console.log(`set geo fence config`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set geo fence config fail: ${err}`)
        })
}

const checkoutViolation = (request, response) => {
    let { 
        mac_address,
        monitor_type
    } = request.body
    pool.query(queryType.query_checkoutViolation(mac_address, monitor_type))
        .then(res => {
            console.log(`checkout violation`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`checkout violation fail: ${err}`)
        })
}

const confirmValidation = (request, response) => {

    let { username, password } = request.body

    pool.query(queryType.query_confirmValidation(username))
        .then(res => {

            if (res.rowCount < 1) {
                response.json({
                    confirmation: false,
                    message: "Incorrect"
                })
            } else {
                const hash = res.rows[0].password
                
                if (bcrypt.compareSync(password, hash)) {
                    let { 
                        name, 
                        role, 
                        id
                    } = res.rows[0]

                    let userInfo = {
                        name,
                        role,
                        id,
                    }

                    request.session.userInfo = userInfo

                    console.log('confirm validation')
                    response.json({
                        confirmation: true,
                    })
                } else {
                    response.json({
                        confirmation: false,
                        message: "password is incorrect"
                    })
                }
            }
        })
        .catch(err => {
            console.log(`confirm validation fail: ${err}`)
        })
}

const getMonitorConfig = (request, response) => {
    let {
        type,
        areasId
    } = request.body

    let sitesGroup = process.env.SITES_GROUP.split(',')

    pool.query(queryType.query_getMonitorConfig(type, sitesGroup))
        .then(res => {
            console.log(`get ${type}`)

            let toReturn = res.rows
            .filter(item => {
                return areasId.includes(item.area_id)
            })
            .map(item => {
                // item.start_time = moment(item.start_time, "hh:mm:ss").format("hh:mm")
                // item.end_time = moment(item.end_time, "hh:mm:ss").format("hh:mm")
                item.start_time = item.start_time.split(':').filter((item,index) => index < 2).join(':')
                item.end_time = item.end_time.split(':').filter((item,index) => index < 2).join(':')
                return item
            })
            response.status(200).json(toReturn)
        })
        .catch(err => {
            console.log(`get ${type} fail: ${err}`)
        })
}

const setMonitorConfig = (request, response) => {
    let {
        monitorConfigPackage,
    } = request.body
    pool.query(queryType.query_setMonitorConfig(monitorConfigPackage))
        .then(res => {
            console.log(`set ${monitorConfigPackage.type}`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`set monitor config fail: ${err}`)
        })
}



/** Parse the lbeacon's location coordinate from lbeacon_uuid*/
const parseLbeaconCoordinate = (lbeacon_uuid) => {
    /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
    // console.log(lbeacon_uuid)
    // const zz = lbeacon_uuid.slice(6,8);
    const area_id = parseInt(lbeacon_uuid.slice(0,4))
    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
    const yy = parseInt(lbeacon_uuid.slice(-8));
    return [yy, xx, area_id];
}

const calculatePosition = (item) => {
    const area_id = parseInt(item.lbeacon_uuid.slice(0,4))
    const xx = item.base_x;
    const yy = item.base_y;

    return [yy, xx, area_id]
}

const parseGeoFenceCoordinate = (uuid) => {
    /** Example geofence uuid: 00010018000000003460000000011900 */
    const area_id = uuid.slice(0, 4);
    const xx = parseInt(uuid.slice(11, 20))
    const yy = parseInt(uuid.slice(-8))
    return [area_id, yy, xx]
}

/** Parse geo fence config */
const parseGeoFenceConfig = (field) => {
    let fieldParse = field.split(',')
    let number = parseInt(fieldParse[0])
    let uuids = fieldParse.slice(1, number + 1).map(uuid => parseGeoFenceCoordinate(uuid))
    let rssi = fieldParse[number + 1]
    return {
        number,
        uuids,
        rssi
    }
}

/** Check tracking data match the current UI area */
const checkMatchedObject = (item, userAuthenticatedAreaId, currentAreaId) => {

    /** If the current area id is the user's authenticated area id */
    let isInUserSAuthArea = userAuthenticatedAreaId.includes(currentAreaId)

    /** Parse lbeacon uuid into three field in an array: area id, latitude, longtitude */
    let lbeacon_coordinate = item.lbeacon_uuid ? parseLbeaconCoordinate(item.lbeacon_uuid) : null;

    item.lbeacon_coordinate = lbeacon_coordinate

    /** Set the object's location in the form of lbeacon coordinate parsing by lbeacon uuid  */
    item.currentPosition = item.lbeacon_uuid ? calculatePosition(item) : null;

    /** Set the lbeacon's area id from lbeacon_coordinate*/
    let lbeacon_area_id = item.lbeacon_uuid ? lbeacon_coordinate[2] : null;

    /** Set the boolean if the object scanned by Lbeacon is matched the current area */
    let isMatchedArea = lbeacon_area_id == parseInt(currentAreaId)

    /** Set the boolean if the object belong to the user's authenticated area id */
    let isUserSObject = userAuthenticatedAreaId.includes(item.area_id)

    /** Set the boolean if the object belong to the current area */
    let isAreaSObject = item.area_id == parseInt(currentAreaId)

    /** Filter the object if the object scanned by the current area's Lbeacon */
    if (isMatchedArea) {

        /** Determine if the current area is the authenticated area */
        if (isInUserSAuthArea) {

            /** Flag the object that belongs to the current area and to the user's authenticated area,
             * if the current area is the authenticated area */
            return isAreaSObject || isUserSObject
        } else {

            /** Flag the object that belongs to the user's authenticated area, 
             * if the current area is not the authenticated area */
            return isUserSObject
        }
    } else {
        return false
    }
}

const backendSearch = (request, response) => {
    
    const {keyType, keyWord, mac_address} = request.body
    var query = queryType.query_backendSearch(keyType, keyWord, mac_address)
    pool.query(query, (err, res) => {
        if(err){
            console.log(err)
        }else{
            var mac_addresses = res.rows.map((mac) => {
                return mac.mac_address
            })
            pool.query({
                text: `DELETE FROM search_result_queue where (key_type = $1 AND key_word = $2)`,
                values: [keyType, keyWord]
            }, (err, res) => {
                if(err){
                    console.log('delete same name')
                    console.log(err)
                }else{
                    pool.query(`DELETE FROM search_result_queue WHERE id NOT IN (SELECT id FROM search_result_queue ORDER BY query_time desc LIMIT 4)`, (err, res) => {
                        if(err){
                            console.log('delete exceed')
                            console.log(err)

                        }else{
                            pool.query(`SELECT pin_color_index FROM search_result_queue GROUP BY pin_color_index`, (err, res) => {
                                // console.log(res.rows)
                                var usedIndex = res.rows.map(i => {
                                    return i['pin_color_index']
                                })
                                var avail = [0, 1, 2, 3, 4].filter(function(i) {return usedIndex.indexOf(i) < 0;});
                                // console.log(avail)
                                if(err){
                                    console.log(err)
                                }else{
                                    pool.query(queryType.query_backendSearch_writeQueue(keyType, keyWord, mac_addresses, avail[0]), (err, res) => {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            response.send(mac_addresses)
                                        } 
                                    })        
                                }
                            })
                            
                        }
                    })
                        
                }
                
                
            })
        }
        
    })

}
const getBackendSearchQueue = (request, response) => {
    var query = queryType.query_getBackendSearchQueue()
    pool.query(query, (err, res) => {
        response.send(res.rows)
    })
}

const addBulkObject = (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const csvFilePath = req.file.path
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            pool.query(queryType.query_addBulkObject(jsonObj))
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        return res.status(200).send(req.file)
    })
}

module.exports = {
    getTrackingData,
    getObjectTable,
    getPatientTable,
    getImportTable,
    getImportPatient,
    getImportData,
    addAssociation,
    cleanBinding,
    getLbeaconTable,
    getGatewayTable,
    getGeofenceData,
    getUserList,
    getUserRole,
    getRoleNameList,
    getAreaTable,
    getGeoFenceConfig,
    getUserInfo,
    getPDFInfo,
    getEditObjectRecord,
    getMonitorConfig,
    addShiftChangeRecord,
    addUserSearchHistory,
    addObject,
    addPatient,
    addBulkObject,
    editObject,
    editImport,
    editPatient,
    objectImport,
    editLbeacon,
    editObjectPackage,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    deletePatient,
    deleteDevice,
    deleteImportData,
    deleteLBeacon,
    deleteGateway,
    deleteUser,
    signin,
    signup,
    generatePDF,
    modifyUserDevices,
    validateUsername,
    setUserRole,
    setGeoFenceConfig,
    setGeoFenceConfigRows,
    setMonitorConfig,
    checkoutViolation,
    confirmValidation,
    backendSearch,
    getBackendSearchQueue,
    getTrackingTableByMacAddress,
}