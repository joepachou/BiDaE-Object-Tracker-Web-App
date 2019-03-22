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
    pool.query(queryType.query_getTrackingData, (error, results) => {        
        if (error) {
            console.log("Get data fails : " + error)
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
    
module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
}