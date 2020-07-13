/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        recordQueries.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

const getShiftChangeRecord = () =>{
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

const addEditObjectRecord = (formOption, username, filePath) => {

	const text = `
		INSERT INTO edit_object_record (
			edit_user_id, 
			notes, 
			new_status, 
			new_location, 
			edit_objects,
			path,
			edit_time
		)
		VALUES (
			(
				SELECT id 
				FROM user_table 
				WHERE name = $1
			),
			$2,
			$3,
			$4,
			ARRAY ['${formOption.map(item => item.asset_control_number)}'],
			$5,
			now()
		)
		RETURNING id;
	`
	const values = [
		username,
		formOption[0].notes,
		formOption[0].status,
		formOption[0].transferred_location,
		filePath
	]

	const query = {
		text, 
		values
	}
	return query

}

const addShiftChangeRecord = (userInfo, file_path,shift) => {
 
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
			'${shift.value}',
			now(), 
			'${file_path}'
		);
	`
	return query
}

const addPatientRecord = objectPackage => {
	let text = `
		INSERT INTO patient_record (
			object_id,
			editing_user_id, 
			record,
			created_timestamp
		) 
		VALUES (
			$1,
			$2,
			$3,
			NOW()
		)
		
	`
	let values = [
		objectPackage.id,
		objectPackage.userId,
		objectPackage.record
	]	

	let query = {
		text,
		values
	}
	
	return query
	
}

module.exports = {
    getShiftChangeRecord,
    getEditObjectRecord,
	addEditObjectRecord,
	addShiftChangeRecord,
	addPatientRecord
}