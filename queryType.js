
const query_getTrackingData =
    `
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, object_mac_address, lbeacon_uuid, avg(rssi) 
    from tracking_table 
    where final_timestamp > NOW() - interval '1 minutes' 
    AND rssi > -50 
    AND object_mac_address::TEXT LIKE '%:ff:ff:ff:ff'
    GROUP BY thirty_seconds, object_mac_address, lbeacon_uuid 
    ORDER BY thirty_seconds DESC`; 

    // `
    // select time_bucket('30 seconds', final_timestamp) 
    // as thirty_seconds, object_mac_address, name, lbeacon_uuid, avg(rssi) 
    // from tracking_table 
    // INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address 
    // where final_timestamp > NOW() - interval '30 seconds' AND rssi > -55 
    // GROUP BY thirty_seconds, name, object_mac_address, lbeacon_uuid 
    // ORDER BY thirty_seconds DESC` ;


const query_getObjectTable = `
    select id, type, name, mac_address, available_status, asset_owner_id, user_id, registered_timestamp
    from object_table`;

const query_getLbeaconTable = 
    `
    select uuid, last_report_timestamp from lbeacon_table ORDER BY last_report_timestamp DESC`;
    // `
    // select * from lbeacon_table ORDER BY last_report_timestamp DESC`;

const query_getGatewayTable = 
    `
    select id, last_report_timestamp, ip_address from gateway_table ORDER BY last_report_timestamp DESC`;
    // `
    // select * from gateway_table ORDER BY last_report_timestamp DESC`;

module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
    query_getGatewayTable,
}

