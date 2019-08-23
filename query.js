require('dotenv').config();
const moment = require('moment-timezone');
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




const getTrackingData = (request, response) => {
    const rssiThreshold = request.body.rssiThreshold || -65
    pool.query(queryType.query_getTrackingData())        
        .then(res => {
            console.log('Get tracking data!')
            res.rows.map(item => {

                /** Tag the object that is found 
                 *  if the object's last_seen_timestamp is in the specific time period
                 *  and its rssi is below the specific rssi threshold  */
                item.found = moment().diff(item.last_seen_timestamp, 'seconds') < 30 && item.rssi > rssiThreshold ? 1 : 0;
    
                /** Set the residence time of the object */
                item.residence_time =  item.found 
                    ? moment(item.last_seen_timestamp).from(moment(item.first_seen_timestamp)) 
                    : item.last_seen_timestamp 
                        ? moment(item.last_seen_timestamp).fromNow()
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
            console.log("Get trackingData fails : " + err)
        })
}

const getObjectTable = (request, response) => {
    pool.query(queryType.query_getObjectTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        } else {
            console.log('Get objectTable data!')
        
            results.rows.map(item => {
                const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
                item.last_report_timestamp = localLastReportTimeStamp.format();
            })
            response.status(200).json(results)
        }
    })
}

const getLbeaconTable = (request, response) => {
    pool.query(queryType.query_getLbeaconTable)
        .then(res => {
            console.log('Get lbeaconTable data!')
            res.rows.map(item => {
                item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format('lll');
                item.health_status =  moment().diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
            })
            response.status(200).json(res)

        })
        .catch(err => {
            console.log("Get data fails : " + err)
        })        


}

const getGatewayTable = (request, response) => {
    pool.query(queryType.query_getGatewayTable)
        .then(res => {
            console.log('Get gatewayTable data!')
            res.rows.map(item => {
                item.last_report_timestamp = moment(item.last_report_timestamp).tz(process.env.TZ).format('lll');
                item.registered_timestamp = moment(item.registered_timestamp).tz(process.env.TZ).format('lll');

                item.health_status =  item.health_status === 0 && moment().diff(item.last_report_timestamp, 'days') < 1 ? 0 : 1 
            })
            response.status(200).json(res)
        })    
        .catch(err => {
            console.log("Get data fails : " + err)                

        })
}

const getGeofenceData = (request, response) => {
    pool.query(queryType.query_getGeofenceData, (error, results) => {
        if (error) {
            console.log("Get Geofence Data fails: " + error)
        } else {
            console.log("Get Geofence Data")
        }

        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.receive_time).tz(process.env.TZ);
            item.receive_time = localLastReportTimeStamp.format();
        })
        response.status(200).json(results);
        
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
    const formOption = request.body.formOption
    pool.query(queryType.query_editObjectPackage(formOption), (error, results) => {
        if (error) {
            console.log(error)
        } else {
            console.log('success')
            response.status(200).json(results)
        } 
    })
}

const signin = (request, response) => {
    const username = request.body.username
    const pwd = request.body.password

    pool.query(queryType.query_signin(username), (error, results) => {
        if (error) {
            console.log("Login Fails: " + error)
        } else {
            if (results.rowCount < 1) {
                response.json({
                    authentication: false,
                    message: "Username or password is incorrect"
                })
            } else {

                const hash = results.rows[0].password
                if (bcrypt.compareSync(pwd, hash)) {
                    let userInfo = {}
                    let { 
                        name, 
                        role, 
                        mydevice, 
                        search_history 
                    } = results.rows[0]
                    userInfo.name= name
                    userInfo.myDevice = mydevice
                    userInfo.role = role
                    userInfo.searchHistory = search_history

                    request.session.userInfo = userInfo
                    response.json({
                        authentication: true,
                        userInfo
                    })
                } else {
                    response.json({
                        authentication: false,
                        message: "password is incorrect"
                    })
                }
            }
        }

    })

}

const signup = (request, response) => {
    const { username, password } = request.body;
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const signupPackage = {
        username: username,
        password: hash,
    }

    pool.query(queryType.query_signup(signupPackage))
        .then(res => {
            pool.query(`select id from user_table where name='${username}'`)
                .then(res => {
                    let user_id = res.rows[0].id
                    pool.query(`insert into user_roles (user_id, role_id) values(${user_id}, 2)`)
                        .then(res => {
                            console.log('Sign up Success')
                            response.status(200).json(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch((err,res) => {
            console.log("Signup Fails!" + err)
        })
}

const getUserInfo = (request, response) => {
    const username = request.body.username;
    pool.query(queryType.query_getUserInfo(username))
        .then(res => {
            console.log('Get user info Fails!')
            response.status(200).json(res)
        })
        .catch(error => {
            console.log('Get user info Fails! error: ' + error)
        })
    
}

const addUserSearchHistory = (request, response) => {
    const { username, history } = request.body;
    pool.query(queryType.query_addUserSearchHistory(username, history), (error, results) => {
        if (error) {
            console.log('Add user search history fails: ' + error)
        } else {
            console.log('Add user searech history success')
        }
        response.status(200).json(results)
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
    // console.log(result)
    var {foundResult, notFoundResult, user} = request.body
    var header = "<h1 style='text-align: center; class='text-capitalize'>" + "Checked By " + 'Joechou' +  ' Day Shift' + "</h1>"
    var timestamp = "<h3 style='text-align: center;'>" + moment().format('LLLL') + "</h3>"

    function generateTable(title, types, lists, attributes){
        var html = "<div>"
        html += "<h2 style='text-align: center;'>" + title + "</h2>"
        html += "<table border='1' style='width:100%;word-break:break-word;'>";
        html += "<tr>";
        for(var i in types){
            html += "<th >" + types[i] + "</th>";
        }
        for (var i of lists){
            html += "<tr>";
            for(var j of attributes){
                html += "<td>"+ i[j] +"</td>";
            }
        }
        html += "</table></div>"

        return html
    }

    // foundResult to Table
    
    var types = ["Name", "Type", "ACN", "Location"]
    var attributes = ["name", "type", "access_control_number", "location_description"]

    var title = "Results are Found"
    var lists = foundResult
    var foundTable = generateTable(title, types, lists, attributes)


    var title = "Results are NOT Found "
    var lists = notFoundResult
    var notFoundTable = lists.length !== 0 ? generateTable(title, types, lists, attributes) : '';


    
    
    var options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
            "top": "0.3in",            // default is 0, units: mm, cm, in, px
            "right": "2in",
            "bottom": "0.3in",
            "left": "2in"
        },
        "timeout": "120000"
    };
    var html = header + timestamp + foundTable + notFoundTable
    var filePath = `save_file_path/joechou_day_shift_${moment().format('LLLL')}.pdf`
    pdf.create(html, options).toFile(filePath, function(err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
        response.status(200).json(filePath)
    });
}

const modifyUserDevices = (request, response) => {
    const {username, mode, acn} = request.body
    console.log(request.body)
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
    var query = queryType.query_getShiftChangeRecord()
    pool.query(query, (error, results) => {
        if (error) {
            console.log('save pdf file fails ' + error)
        } else {
            response.status(200).json(results)
            console.log('save pdf file success')
        }
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
    validateUsername
}