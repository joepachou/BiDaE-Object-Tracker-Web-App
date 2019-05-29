require('dotenv').config();
const moment = require('moment-timezone');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})

const queryType = require ('./queryType')


const getTrackingData = (request, response) => {
    const modifiedRssi = request.body.rssi || undefined;
    // console.log(modifiedRssi)
    pool.query(queryType.query_getTrackingData(modifiedRssi), (error, results) => {        
        if (error) {
            console.log("Get trackingData fails : " + error)
        }
        console.log('Get tracking data!')


        response.status(200).json(results)
    })
}

const getObjectTable = (request, response) => {
    pool.query(queryType.query_getObjectTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        }
        console.log('Get objectTable data!')
    
        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
            item.last_report_timestamp = localLastReportTimeStamp.format();
        })
        response.status(200).json(results)
    })
}

const getLbeaconTable = (request, response) => {
    pool.query(queryType.query_getLbeaconTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
        }
        console.log('Get lbeaconTable data!')
    
        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
            item.last_report_timestamp = localLastReportTimeStamp.format();
        })
        response.status(200).json(results)
    })
}

const getGatewayTable = (request, response) => {
    pool.query(queryType.query_getGatewayTable, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)                
        }
        console.log('Get gatewayTable data!')

        results.rows.map(item => {
            const localLastReportTimeStamp = moment(item.last_report_timestamp).tz(process.env.TZ);
            item.last_report_timestamp = localLastReportTimeStamp.format();
        })
        response.status(200).json(results)
    })
}

const getGeofenceData = (request, response) => {
    pool.query(queryType.query_getGeofenceData, (error, results) => {
        if (error) {
            console.log("Get Geofence Data fails: " + error)
        } else {
            console.log("Get Geofence Data")
        }

        response.status(200).json(results);
        
    })
}

const getSearchResult = (request, response) => {
    const searchKey = request.body.searchkey
    pool.query(queryType.query_getSearchResult(searchKey), (error, results) => {
        if (error) {
            console.log("Get Search Result fails: " + error) 
        } else {
            console.log("Get Search Result");
        }

        response.status(200).json(results)
    })
}

const editObject = (request, response) => {
    console.log(request.body);
    pool.query(queryType.query_editObject(), (error, results) => {
        if (error) {
            console.log("Edit Object Fails: " + error)
        } else {
            console.log("Edit Object Success");
        }
        
        response.status(200).json(results)

    })
}
    
module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    getSearchResult,
    getGeofenceData,
    editObject,
}