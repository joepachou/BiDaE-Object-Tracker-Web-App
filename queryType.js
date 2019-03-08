
const query_getTrackingData = `
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, object_mac_address, lbeacon_uuid, avg(rssi) 
    from tracking_table 
    where final_timestamp > NOW() - interval '30 seconds' AND rssi > -55 
    GROUP BY thirty_seconds, object_mac_address, lbeacon_uuid 
    ORDER BY thirty_seconds DESC` ;

/**  
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, object_mac_address, name, lbeacon_uuid, avg(rssi) 
    from tracking_table 
    INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address 
    where final_timestamp > NOW() - interval '30 seconds' AND rssi > -55 
    GROUP BY thirty_seconds, name, object_mac_address, lbeacon_uuid 
    ORDER BY thirty_seconds DESC` ;
*/

const query_getObjectTable = `
    select id, type, name, mac_address, available_status, asset_owner_id, user_id, registered_timestamp
    from object_table`;

module.exports = {
    query_getTrackingData,
    query_getObjectTable,
}

//AND object_mac_address='df:ff:ff:ff:ff:ff'