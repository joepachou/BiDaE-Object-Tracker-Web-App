
function query_getTrackingData (rssi = -55) {
	const text = `
	SELECT table_location.object_mac_address, 
		   table_device.name, 
		   table_device.type,
		   table_device.access_control_number,
		   table_device.status,
		   table_device.transferred_location,
		   table_location.lbeacon_uuid, 
		   table_location.avg as avg, 
		   table_location.panic_button as panic_button, 
		   table_location.geofence_type as geofence_type ,
		   lbeacon_table.description as location_description
	FROM
	
	    (
	    SELECT table_track_data.object_mac_address, 
		       table_track_data.lbeacon_uuid, 
			   table_track_data.avg as avg, 
			   table_panic.panic_button as panic_button, 
			   NULL as geofence_type 
	    FROM
		
		    (
			SELECT object_mac_address, 
				   lbeacon_uuid, 
				   round(avg(rssi),2) as avg
		    FROM tracking_table
		        WHERE final_timestamp >= NOW() - INTERVAL '15 seconds'  
		        AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '5 seconds'
                GROUP BY object_mac_address, lbeacon_uuid
				HAVING avg(rssi) > $1
            ) as table_track_data	    
		     
		    LEFT JOIN
		
		    (
			SELECT object_mac_address, 
			       lbeacon_uuid, 
				   max(panic_button) as panic_button 
		    FROM tracking_table
                WHERE final_timestamp >= NOW() - INTERVAL '190 seconds'
                AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '180 seconds'
                GROUP BY object_mac_address, lbeacon_uuid			
		        HAVING max(panic_button) > 0
		    ) as table_panic	
		
		    ON table_track_data.object_mac_address = table_panic.object_mac_address 
		    AND table_track_data.lbeacon_uuid = table_panic.lbeacon_uuid
	
	    UNION
	
	    SELECT mac_address as object_mac_address, 
		       uuid as lbeacon_uuid, 
			   MAX(rssi) as avg, 
			   NULL panic_button, 
			   type as geofence_type 
	    FROM geo_fence_alert 
	        WHERE receive_time >= NOW() - INTERVAL '5 seconds'
		    GROUP BY mac_address, uuid, type
    
	        ORDER BY object_mac_address ASC, lbeacon_uuid ASC
     
	    ) as table_location
	
	    INNER JOIN 
	
	    (
		SELECT mac_address, name, type, access_control_number, status, transferred_location
	    FROM object_table
	    ) as table_device
	
		ON table_location.object_mac_address = table_device.mac_address
		
		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid=table_location.lbeacon_uuid

		ORDER BY table_device.type ASC, object_mac_address ASC;
    
	`;

	const values = [rssi]

	const query = {
		text,
		values
	}

	 return query
}



const query_getObjectTable = 
	`
    SELECT id, name, type, access_control_number, status, transferred_location, mac_address
	FROM object_table ORDER BY name ASC
	`;

const query_getLbeaconTable = 
    `
	SELECT uuid, description, ip_address, health_status, gateway_ip_address, last_report_timestamp 
	FROM lbeacon_table 
	ORDER BY last_report_timestamp DESC
	`;

const query_getGatewayTable = 
    `
    select ip_address, health_status, last_report_timestamp from gateway_table ORDER BY last_report_timestamp DESC`;
    // `
	// select * from gateway_table ORDER BY last_report_timestamp DESC`;

const query_getGeofenceData = 
	// `
	// SELECT * FROM geo_fence_alert 
	// WHERE receive_time > current_timestamp - INTERVAL '7 days'
	// order by receive_time DESC 
	// `;
	`
	SELECT * FROM geo_fence_alert 
	ORDER BY receive_time DESC 
	LIMIT 50
	`;
	

function query_editObject (formOption) {
	const text = 
		`
		Update object_table 
		SET type = $2,
			status = $3,
			transferred_location = $4,
			access_control_number = $5,
			name = $6
		WHERE mac_address = $1
		`;
		
	const values = [formOption.mac_address, formOption.type, formOption.status, formOption.transferredLocation.value, formOption.access_control_number, formOption.name];

	const query = {
		text,
		values
	};

	return query;
}

function query_signin(username) {

	const text =
		`
		SELECT password
		FROM user_table
		WHERE name= $1
		`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query;
	
}

function query_signup(signupPackage) {

	const text = 
		`
		INSERT INTO user_table (name, password)
		VALUES ($1, $2)
		`;
	const values = [signupPackage.username, signupPackage.password];

	const query = {
		text,
		values
	};

	return query
}

function query_getUserInfo(username) {
	const text =  `
	SELECT name, mydevice from user_table where name= $1
	`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query
}

function query_getUserSearchHistory (username) {
	const text = `
		SELECT search_history from user_table where name=$1
	`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query
}

function query_addUserSearchHistory (username, history) {
	const text = `
		UPDATE user_table
		SET search_history = $1
		WHERE name = $2
	`;

	const values = [history, username];

	const query = {
		text, 
		values
	};

	return query
}


module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getGeofenceData,
	query_editObject,
	query_signin,
	query_signup,
	query_getUserInfo,
	query_getUserSearchHistory,
	query_addUserSearchHistory
}

