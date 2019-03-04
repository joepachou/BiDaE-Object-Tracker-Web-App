const Pool = require('pg').Pool
const config = require('./config')
const pool = new Pool(config.db)

const query1 = `
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, object_mac_address, name, lbeacon_uuid, avg(rssi) 
    from tracking_table 
    INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address 
    where final_timestamp > NOW() - interval '30 seconds' AND rssi > -100 AND object_mac_address='df:ff:ff:ff:ff:ff'
    GROUP BY thirty_seconds, name, object_mac_address, lbeacon_uuid 
    ORDER BY thirty_seconds DESC` ;
const getUsers = (request, response) => {
    pool.query(query1, (error, results) => {        
        if (error) {
            console.log(error)
        }
        console.log('Get data!')
    
        response.status(200).json(results)
    })
}

module.exports = {
    getUsers,
}