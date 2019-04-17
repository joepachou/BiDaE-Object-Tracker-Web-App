
const query_getTrackingData =
    `
	SELECT  table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.rssi as avg_stable FROM 
	    (
	    SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi FROM tracking_table 
		WHERE final_timestamp > NOW() - INTERVAL '5 seconds'  
		AND object_mac_address::TEXT LIKE 'c1:%' 
		GROUP BY object_mac_address, lbeacon_uuid
		HAVING avg(rssi) > -50
		) as table1 
		LEFT JOIN
		(
		SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi 
		FROM tracking_table 
		WHERE final_timestamp > NOW() - INTERVAL '120 seconds' 
		AND final_timestamp < NOW() - INTERVAL '5 seconds' 
		AND object_mac_address::TEXT LIKE 'c1:%' 
		GROUP BY object_mac_address, lbeacon_uuid
		HAVING avg(rssi) > -55
		) as table2 
		ON table1.object_mac_address = table2.object_mac_address 
		AND table1.lbeacon_uuid = table2.lbeacon_uuid 
		ORDER BY table1.object_mac_address DESC, table1.lbeacon_uuid ASC;
		`;
		/*
		`
		SELECT table1.name, table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.rssi as avg_stable FROM 
			(
			SELECT name, object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi FROM tracking_table 
			INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address 
			WHERE final_timestamp > NOW() - INTERVAL '30 seconds'  
			AND object_mac_address::TEXT LIKE 'c1:%' 
			GROUP BY object_mac_address, lbeacon_uuid, object_table.name 
			HAVING avg(rssi) > -45
			) as table1 
			LEFT JOIN
			(
			SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi 
			FROM tracking_table 
			WHERE final_timestamp > NOW() - INTERVAL '180 seconds' 
			AND final_timestamp < NOW() - INTERVAL '30 seconds' 
			AND object_mac_address::TEXT LIKE 'c1:%' 
			GROUP BY object_mac_address, lbeacon_uuid
			HAVING avg(rssi) > -45
			) as table2 
			ON table1.object_mac_address = table2.object_mac_address 
			AND table1.lbeacon_uuid = table2.lbeacon_uuid 
			ORDER BY table1.object_mac_address DESC;
			`;
			*/

/*
    `
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, name, object_mac_address, lbeacon_uuid, avg(rssi) 
    from tracking_table 
	INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address
    where final_timestamp > now() - interval '30 seconds'
    AND rssi > -50
	AND object_mac_address::TEXT LIKE 'c1:%'
    GROUP BY thirty_seconds, object_mac_address, lbeacon_uuid, object_table.name
    ORDER BY thirty_seconds DESC`; 
*/


const query_getObjectTable = `
    select id, type, name, mac_address, available_status, asset_owner_id, user_id, registered_timestamp
    from object_table ORDER BY name ASC`;

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

