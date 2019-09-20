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
			lbeacon_table.description as location_description,
			edit_object_record.notes

		FROM object_summary_table

		LEFT JOIN object_table
		ON object_table.mac_address = object_summary_table.mac_address

		LEFT JOIN lbeacon_table
		ON lbeacon_table.uuid = object_summary_table.uuid

		LEFT JOIN edit_object_record
		ON object_table.note_id = edit_object_record.id

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
			access_control_number = $5,
			name = $6,
			monitor_type = $7
		WHERE mac_address = $1
		`;
		
	const values = [
		formOption.mac_address, 
		formOption.type, 
		formOption.status, 
		formOption.transferred_location ? formOption.transferred_location.value : null, 
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
		VALUES($1, $2, $3, $4, $5, $6, now(), $7)
		`;
		
	const values = [
		formOption.type, 
		formOption.status, 
		formOption.transferred_location ? formOption.transferred_location.value : null, 
		formOption.access_control_number, 
		formOption.name, 
		formOption.mac_address, 
		formOption.monitor_type
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
		WHERE access_control_number IN (${formOption.map(item => `'${item.access_control_number}'`)});
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
			user_table.search_history

		FROM user_table

		LEFT JOIN user_roles
		ON user_roles.user_id = user_table.id

		LEFT JOIN roles
		ON user_roles.role_id = roles.id

		WHERE user_table.name = $1;
		
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
		INSERT INTO user_table (name, password, registered_timestamp)
		VALUES ($1, $2, now());
		`;
	const values = [signupPackage.username, signupPackage.password,];

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
			roles.name AS role_type 
		FROM user_table  
		INNER JOIN (
			SELECT * 
			FROM user_roles
			INNER JOIN roles ON user_roles.role_id = roles.id
		) roles
		ON user_table.id = roles.user_id
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

const query_removeUser = (username) => {
	const query = `
		DELETE FROM user_roles 
		WHERE user_id = (
			SELECT id 
			FROM user_table 
			WHERE name='${username}'
			); 
		
		DELETE FROM user_table 
		WHERE name = '${username}';
	`
	return query
}

const query_setUserRole = (role, username) => {
	const query = `
		UPDATE user_roles
		SET role_id = (
			SELECT id 
			FROM roles 
			where name='${role}'
		)
		WHERE user_roles.user_id = (
			SELECT id 
			FROM user_table 
			WHERE name='${username}'
		);
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

const query_insertUserRole = (username, role) => {
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
			ARRAY [${formOption.map(item => `'${item.access_control_number}'`)}]
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

const query_addShiftChangeRecord = (username, file_path) => {
	const query = `
		INSERT INTO shift_change_record (
			user_id, 
			submit_timestamp, 
			file_path
		)
		VALUES (
			(
				SELECT id
				FROM user_table
				WHERE name='${username}'
			), 
			now(), 
			'${file_path}'
		);
	`
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
	query_getUserList,
	query_getUserRole,
	query_getRoleNameList,
	query_removeUser,
	query_setUserRole,
	query_getEditObjectRecord,
	query_deleteEditObjectRecord,
	query_setShift,
	query_setVisitTimestamp,
	query_insertUserRole,
	query_addEditObjectRecord,
	query_addShiftChangeRecord
}