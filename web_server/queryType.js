function query_getTrackingData () {
	const query = `
		SELECT 
			object_table.mac_address,
			object_summary_table.id,
			object_summary_table.uuid as lbeacon_uuid,
			object_summary_table.first_seen_timestamp,
			object_summary_table.last_seen_timestamp,
			object_summary_table.panic_violation_timestamp,
			object_summary_table.rssi,
			object_summary_table.battery_voltage,
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
			notification.json_agg as notification

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
				json_agg(json_build_object(
						'type', monitor_type, 
						'time', violation_timestamp)
					)
			FROM (
				SELECT 
					mac_address,
					monitor_type,
					MIN(violation_timestamp) as violation_timestamp
				FROM (
					SELECT 
						mac_address,
						monitor_type,
						violation_timestamp
					FROM notification_table
					WHERE 
						web_processed is null
				)	as tmp_1
				GROUP BY mac_address, monitor_type
			) as tmp_2
			GROUP BY mac_address
		) as notification
		ON notification.mac_address = object_summary_table.mac_address

		ORDER BY 
			object_table.type, 
			object_table.asset_control_number
			DESC;
	`
	return query;
}


const query_getImportDataFromBinding = () => {

	let text = '';
	
		text +=`
			SELECT 
				object_import_table.name, 
				object_import_table.asset_control_number,
				object_import_table.type,
				object_import_table.id,
				object_import_table.bindflag,
				object_import_table.mac_address
			FROM object_import_table
			Where object_import_table.bindflag = 'Already Binding'

			ORDER BY object_import_table.asset_control_number ASC	
		`;
	
	return text
} 

const query_getObjectTable_fromImport = () => {
	let text = '';
	
		text +=`
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id,
				import_table.bindflag,
				import_table.mac_address,
				import_table.area_id,
				import_table.status,
				import_table.transferred_location,
				import_table.monitor_type
			FROM import_table
			WHERE import_table.bindflag = 'Already Binding'


			ORDER BY import_table.asset_control_number ASC	
		`;
	
	return text
}

const query_getObjectTable = (area_id, ) => {

	let text = '';
	if (!area_id) {
		text += `
			SELECT 
				object_table.id,
				object_table.name, 
				object_table.type, 
				object_table.asset_control_number, 
				object_table.status, 
				object_table.transferred_location, 
				object_table.mac_address,
				object_table.monitor_type,
				object_table.area_id,
				object_table.object_type,
				object_table.id,
				object_table.room
			FROM object_table 
			WHERE object_table.object_type = 0

	

			ORDER BY object_table.name ASC;
		`;
	} else {
		text +=`
			SELECT 
				object_table.id,
				object_table.name, 
				object_table.type, 
				object_table.asset_control_number, 
				object_table.status, 
				object_table.transferred_location, 
				object_table.mac_address,
				object_table.monitor_type,
				object_table.area_id,
				object_table.object_type,
				object_table.id,
				object_table.room

			FROM object_table 
			WHERE object_table.object_type = 0
					
			ORDER BY object_table.type DESC;
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
				import_table.name, 
				import_table.id,
				import_table.area_id,
				import_table.physician_id,
				import_table.mac_address,
				import_table.asset_control_number,
				import_table.object_type,
				import_table.monitor_type,
				import_table.room
			FROM import_table 

			WHERE import_table.object_type != '0'

			ORDER BY import_table.name ASC	
		`;
	} else {
		text +=`
			SELECT 
			import_table.name, 
				import_table.id,
				import_table.area_id,
				import_table.physician_id,
				import_table.mac_address,
				import_table.asset_control_number,
				import_table.object_type,
				import_table.monitor_type,
				import_table.room

			FROM import_table 
			WHERE import_table.object_type != '0'

			ORDER BY import_table.name ASC	
		`;
	}
	return text
} 

const query_getImportTable = () => {

	let text = '';
	
		text +=`
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id,
				import_table.bindflag,
				import_table.mac_address,
				import_table.area_id,
				import_table.status,
				import_table.transferred_location,
				import_table.monitor_type
			FROM import_table


			ORDER BY import_table.bindflag DESC	
		`;
	
	return text
} 


function query_editImportData (formOption) {
	// const test = `
	// 	UPDATE import_table
	// 	SET 
	// 		mac_address = '${formOption[1]}',
	// 		bindflag = '${formOption[4]}'
	// 	WHERE asset_control_number = '${formOption[0]}';
	// `
	const test = `
		INSERT INTO object_table
			(
				asset_control_number,
				mac_address,
				name,
				type,
				registered_timestamp,
				status,
				object_type
			)
		VALUES(
			'${formOption[0]}',
			'${formOption[1]}',
			'${formOption[2]}',
			'${formOption[3]}',
			now(),
			'normal',
			0
		)
	`
	;

	// const values = [
	// 	formOption[0],
	// 	formOption[1],
	// 	formOption[2],
	// 	formOption[3]
	// ]

	// const query = {
	// 	text, 
	// 	values
	// };

	return test;

}

function query_cleanBinding(formOption) {
	const text =
		`
		UPDATE import_table
		SET 
			mac_address = $2,
			bindflag = $3
		WHERE id = $1
	`;

	const values = [
		formOption,
		'',
		'No Binding'
	]

	const query = {
		text, 
		values
	};

	return query


}


function query_getImportData(formOption){
	let	text =	`
		SELECT 
			name, 
			type,
			asset_control_number
		FROM object_table

		WHERE mac_address = $1 
		
		`;

	const values = [formOption];

	const query = {
		text,
		values
	};
	return query;
}



const query_getLbeaconTable = 
    `
	SELECT 
		id,
		uuid, 
		description, 
		ip_address, 
		health_status, 
		gateway_ip_address, 
		last_report_timestamp,
		danger_area,
		room
	FROM lbeacon_table
	ORDER BY last_report_timestamp DESC
	`;

const query_getGatewayTable = 
    `
	SELECT 
		ip_address, 
		health_status, 
		last_report_timestamp,
		registered_timestamp,
		id
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
	

function query_objectImport (idPackage) {

	let text =  `
		INSERT INTO import_table (
			name,
			type,
			asset_control_number,
			bindflag,
			status
		)
		VALUES ${idPackage.map((item) => {
			return `(
				'${item.name}',
				'${item.type}',
				'${item.asset_control_number}',
				'No Binding',
				'normal'
			)`
		})};
	`
	return text	
}


function query_editImport (formOption) {
	const text =
		`
		Update import_table 
		SET type = $1,
			name = $2,
			mac_address = $3,
			area_id = $5,
			status = $6,
			transferred_location = $7,
			monitor_type = $8
		WHERE asset_control_number = $4
		`;
		
	const values = [
		formOption.type, 
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.area_id,
		formOption.status,
		formOption.transferred_location,
		formOption.monitor_type
	];

	const query = {
		text,
		values
	};

	return query;
}


function query_editObject (formOption) {
	let text = 
		`
		Update object_table 
		SET type = $1,
			status = $2,
			transferred_location = $3,
			asset_control_number = $4,
			name = $5,
			monitor_type = $6,
			area_id = $7,
			mac_address = $8
		WHERE asset_control_number = $4
		`
	const values = [
		formOption.type, 
		formOption.status, 
		formOption.transferred_location ? formOption.transferred_location.value : null, 
		formOption.asset_control_number, 
		formOption.name,
		formOption.monitor_type,
		formOption.area_id,
		formOption.mac_address,
	];

	const query = {
		text,
		values
	};

	return query;
}



function query_editPatient (formOption) {

	const text = `
		Update import_table 
		SET name = $1,
			mac_address = $2,
			physician_id = $4,
			area_id = $5,
			object_type = $6,
			room_number = $7,
			type = $8
		WHERE asset_control_number = $3
	`;
		
	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.physician,
		formOption.area_id,
		formOption.gender_id,
		formOption.room,
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
		INSERT INTO import_table (
			type, 
			status, 
			transferred_location, 
			asset_control_number, 
			name, 
			mac_address, 
			registered_timestamp,
			monitor_type,
			area_id,
			object_type,
			bindflag
		)
		VALUES($1, $2, $3, $4, $5, $6, now(), $7, $8, 0,'Already Binding')
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
		INSERT INTO import_table (
			name,
			mac_address, 
			asset_control_number,
			physician_id,
			area_id,
			object_type,
			room_number,
			monitor_type,
			type,
			registered_timestamp
		)
		VALUES($1,$2,$3,$4,$5,$6,$7,$8,'Patient',now())
		`;
	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.physician,
		formOption.area_id,
		formOption.gender_id,
		formOption.room,
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
			note_id = ${record_id},
			reserved_timestamp = ${item.status == 'reserve' ? 'now()' : null}
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
				registered_timestamp
			)
		VALUES (
			$1, 
			$2, 
			now()
		);
		`;
	const values = [
		signupPackage.username, 
		signupPackage.password,
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

function query_editLbeacon (formOption) {
	const text =
		`
		UPDATE lbeacon_table
		SET 
			description = $2,
			danger_area = $3,
			room = $4

		WHERE uuid = $1
	`;

	const values = [
		formOption.uuid,
		formOption.description,
		formOption.danger_area,
		formOption.room
	]

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

		ORDER BY shift_change_record.submit_timestamp DESC;

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
			user_table.id,
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

		DELETE FROM user_areas
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


const query_deleteShiftChangeRecord = (idPackage) => {
	const query = `
		DELETE FROM shift_change_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}



const query_deletePatient = (idPackage) => {
	const query = `
		DELETE FROM import_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

const query_deleteDevice = (idPackage, formOption) => {
	const query = `
		DELETE FROM object_table
		WHERE mac_address IN (${formOption.map(item => `'${item}'`)});
	`
	return query
}

const query_deleteImportData = (idPackage) => {
	const query = `
		DELETE FROM import_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}




const query_deleteLBeacon = (idPackage) => {
	const query = `
		DELETE FROM lbeacon_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}


const query_deleteGateway = (idPackage) => {
	const query = `
		DELETE FROM gateway_table
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

const query_checkoutViolation = (mac_address, monitor_type) => {
	return `
		UPDATE notification_table
		SET web_processed = 1
		WHERE (
			mac_address = '${mac_address}'
			AND monitor_type = ${monitor_type}
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

const query_getMonitorConfig = (type, sitesGroup) => {
	let text =  `
		SELECT 
			id, 
			area_id,
			enable,
			start_time,
			end_time
		FROM ${type}
		WHERE area_id IN (${sitesGroup.map(item => item)});
	`
	return text
}

const query_setMonitorConfig = (monitorConfigPackage) => {
	return `
		UPDATE ${monitorConfigPackage.type}
		SET 
			start_time = '${monitorConfigPackage.start_time}',
			end_time = '${monitorConfigPackage.end_time}',
			enable = '${monitorConfigPackage.enable}'
		WHERE id = ${monitorConfigPackage.id};
	`
}

function query_backendSearch(keyType, keyWord){
	var query 	= null
	var text 	= null
	var values 	= null
	switch(keyType){
		case 'location' :
			text = `SELECT mac_address FROM object_summary_table WHERE uuid = $1`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
////////////////////////////////////////////////////////
		case 'name' :
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower(name)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
////////////////////////////////////////////////////////
		case 'type' :
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT 
							mac_address 
						FROM 
							object_table 
						WHERE 
							POSITION( lower($1) IN lower(type)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break;
		case 'all devices':
			text = `SELECT mac_address FROM object_summary_table WHERE true`
			values = []
			query = {
				text,
				values
			}
			break
////////////////////////////////////////////////////////
		case 'acn last 4':
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower( right(access_control_number, 4) )) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break
////////////////////////////////////////////////////////
		case 'all attributes':
			text = `
				SELECT 
					mac_address
				FROM 
					object_summary_table 
				WHERE 
					mac_address 
				in 
					(
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower( right(asset_control_number, 4) )) > 0
					
					UNION
					
						SELECT 
							mac_address 
						FROM 
							object_table 
						WHERE 
							POSITION( lower($1) IN lower(type)) > 0
					
					UNION
					
						SELECT mac_address FROM object_table WHERE POSITION( lower($1) IN lower(name)) > 0
					)
			`
			values = [keyWord]
			query = {
				text,
				values
			}
			break
	}
	return query
}
function query_deleteSameNameSearchQueue(keyType, keyWord){

	var text = `DELETE FROM search_result_queue where (key_type = '${keyType}' AND key_word = '${keyWord}') 
	OR 
		id NOT IN (SELECT id FROM search_result_queue ORDER BY query_time desc LIMIT 5) RETURNING *;`
	// console.log(text)
	return text
}
function query_backendSearch_writeQueue(keyType, keyWord, mac_addresses, pin_color_index){
	var text = 
		`
			INSERT INTO 
				search_result_queue(query_time, key_type, key_word, result_mac_address, pin_color_index) VALUES
				(now(), $1, $2, ARRAY['${mac_addresses.join('\',\'')}'], $3);
		`
	values =  [keyType, keyWord, pin_color_index]
	query = {
		text,
		values
	}
	
	return query
}

function query_getBackendSearchQueue(){
	var query = 
		`
			SELECT 
				*
			FROM
				search_result_queue
			ORDER BY
				query_time DESC
			LIMIT 5
		`
	
	return query
}


const query_addBulkObject = (jsonObj) => {
	let text =  `
		INSERT INTO import_table (
			name,
			type,
			asset_control_number,
			bindflag,
		)
		VALUES ${jsonObj.map((item, index) => {
			return `(
				'${item.name}',
				'${item.type}',
				'c2:00:00:00:00:0${index}',
				'${item.asset_control_number}',
				now(),
				0,
				'normal'
			)`
		})}
	`
	console.log(text)
	return text	
}


module.exports = {
    query_getTrackingData,
	query_getObjectTable,
	query_getObjectTable_fromImport,
	query_getPatientTable,
	query_getImportTable,
    query_getLbeaconTable,
	query_getGatewayTable,
	query_getGeofenceData,
	query_getMonitorConfig,
	query_setMonitorConfig,
	query_editPatient,
	query_editObject,
	query_editImport,
	query_objectImport,
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
	query_deleteShiftChangeRecord,
	query_deletePatient,
	query_deleteDevice,
	query_deleteImportData,
	query_setShift,
	query_deleteLBeacon,
	query_deleteGateway,
	query_setVisitTimestamp,
	query_insertUserData,
	query_addEditObjectRecord,
	query_addShiftChangeRecord,
	query_getAreaTable,
	query_getGeoFenceConfig,
	query_setGeoFenceConfig,
	query_checkoutViolation,
	query_confirmValidation,
	query_backendSearch,
	query_backendSearch_writeQueue,
	query_deleteSameNameSearchQueue,
	query_getBackendSearchQueue,
	query_addBulkObject,
	query_editImportData,
	query_cleanBinding,
	query_getImportData,
	query_editObject
}



