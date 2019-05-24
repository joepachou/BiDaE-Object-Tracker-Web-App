
function query_getTrackingData (rssi = -55) {
	return `
	SELECT table_location.object_mac_address, table_device.name, table_location.lbeacon_uuid, table_location.avg as avg, table_location.avg_stable as avg_stable, table_location.panic_button as panic_button 
	FROM 
	(SELECT table_track_data.object_mac_address, table_track_data.lbeacon_uuid, table_track_data.avg as avg, table_track_data.avg_stable as avg_stable, table_panic.panic_button as panic_button 
	     FROM
		(SELECT table_recent.object_mac_address, table_recent.lbeacon_uuid, table_recent.rssi as avg, table_stable.avg_stable as avg_stable 
		 FROM 
	        (SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi
		     FROM tracking_table
		        WHERE final_timestamp >= NOW() - INTERVAL '10 seconds'  
		        AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '3 seconds'  
		        GROUP BY object_mac_address, lbeacon_uuid
				HAVING avg(rssi) > -65
		    ) as table_recent 
		
		    LEFT JOIN
		
		    (SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as avg_stable
		     FROM tracking_table 
		        WHERE final_timestamp >= NOW() - INTERVAL '70 seconds'
		        AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '60 seconds' 
		        GROUP BY object_mac_address, lbeacon_uuid
		        HAVING avg(rssi) > -65 and count(object_mac_address) >= 40
		    ) as table_stable 
		
		    ON table_recent.object_mac_address = table_stable.object_mac_address 
		    AND table_recent.lbeacon_uuid = table_stable.lbeacon_uuid
        ) as table_track_data	    
		     
		LEFT JOIN
		
		(SELECT object_mac_address, lbeacon_uuid, max(panic_button) as panic_button 
		 FROM tracking_table
            WHERE final_timestamp >= NOW() - INTERVAL '190 seconds'
            AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '180 seconds'
            GROUP BY object_mac_address, lbeacon_uuid			
		    HAVING max(panic_button) > 0
		) as table_panic		
		
		ON table_track_data.object_mac_address = table_panic.object_mac_address 
		AND table_track_data.lbeacon_uuid = table_panic.lbeacon_uuid
	) as table_location
	
	LEFT JOIN
	
	(SELECT mac_address, name
	 FROM object_table
	) as table_device
		
	ON table_location.object_mac_address = table_device.mac_address 
	
	ORDER BY object_mac_address ASC, lbeacon_uuid ASC
	`;
}


const query_getObjectTable = `
    select *
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

const query_getGeofenceData = 
	`
	SELECT * FROM geo_fence_alert
	`;
	

function query_getSearchResult (searchKey) {
	return `	
		select * from object_table where name='${searchKey}'
	`;
	
}


module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getSearchResult,
	query_getGeofenceData,
}

