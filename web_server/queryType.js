require('dotenv').config();
function getTrackingData () {
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
			object_summary_table.base_x,
			object_summary_table.base_y,
			object_table.name,
			object_table.type,
			object_table.status,
			object_table.transferred_location,
			object_table.asset_control_number,
			object_table.area_id,
			object_table.object_type,
			object_table.physician_id,
			object_table.asset_control_number as last_four_acn,
			lbeacon_table.description as location_description,
			edit_object_record.notes,
			user_table.name as physician_name,
			object_table.reserved_timestamp,
			notification.json_agg as notification,
			object_table.reserved_user_id,

			(
				SELECT name
				FROM user_table
				WHERE user_table.id = object_table.reserved_user_id
			) as reserved_user_name
		


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

const getTrackingTableByMacAddress = (object_mac_address,i,second) => {
	let text = '';

		text += `
			SELECT
				object_mac_address,
				lbeacon_uuid,
				avg(rssi)
			FROM tracking_table
			WHERE object_mac_address = '
			`;
		text += object_mac_address;
		text +=`'
			AND final_timestamp > now() - interval '${(i+1)*second}seconds' 
			AND final_timestamp < now() - interval '${i*second}seconds'
			GROUP BY object_mac_address, lbeacon_uuid
			ORDER BY avg(rssi) DESC 
			LIMIT 1
			`;
	//console.log(text)
	return text;
}
const getImportDataFromBinding = () => {

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

const getObjectTable = (area_id, objectType ) => {

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
				object_table.room,
				object_table.physician_id,
				(
					SELECT name
					FROM user_table
					WHERE user_table.id = object_table.physician_id
				) as physician_name
				
			FROM object_table 
			WHERE object_table.object_type IN (${objectType.map(type => type)})
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
				object_table.room,
				object_table.physician_id,
				(
					SELECT name
					FROM user_table
					WHERE user_table.id = object_table.physician_id
				) as physician_name

			FROM object_table 
			WHERE object_table.object_type IN (${objectType.map(type => type)})
					
			ORDER BY object_table.type DESC;
		`;
	}
	return text
} 


// WHERE object_table.object_type = '2'
const getPatientTable = (area_id) => {

	let text = '';
	if (!area_id) {
		text += `
			SELECT 
				object_table.name, 
				object_table.id,
				object_table.area_id,
				object_table.physician_id,
				user_table.name as physician_name,
				object_table.mac_address,
				object_table.asset_control_number,
				object_table.object_type,
				object_table.monitor_type,
				object_table.room

			
			FROM object_table 

			LEFT JOIN user_table
			ON object_table.physician_id = user_table.id

			WHERE object_table.object_type != '0'

			ORDER BY object_table.name ASC	
		`;
	} else {
		text +=`
			SELECT 
				object_table.name, 
				object_table.id,
				object_table.area_id,
				object_table.physician_id,
				user_table.name as physician_name,
				object_table.mac_address,
				object_table.asset_control_number,
				object_table.object_type,
				object_table.monitor_type,
				object_table.room

			FROM object_table 
			LEFT JOIN user_table
			ON object_table.physician_id = user_table.id

			WHERE object_table.object_type != '0'

			ORDER BY object_table.name ASC	
		`;
	}
	return text
} 

const getImportTable = () => {

	let text = `
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id
			FROM import_table WHERE import_table.type != 'patient'
		`;
	
	return text
} 

const getImportPatient = () => {

	let text = `
			SELECT 
				import_table.name, 
				import_table.asset_control_number,
				import_table.type,
				import_table.id
			FROM import_table WHERE import_table.type ='patient'
		`;
	
	return text
} 

function addAssociation (formOption) {
	// console.log(formOption)
	const text = `
		INSERT INTO object_table (
			name,
			type,
			asset_control_number,
			mac_address,
			area_id,
			status,
			object_type
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			'normal',
			0
		)
	`
	;

	const values = [
		formOption.name,
		formOption.type,
		formOption.asset_control_number,
		formOption.mac_address,
		formOption.area_id
	]

	const query = {
		text, 
		values
	};

	return query;

}


function addAssociation_Patient (formOption) {
	// console.log(formOption)
	const text = `
		INSERT INTO object_table (
			name,
			type,
			asset_control_number,
			mac_address,
			area_id,
			status,
			object_type
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			'Patient',
			1
		)
	`
	;

	const values = [
		formOption.name,
		formOption.type,
		formOption.asset_control_number,
		formOption.mac_address,
		formOption.area_id
	]

	const query = {
		text, 
		values
	};

	return query;

}




function cleanBinding(formOption) {
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


function getImportData(formOption){
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



const getLbeaconTable = 
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
			room,
			api_version,
			server_time_offset
		FROM lbeacon_table
		ORDER BY last_report_timestamp DESC
	`;

const getGatewayTable = 
    `
	SELECT 
		ip_address, 
		health_status, 
		last_report_timestamp,
		registered_timestamp,
		id,
		api_version
	FROM 
		gateway_table 
	ORDER BY last_report_timestamp DESC`;	

function objectImport (idPackage) {

	let text =  `
		INSERT INTO import_table (
			name,
			type,
			asset_control_number
		)
		VALUES ${idPackage.map((item) => {
			return `(
				'${item.name}',
				'${item.type}',
				'${item.asset_control_number}'
			)`
		})};
	`
	return text	
}


function editImport (formOption) {
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



const getLocaleID = (lang) => {
	const text = `
		SELECT 
			id
		FROM
			locale
		WHERE name = $1
	`

	const values = [
		lang
	]

	const query = {
		text, 
		values
	}
	return query
}



function setLocaleID (userID,lang) {

	let text = 
		`
		Update user_table 
		SET locale_id = $1
		WHERE id = $2
		`
	const values = [
	lang,
	userID,
	];

	const query = {
		text,
		values
	};

	return query;
}





function editObject (formOption) {
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



function editPatient (formOption) {
	// console.log(formOption)
	const text = `
		Update object_table 
		SET name = $1,
			mac_address = $2,
			physician_id = $4,
			area_id = $5,
			object_type = $6,
			room_number = $7,
			monitor_type = $8
		WHERE asset_control_number = $3
	`;
		
	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.physicianIDNumber,
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



function addObject (formOption) {
	const text = `
		INSERT INTO object_table (
			type, 
			asset_control_number, 
			name,
			mac_address,
			status,
			area_id,
			object_type
		)
		VALUES (
			$1, 
			$2, 
			$3,
			$4,
			$5,
			$6,
			0
		);
	`;
		
	const values = [
		formOption.type, 
		formOption.asset_control_number, 
		formOption.name, 
		formOption.mac_address,
		formOption.status,
		formOption.area_id
	];


	const query = {
		text,
		values
	};

	return query;
}

function addPatient (formOption) {
	// console.log(formOption)
	const text = 
		`
		INSERT INTO object_table (
			name,
			mac_address, 
			asset_control_number,
			physician_id,
			area_id,
			object_type,
			room_number,
			monitor_type,
			type,
			status
		)
		VALUES($1,$2,$3,$4,$5,$6,$7,$8,'Patient','normal')
		`;
	const values = [
		formOption.name,
		formOption.mac_address,
		formOption.asset_control_number,
		formOption.physician.value,
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

const addImport = (formOption) => {
	const text = `
		INSERT INTO import_table (
			type, 
			asset_control_number, 
			name
		)
		VALUES (
			$1, 
			$2, 
			$3
		);
	`;
	const values = [
		formOption.type, 

		formOption.asset_control_number, 
		formOption.name, 
	];
	const query = {
		text,
		values
	};

	return query;
}

const editObjectPackage = (formOption, username, record_id, reservedTimestamp) => {
	let item = formOption[0]
	let text = `
		UPDATE object_table
		SET 
			status = '${item.status}',
			transferred_location = '${item.transferred_location ? item.transferred_location.value : ' '}',
			note_id = ${record_id},
			reserved_timestamp = ${item.status == 'reserve' ? `'${reservedTimestamp}'` : null},
			reserved_user_id = (SELECT id
				FROM user_table
				WHERE user_table.name='${username}')
								
		WHERE asset_control_number IN (${formOption.map(item => `'${item.asset_control_number}'`)});
	`
	return text
}
function signin(username) {

	const text =
		`
		WITH 
		user_info
			AS
				(
					SELECT name, password, mydevice, id, main_area, max_search_history_count, locale_id
					FROM user_table
					WHERE name =$1
				)
		,
		roles
			AS
				(
					SELECT user_roles.user_id, user_roles.role_id, roles.name as role_name 
					FROM user_roles
					INNER JOIN roles
					ON roles.id = user_roles.role_id
					WHERE user_roles.user_id = (SELECT id FROM user_info)
				),
		permissions
			AS
				(
					SELECT roles_permission.role_id, roles_permission.permission_id, permission_table.name as permission_name 
					FROM roles_permission
					INNER JOIN permission_table
					ON roles_permission.permission_id = permission_table.id
					WHERE roles_permission.role_id in (SELECT role_id FROM roles)
				),
		areas
			AS
				(
					SELECT area_id
					FROM user_areas
					WHERE user_areas.user_id = (SELECT id FROM user_info)
				),
		search_histories
			AS
				(
					SELECT keyword as name, COUNT(id) as value
					FROM search_history where user_id = (SELECT id FROM user_info)
					GROUP BY keyWord
				)

		SELECT 
			user_info.name, 
			user_info.password,
			user_info.mydevice, 
			array(select row_to_json(search_histories) FROM search_histories) AS search_history,
			user_info.id,
			user_info.id,
			user_info.locale_id,
			user_info.max_search_history_count as freq_search_count,
			array(
				SELECT role_name FROM roles
			) as roles,
			array(
				SELECT DISTINCT permission_name FROM permissions 
			) as permissions, 
			array (
				SELECT area_id FROM areas
			) as areas_id,
			(
                SELECT locale.name FROM locale WHERE user_info.locale_id = locale.id
			) as locale_area

		FROM user_info

        `;







    const values = [username];

    const query = {
        text,
        values
    };

    return query;

}
function signup(signupPackage) {

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

function getUserInfo(username) {
	const text =  `
	SELECT name, mydevice, search_history, max_search_history_count as freqSearchCount from user_table where name= $1
	`;

	const values = [username];

	const query = {
		text,
		values
	};

	return query
}

function addUserSearchHistory (username, keyType, keyWord) {
	// const text = `
	// 	UPDATE user_table
	// 	SET search_history = $1
	// 	WHERE name = $2
	// `;
	const text = `
		INSERT INTO search_history(search_time, keyWord, key_type, user_id)
		VALUES(
			now(),
			$1,
			$2,
			(SELECT id from user_table where name = $3)
		) 
			
	`;

	const values = [keyWord, keyType, username];

	const query = {
		text, 
		values
	};

	return query
}

function editLbeacon (formOption) {
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

function modifyUserDevices(username, mode, acn){
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
function modifyUserInfo(username, info){
	console.log(username)
	const {freqSearchCount} = info
	text = `UPDATE user_table SET max_search_history_count = ${freqSearchCount} WHERE name='${username}'`
	return text
	
}

function getShiftChangeRecord(){
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



const validateUsername = (username) => {
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


const getUserList = () => {
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

const getUserRole = (username) => {
	const query = `select name      from roles      where 
		id=(       select role_id   from user_roles where 
		user_id=(  select id        from user_table where name='${username}'));`
	return query
}

const getRoleNameList = () => {
	const query = `
		SELECT 
			name 
		FROM roles;
	`
	return query
}


const deleteUser = (username) => {
	
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

const setUserRole = (username, roleSelect, shiftSelect) => {
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

const getEditObjectRecord = () => {
	const query = `
		SELECT
			user_table.name,
			edit_object_record.id,
			edit_object_record.edit_time,
			edit_object_record.notes,
			edit_object_record.new_status,
			edit_object_record.path as file_path
		FROM edit_object_record

		LEFT JOIN user_table
		ON user_table.id = edit_object_record.edit_user_id

		ORDER BY edit_object_record.edit_time DESC

	`
	return query
}

const deleteEditObjectRecord = (idPackage) => {
	const query = `
		DELETE FROM edit_object_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)}) RETURNING *;
	`
	return query
}


const deleteShiftChangeRecord = (idPackage) => {
	const query = `
		DELETE FROM shift_change_record
		WHERE id IN (${idPackage.map(item => `'${item}'`)})
		RETURNING *;
	`
	return query
}



const deletePatient = (idPackage) => {
	const query = `
		DELETE FROM object_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}

const deleteDevice = (idPackage, formOption) => {
	const query = `
		DELETE FROM object_table
		WHERE mac_address IN (${formOption.map(item => `'${item}'`)});
	`
	return query
}

const deleteImportData = (idPackage) => {
	const query = `
		DELETE FROM import_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}




const deleteLBeacon = (idPackage) => {
	const query = `
		DELETE FROM lbeacon_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}


const deleteGateway = (idPackage) => {
	const query = `
		DELETE FROM gateway_table
		WHERE id IN (${idPackage.map(item => `'${item}'`)});
	`
	return query
}





const setShift = (shift, username) => {
	const query = `
		update user_table
		set shift='${shift}'
		where name='${username}'
	`
	return query
}

const setVisitTimestamp = (username) => {
	return `
		UPDATE user_table
		SET last_visit_timestamp=now()
		WHERE name='${username}';
	`
}

const insertUserData = (username, role, area_id) => {
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

const addEditObjectRecord = (formOption, username, filePath) => {
	let item = formOption[0]
	const text = `
		INSERT INTO edit_object_record (
			edit_user_id, 
			edit_time, 
			notes, 
			new_status, 
			new_location, 
			edit_objects,
			path
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
			ARRAY [${formOption.map(item => `'${item.asset_control_number}'`)}],
			$4
		)
		RETURNING id;
	`
	const values = [
		username,
		item.notes,
		item.status,
		filePath
	]

	const query = {
		text, 
		values
	}
	return query

}

const addShiftChangeRecord = (userInfo, file_path) => {
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

const getAreaTable = () => {
	return `
		SELECT 
			id,
			name
		FROM area_table
	`
}

const getGeofenceConfig = (areaId) => {
	return `
		SELECT
			*
		FROM geo_fence_config
		ORDER BY id
	;`
}


const setGeofenceConfig = (monitorConfigPackage) => {
	let {
		type,
		id,
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id,
		is_global_fence
	} = monitorConfigPackage

	let text = `
		UPDATE geo_fence_config
		SET 
			name = $2,
			area_id = $3,
			start_time = $4,
			end_time = $5,
			enable = $6,
			perimeters = $7,
			fences = $8,
			is_global_fence = $9
		WHERE id = $1;
	`
	let values = [
		id,
		name,
		area_id,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		is_global_fence
	]

	let query = {
		text,
		values
	}

	return query
}

const checkoutViolation = (mac_address, monitor_type) => {
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

const confirmValidation = (username) => {
	let text = `
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role,
			user_roles.role_id as role_id,
			array (
				SELECT area_id
				FROM user_areas
				WHERE user_areas.user_id = user_table.id
			) as areas_id,
			(
				SELECT id
				FROM user_table
				WHERE user_table.name = $1
			) as user_id

		FROM user_table

		LEFT JOIN user_roles
		ON user_roles.user_id = user_table.id

		LEFT JOIN roles
		ON user_roles.role_id = roles.id
		
		LEFT JOIN user_areas
		ON user_areas.user_id = user_table.id
		
		WHERE user_table.name = $1;
	`

	const values = [username];

	const query = {
		text,
		values
	};

	return query;

}

const addMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		start_time,
		end_time,
		enable,
		area_id
	} = monitorConfigPackage

	let text = `
		INSERT INTO ${type}
			(
				start_time,
				end_time,
				enable,
				area_id
			)
		VALUES 
			(
				$1,
				$2,
				$3,
				$4
			)
	`

	let values = [
		start_time,
		end_time,
		enable,
		area_id,
	]

	return {
		text, 
		values
	}
}

const getMonitorConfig = (type, sitesGroup) => {
	let text =  `
		SELECT 
			id, 
			area_id,
			enable,
			start_time,
			end_time
		FROM ${type}

		WHERE area_id IN (${sitesGroup.map(item => item)})

		ORDER BY id;
	`
	return text
}

const setMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		id,
		start_time,
		end_time,
		enable,
		area_id,
	} = monitorConfigPackage

	let text = `
		UPDATE ${type}
		SET 
			area_id = $2,
			start_time = $3,
			end_time = $4,
			enable = $5
		
		WHERE id = $1;
	`
	let values = [
		id,
		area_id,
		start_time,
		end_time,
		enable,
	]

	let query = {
		text,
		values
	}

	return query
}

const addGeofenceConfig = (monitorConfigPackage) => {

	let {
		type,
		id,
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id
	} = monitorConfigPackage

	let text = `
		INSERT INTO ${type}
			(
				name,
				start_time,
				end_time,
				enable,
				perimeters,
				fences,
				area_id
			)
		VALUES 
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7
			)
	`

	let values = [
		name,
		start_time,
		end_time,
		enable,
		perimeters,
		fences,
		area_id,
	]

	return {
		text, 
		values
	}
}

const deleteMonitorConfig = (monitorConfigPackage) => {
	let {
		type,
		id
	} = monitorConfigPackage
	return `
		DELETE FROM ${type}
		WHERE id = ${id}
	`
}

function backendSearch(keyType, keyWord){
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
function deleteSameNameSearchQueue(keyType, keyWord){

	var text = `DELETE FROM search_result_queue where (key_type = '${keyType}' AND key_word = '${keyWord}') 
	OR 
		id NOT IN (SELECT id FROM search_result_queue ORDER BY query_time desc LIMIT 5) RETURNING *;`
	// console.log(text)
	return text
}
function backendSearch_writeQueue(keyType, keyWord, mac_addresses, pin_color_index){
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

function getBackendSearchQueue(){
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


const addBulkObject = (jsonObj) => {
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
	return text	
}

const setSearchRssi = (rssi) => {
	let text = `
		UPDATE search_criteria
		SET search_rssi = $1
	`
	let values = [
		rssi
	]
	let query = {
		text,
		values
	}
	return query
}

const getSearchRssi = () =>{
	let text = `
		SELECT search_rssi
		FROM search_criteria
	`
	return text
}

function getUserArea(user_id){

    const text =  `
    SELECT 
        area_id
    FROM user_areas WHERE user_areas.user_id = $1;
    `;

    const values = [user_id];

    const query = {
        text,
        values
    };

    return query

}

function addUserArea (user_id,area_id){
    const text = `
    INSERT INTO user_areas (
        user_id,
        area_id
    )
    VALUES (
        $1, 
        $2
    );
`;
    
const values = [
    user_id,
    area_id
];


const query = {
    text,
    values
};

return query;
}

function DeleteUserArea (user_id,area_id){

    const query = `
        
        DELETE FROM user_areas
        WHERE user_id = '${user_id}' AND area_id = '${area_id}'
    
    `
    return query

}
function clearSearchHistory(){
	const query = `
		DELETE FROM search_history WHERE now() > search_time + interval ${process.env.SEARCH_HISTORY_VALIDATE_DURATION}
	`
	return query
}

function getTransferredLocation() {
	const query = `SELECT branch_name, offices FROM branch_and_office`
	return query
}

module.exports = {
	getTrackingData,
	getTrackingTableByMacAddress,
	getObjectTable,
	getPatientTable,
	getImportTable,
    getLbeaconTable,
	getGatewayTable,
	getMonitorConfig,
	setGeofenceConfig,
	editPatient,
	editObject,
	editImport,
	objectImport,
	addObject,
	addPatient,
	editObjectPackage,
	signin,
	signup,
	getUserInfo,
	addUserSearchHistory,
	editLbeacon,
	modifyUserDevices,
	modifyUserInfo,
	getShiftChangeRecord,
	validateUsername,
	getUserList,
	getUserRole,
	getRoleNameList,
	deleteUser,
	setUserRole,
	getEditObjectRecord,
	deleteEditObjectRecord,
	deleteShiftChangeRecord,
	deletePatient,
	deleteDevice,
	deleteImportData,
	setShift,
	deleteLBeacon,
	deleteGateway,
	setVisitTimestamp,
	insertUserData,
	addEditObjectRecord,
	addShiftChangeRecord,
	getAreaTable,
	getGeofenceConfig,
	setMonitorConfig,
	checkoutViolation,
	confirmValidation,
	backendSearch,
	backendSearch_writeQueue,
	deleteSameNameSearchQueue,
	getBackendSearchQueue,
	addAssociation,
	addAssociation_Patient,
	cleanBinding,
	getImportData,
	setLocaleID,
	getLocaleID,
	addImport,
	getImportPatient,
	addGeofenceConfig,
	deleteMonitorConfig,
	addMonitorConfig,
	getUserArea,
	addUserArea,
	DeleteUserArea,
	getTransferredLocation,




	clearSearchHistory
}



