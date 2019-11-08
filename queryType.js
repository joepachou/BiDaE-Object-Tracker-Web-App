function query_getTrackingData () {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.panic_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
			object_summary_table.geofence_violation_timestamp,
			object_summary_table.geofence_uuid,
			object_summary_table.geofence_rssi,
			object_summary_table.perimeter_valid_timestamp,
			object_summary_table.geofence_key,
			object_table.name,
			object_table.type,
			object_table.status,
			object_table.transferred_location,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			object_table.physician_id,
			split_part(object_table.asset_control_number, '-', 3) as last_four_acn,
			lbeacon_table.description as location_description,
			edit_object_record.notes,
			user_table.name as physician_name,
			notification.violation_timestamp

		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN edit_object_record
		ON object_table.note_id = edit_object_record.id

		LEFT JOIN user_table
		ON user_table.id = object_table.physician_id

		LEFT JOIN (
			SELECT 
				mac_address,
				MIN(violation_timestamp) as violation_timestamp
			FROM (
				SELECT 
					mac_address,
					violation_timestamp
				FROM notification_table
				WHERE 
					web_processed is null
			)	as temp
			GROUP BY mac_address
		) as notification

		ON notification.mac_address = object_summary_table.mac_address

		ORDER BY object_table.type, object_table.mac_address DESC;
	`
	return query;
}



const query_getObjectTable = (area_id) => {

	let text = '';
	if (!area_id) {
		text += `
			SELECT 
				object_table.name, 
				object_table.type, 
				object_table.asset_control_number, 
				object_table.status, 
				object_table.transferred_location, 
				object_table.mac_address,
				object_table.monitor_type,
				object_table.area_id,
				object_table.object_type

			FROM object_table 

			ORDER BY object_table.name ASC	
		`;
	} else {
		text +=`
			SELECT 
				object_table.name, 
				object_table.type, 
				object_table.asset_control_number, 
				object_table.status, 
				object_table.transferred_location, 
				object_table.mac_address,
				object_table.monitor_type,
				object_table.area_id,
				object_table.object_type

			FROM object_table 
			WHERE object_table.area_id = ${area_id[0]}

			ORDER BY object_table.name ASC	
		`;
	}
	return text
} 


// WHERE object_table.object_type = '2'
const query_getPatientTable = (area_id) => {

	let text = '';
	if (!area_id) {
		text += `
			SELECT 
				object_table.name, 
				object_table.id,
				object_table.area_id,
				object_table.room_number, 
				object_table.physician_id,
				object_table.mac_address
			FROM object_table 

			WHERE object_table.physician_id > 0

			ORDER BY object_table.name ASC	
		`;
	} else {
		
		text +=`
		   
			SELECT 
				object_table.name, 
				object_table.id,
				object_table.area_id, 
				object_table.room_number, 
				object_table.physician_id,
				object_table.mac_address
			FROM object_table 

			WHERE object_table.area_id = ${area_id[0]}

			ORDER BY object_table.name ASC	
		`;
	}
	return text
} 




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
	`
	SELECT * 
	FROM geo_fence_alert 
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
			asset_control_number = $5,
			name = $6,
			monitor_type = $7,
			area_id = $8
		WHERE mac_address = $1
		`;
		
	const values = [
		formOption.mac_address, 
		formOption.type, 
		formOption.status, 
		formOption.transferred_location ? formOption.transferred_location.value : null, 
		formOption.asset_control_number, 
		formOption.name,
		formOption.monitor_type,
		formOption.area_id
	];

	const query = {
		text,
		values
	};

	return query;
}



function query_editPatient (formOption) {




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
			asset_control_number, 
			name, 
			mac_address, 
			registered_timestamp,
			monitor_type,
			area_id,
			object_type
		)
		VALUES($1, $2, $3, $4, $5, $6, now(), $7, $8, 0)
		`;
		
	const values = [
		formOption.type, 
		formOption.status, 
		formOption.transferred_location ? formOption.transferred_location.value : null, 
		formOption.asset_control_number, 
		formOption.name, 
		formOption.mac_address, 
		formOption.monitor_type,
		formOption.area_id
	];

	const query = {
		text,
		values
	};

	return query;
}










function query_addPatient (formOption) {
	const text = 
		`
		INSERT INTO object_table (
			name,
			room_number,
			physician_id,
			area_id,
			mac_address, 
			type,
			registered_timestamp
		)
		VALUES($1,$2,$3,$4,$5,'Patient',now())
		`;
		
	const values = [
		formOption.patientName,
		formOption.roomNumber,
		formOption.attendingPhysician,
		formOption.area_id,
		formOption.mac_address
	];

	const query = {
		text,
		values
	};

	return query;
}





















const query_editObjectPackage = (formOption, record_id) => {
	let item = formOption[0]
	let text = `
		UPDATE object_table
		SET 
			status = '${item.status}',
			transferred_location = '${item.transferred_location ? item.transferred_location.value : ' '}',
			note_id = ${record_id}
		WHERE asset_control_number IN (${formOption.map(item => `'${item.asset_control_number}'`)});
	`
	return text
}

function query_signin(username) {

	const text =
		`
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role, 
			user_table.mydevice, 
			user_table.search_history,
			user_table.shift,
			user_table.id,
			array (
				SELECT area_id
				FROM user_areas
				WHERE user_areas.user_id = user_table.id
			) as areas_id

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
		INSERT INTO user_table 
			(
				name, 
				password,
				shift,
				registered_timestamp
			)
		VALUES (
			$1, 
			$2, 
			$3,
			now()
		);
		`;
	const values = [
		signupPackage.username, 
		signupPackage.password,
		signupPackage.shiftSelect,
	];

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

function query_addUserSearchHistory (username, searchHistory) {
	const text = `
		UPDATE user_table
		SET search_history = $1
		WHERE name = $2
	`;

	const values = [searchHistory, username];

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
	var text = ""
	if(mode === 'add'){
		text = `
			UPDATE user_table 
			SET mydevice = array_append(mydevice, '${acn}') 
			WHERE name = '${username}';
		`
	}else if(mode === 'remove'){
		text = `
			UPDATE user_table 
			SET mydevice = array_remove(mydevice, '${acn}') 
			WHERE name = '${username}';
		`	
	}else{
		text = ""
	}

	return text
	
}

function query_getShiftChangeRecord(){
	const query = `
		SELECT 
			shift_change_record.id,
			shift_change_record.file_path,
			shift_change_record.submit_timestamp,
			shift_change_record.shift,
			user_table.name as user_name
		FROM shift_change_record
		
		LEFT JOIN user_table
		ON user_table.id = shift_change_record.user_id
	`
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

const query_getUserList = () => {
	const query = `
		SELECT 
			user_table.name, 
			user_table.registered_timestamp,
			user_table.last_visit_timestamp,
			user_table.shift,
			roles.name AS role_type 
		FROM user_table  
		INNER JOIN (
			SELECT * 
			FROM user_roles
			INNER JOIN roles ON user_roles.role_id = roles.id
		) roles
		ON user_table.id = roles.user_id
		ORDER BY user_table.name DESC
	`
	return query
}

const query_getUserRole = (username) => {
	const query = `select name      from roles      where 
		id=(       select role_id   from user_roles where 
		user_id=(  select id        from user_table where name='${username}'));`
	return query
}

const query_getRoleNameList = () => {
	const query = `
		SELECT 
			name 
		FROM roles;
	`
	return query
}

const query_deleteUser = (username) => {
	
	const query = `
		DELETE FROM user_roles 
		WHERE user_id = (
			SELECT id 
			FROM user_table 
			WHERE name='${username}'
		); 

		DELETE FROM user_table 
		WHERE id = (
			SELECT id 
			FROM user_table
			WHERE name='${username}'
		);
	`
	return query
}

const query_setUserRole = (username, roleSelect, shiftSelect) => {
	const query = `
		UPDATE user_roles
		SET role_id = (
			SELECT id 
			FROM roles 
			where name='${roleSelect}'
		)
		WHERE user_roles.user_id = (
			SELECT id 
			FROM user_table 
			WHERE name='${username}'
		);
		UPDATE user_table
		SET shift = '${shiftSelect.value}'
		WHERE name = '${username}';
	`
	return query
}

const query_getEditObjectRecord = () => {
	const query = `
		SELECT
			user_table.name,
			edit_object_record.id,
			edit_object_record.edit_time,
			edit_object_record.notes,
			edit_object_record.new_status
		FROM edit_object_record

		LEFT JOIN user_table
		ON user_table.id = edit_object_record.edit_user_id

		ORDER BY edit_object_record.edit_time DESC

	`
	return query
}

const query_deleteEditObjectRecord = (idPackage) => {
	const query = `
		DELETE FROM edit_object_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

const query_setShift = (shift, username) => {
	const query = `
		update user_table
		set shift='${shift}'
		where name='${username}'
	`
	return query
}

const query_setVisitTimestamp = (username) => {
	return `
		UPDATE user_table
		SET last_visit_timestamp=now()
		WHERE name='${username}';
	`
}

const query_insertUserData = (username, role, area_id) => {
	return `
		INSERT INTO user_roles (user_id, role_id)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name='${username}'
			), 
			(
				SELECT id 
				FROM roles
				WHERE name='${role}'
			)
		);
		INSERT INTO user_areas (user_id, area_id)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name='${username}'
			), 
			${area_id}
		)
	`
}

const query_addEditObjectRecord = (formOption, username) => {
	let item = formOption[0]
	const text = `
		INSERT INTO edit_object_record (
			edit_user_id, 
			edit_time, 
			notes, 
			new_status, 
			new_location, 
			edit_objects
		)
		VALUES (
			(
				SELECT id 
				FROM user_table 
				WHERE name = $1
			),
			now(),
			$2,
			$3,
			'${item.transferred_location ? item.transferred_location.value : ' '}',
			ARRAY [${formOption.map(item => `'${item.asset_control_number}'`)}]
		)
		RETURNING id;
	`
	const values = [
		username,
		item.notes,
		item.status,
	]

	const query = {
		text, 
		values
	}
	return query

}

const query_addShiftChangeRecord = (userInfo, file_path) => {
	const query = `
		INSERT INTO shift_change_record (
			user_id, 
			shift,
			submit_timestamp, 
			file_path
		)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name='${userInfo.name}'
			), 
			'${userInfo.shift}',
			now(), 
			'${file_path}'
		);
	`
	return query
}

const query_getAreaTable = () => {
	return `
		SELECT 
			id,
			name
		FROM area_table
	`
}

const query_getGeoFenceConfig = (areaId) => {
	return `
		SELECT
			*
		FROM geo_fence_config
	;`
}

const query_setGeoFenceConfig = (value, areaId) =>{
	return `
		UPDATE geo_fence_config
		SET enable = ${value}
		WHERE id = ${areaId}
	`
}

const query_checkoutViolation = (mac_address) => {
	return `
		UPDATE notification_table
		SET web_processed = 1
		WHERE (
			mac_address = '${mac_address}'
			AND violation_timestamp < NOW()
		) 	
	`
}

const query_confirmValidation = (username) => {
	let text = `
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role

		FROM user_table

		LEFT JOIN user_roles
		ON user_roles.user_id = user_table.id

		LEFT JOIN roles
		ON user_roles.role_id = roles.id

		WHERE user_table.name = $1;
	`

	const values = [username];

	const query = {
		text,
		values
	};

	return query;

}

module.exports = {
    query_getTrackingData,
	query_getObjectTable,
	query_getPatientTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getGeofenceData,
	query_editObject,
	query_editPatient,
	query_addObject,
	query_addPatient,
	query_editObjectPackage,
	query_signin,
	query_signup,
	query_getUserInfo,
	query_addUserSearchHistory,
	query_editLbeacon,
	query_modifyUserDevices,
	query_getShiftChangeRecord,
	query_validateUsername,
	query_getUserList,
	query_getUserRole,
	query_getRoleNameList,
	query_deleteUser,
	query_setUserRole,
	query_getEditObjectRecord,
	query_deleteEditObjectRecord,
	query_setShift,
	query_setVisitTimestamp,
	query_insertUserData,
	query_addEditObjectRecord,
	query_addShiftChangeRecord,
	query_getAreaTable,
	query_getGeoFenceConfig,
	query_setGeoFenceConfig,
	query_checkoutViolation,
	query_confirmValidation
}