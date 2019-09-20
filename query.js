require('dotenv').config();
const moment = require('moment');
const momentTZ = require('moment-timezone')
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
    pool.query(queryType.query_getTrackingData())        
        .then(res => {
            console.log('Get tracking data')
            res.rows.map(item => {

                /** Tag the object that is found 
                 *  if the object's last_seen_timestamp is in the specific time period
                 *  and its rssi is below the specific rssi threshold  */
                item.found = moment().diff(item.last_seen_timestamp, 'seconds') < 30 && item.rssi > rssiThreshold ? 1 : 0;
    
                /** Set the residence time of the object */
                item.residence_time =  item.found 
                    ? moment(item.last_seen_timestamp).locale(locale).from(moment(item.first_seen_timestamp)) 
                    : item.last_seen_timestamp 
                        ? moment(item.last_seen_timestamp).locale(locale).fromNow()
                        : 'N/A'

                /** Tag the object that is violate geofence */
                if (moment().diff(item.geofence_violation_timestamp, 'seconds') > 300
                    || moment(item.first_seen_timestamp).diff(moment(item.geofence_violation_timestamp)) > 0) {
                        
                    delete item.geofence_type
                }
    
                /** Tag the object that is on sos */
                if (moment().diff(item.panic_timestamp, 'second') < 300) {
                    item.panic = true
                }

                /** Tag the object's battery volumn is limiting */
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
                delete item.geofence_violation_timestamp
                delete item.panic_timestamp
                delete item.rssi
    
                return item
            })
            response.status(200).json(res)

        }).catch(err => {
            console.log("Get trackingData fails: \n" + err)
        })
}

const getObjectTable = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getObjectTable)       
        .then(res => {
            console.log('Get objectTable data')
            response.status(200).json(res)
        })
        .catch(err => {
            console.log("Get objectTable fails: " + err)
        })     
}

const getLbeaconTable = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getLbeaconTable)
        .then(res => {
            console.log('Get lbeaconTable data')
            res.rows.map(item => {
                let mn = moment().locale(locale)
                item.health_status =  mn.diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
                item.last_report_timestamp = moment(momentTZ(item.last_report_timestamp).tz(process.env.TZ).locale(locale)).format('lll');
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
                let mn = moment().locale(locale)
                item.health_status =  item.health_status === 0 && mn.diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
                item.last_report_timestamp = moment(momentTZ(item.last_report_timestamp).tz(process.env.TZ)).locale(locale).format('lll');
                item.registered_timestamp = moment(momentTZ(item.registered_timestamp).tz(process.env.TZ)).locale(locale).format('lll');

            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log("Get data fails: " + err)                

        })
}

const getGeofenceData = (request, response) => {
    let { locale } = request.body
    pool.query(queryType.query_getGeofenceData)
        .then(res =>  {
            console.log("Get Geofence Data")
            res.rows.map(item => {
                item.receive_time= moment(momentTZ(item.receive_time).tz(process.env.TZ)).locale(locale).format('lll');
                item.alert_time = moment(momentTZ(item.alert_time).tz(process.env.TZ)).locale(locale).format('lll');
            })
            response.status(200).json(res);
        })
        .catch(err => {
            console.log("Get Geofence Data fails: " + error)
        })
}

const editObject = (request, response) => {
    const formOption = request.body.formOption
    pool.query(queryType.query_editObject(formOption), (error, results) => {
        if (error) {
            console.log("Edit Object Fails: " + error)
        } else {
            console.log("Edit Object Success");
        }
        
        response.status(200).json(results)

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
                    console.log(res.rows[0])
                    let { 
                        name, 
                        role, 
                        mydevice, 
                        search_history,
                        area
                    } = res.rows[0]

                    let userInfo = {
                        name,
                        myDevice: mydevice,
                        role,
                        searchHistory: search_history,
                        shift,
                        area
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
        role 
    } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const signupPackage = {
        username: username.toLowerCase(),
        password: hash,
    }

    pool.query(queryType.query_signup(signupPackage))
        .then(res => {
            pool.query(queryType.query_insertUserRole(username, role))
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
                item.submit_timestamp = moment(momentTZ(item.submit_timestamp).tz(process.env.TZ).locale(locale)).format('LLL');
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
                    moment(momentTZ(item.last_visit_timestamp).tz(process.env.TZ).locale(locale)).format('LLLL');
                item.registered_timestamp = moment(momentTZ(item.registered_timestamp).tz(process.env.TZ).locale(locale)).format('LLLL');
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
                item.edit_time = moment(momentTZ(item.edit_time).tz(process.env.TZ).locale(locale)).format('LLL');
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
    deleteEditObjectRecord
}