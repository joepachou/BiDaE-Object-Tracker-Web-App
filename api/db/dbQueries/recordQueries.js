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

	let item = formOption
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
			'${item.transferred_location}',
			ARRAY ['${formOption.asset_control_number}'],
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

module.exports = {
    getShiftChangeRecord,
    getEditObjectRecord,
    addEditObjectRecord
}