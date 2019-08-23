function query_getTrackingData () {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.geofence_type,
			object_summary_table.panic_timestamp,
			object_summary_table.geofence_violation_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_table.name,
			object_table.type,
			object_table.status,
			object_table.transferred_location,
			object_table.access_control_number,
			split_part(object_table.access_control_number, '-', 3) as last_four_acn,
			lbeacon_table.description as location_description

		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		ORDER BY object_table.type ASC, object_table.name ASC, last_four_acn ASC;
	`
	return query;
}



const query_getObjectTable = 
	`
	SELECT 
		name, 
		type, 
		access_control_number, 
		status, 
		transferred_location, 
		mac_address,
		monitor_type
	FROM object_table ORDER BY name ASC
	`;

const query_getLbeaconTable = 
    `
	SELECT 
		uuid, 
		low_rssi, 
		med_rssi, 
		high_rssi, 
		description, 
		ip_address, 
		health_status, 
		gateway_ip_address, 
		last_report_timestamp 
	FROM lbeacon_table 
	ORDER BY last_report_timestamp DESC
	`;

const query_getGatewayTable = 
    `
	SELECT 
		ip_address, 
		health_status, 
		last_report_timestamp,
		registered_timestamp 
	FROM 
		gateway_table 
	ORDER BY last_report_timestamp DESC`;

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
			name = $6,
			monitor_type = $7
		WHERE mac_address = $1
		`;
		
	const values = [
		formOption.mac_address, 
		formOption.type, 
		formOption.status, 
		formOption.transferredLocation, 
		formOption.access_control_number, 
		formOption.name,
		formOption.monitor_type
	];

	const query = {
		text,
		values
	};

	return query;
}

function query_addObject (formOption) {
	const text = 
		`
		INSERT INTO object_table (
			type, 
			status, 
			transferred_location, 
			access_control_number, 
			name, mac_address, 
			registered_timestamp,
			monitor_type
		)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8)
		`;
		
	const values = [
		formOption.type, 
		formOption.status, 
		formOption.transferredLocation ? formOption.transferredLocation.value : null, 
		formOption.access_control_number, 
		formOption.name, 
		formOption.mac_address, 
		formOption.registered_timestamp,
		formOption.monitor_type
	];

	const query = {
		text,
		values
	};

	return query;
}

function query_editObjectPackage (formOption) {
	
	let query = '';
	formOption.map(item => {
		query += `
			Update object_table 
			SET status = '${item.status}',
				transferred_location = '${item.transferredLocation}'
			WHERE mac_address = '${item.mac_address}';
		`;
	})

	// const text = `
	// 	UPDATE object_table as origin 
	// 	SET
	// 		status = package.status,
	// 		transferred_location = package.transferredLocation
	// 	FROM (values
	// 		${formOption.map()}
	// 		()
	// 	) as package(mac_address, status, transferredLocation)
	// 	WHERE package.mac_address = origin.mac_address
	
	// `

	return query
}

function query_signin(username) {

	const text =
		`
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role, 
			user_table.mydevice, 
			user_table.search_history

		FROM user_table

		LEFT JOIN user_roles
		ON user_roles.user_id = user_table.id

		LEFT JOIN roles
		ON user_roles.role_id = roles.id

		WHERE user_table.name = $1
		
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
		VALUES ($1, $2);
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
	SELECT name, mydevice, search_history from user_table where name= $1
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

function query_editLbeacon (uuid, low, med, high, description) {
	const text =
		`
		UPDATE lbeacon_table
		SET low_rssi = $1,
			med_rssi = $2,
			high_rssi = $3,
			description = $5
		WHERE uuid = $4
	`;

	const values = [low, med, high, uuid, description]

	const query = {
		text, 
		values
	};

	return query
}

function query_modifyUserDevices(username, mode, acn){
	console.log(acn)
	var text = ""
	if(mode === 'add'){
		text = `UPDATE user_table SET mydevice = array_append(mydevice, '${acn}') WHERE name = '${username}';`
	}else if(mode === 'remove'){
		text = `UPDATE user_table SET mydevice = array_remove(mydevice, '${acn}') WHERE name = '${username}';`
	}else{
		text = ""
	}

	return text
	
}

function query_getShiftChangeRecord(){
	const query = `SELECT * FROM shift_change_record`
	return query
}

const query_validateUsername = (username) => {
	const text = `
		SELECT 
			name
		FROM
			user_table
		WHERE name=$1
	`

	const values = [
		username
	]

	const query = {
		text, 
		values
	}
	return query
}

module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getGeofenceData,
	query_editObject,
	query_addObject,
	query_editObjectPackage,
	query_signin,
	query_signup,
	query_getUserInfo,
	query_addUserSearchHistory,
	query_editLbeacon,
	query_modifyUserDevices,
	query_getShiftChangeRecord,
	query_validateUsername,
}