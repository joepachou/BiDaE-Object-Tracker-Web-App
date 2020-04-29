const  confirmValidation = (username) => {
	let text = `
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role,
			user_role.role_id as role_id,
			array (
				SELECT area_id
				FROM user_area
				WHERE user_area.user_id = user_table.id
			) as areas_id,
			(
				SELECT id
				FROM user_table
				WHERE user_table.name = $1
			) as user_id,
			ARRAY (
				SELECT role_id
				FROM user_role
				WHERE user_role.user_id = (
					SELECT id
					FROM user_table 
					WHERE user_table.name = $1
				)
			) as roles

		FROM user_table

		LEFT JOIN user_role
		ON user_role.user_id = user_table.id

		LEFT JOIN roles
		ON user_role.role_id = roles.id
		
		LEFT JOIN user_area
		ON user_area.user_id = user_table.id
		
		WHERE user_table.name = $1;
	`

	const values = [username];

	const query = {
		text,
		values
	};

	return query;

}

function setKey (user_id,username,hash) { 
	let text = 
		` 
			UPDATE  api_key
			SET 
                name = $2,
                key = $3,
                register_time = now()
	    	WHERE id = $1
		`
	const values = [
        user_id,
        username,
        hash
	];

	const query = {
		text,
		values
	};
    
	return query;
}

const getAllKey = () => { 
    const query = 
		` 
			SELECT  *
            FROM api_key 
		` 
	return query;
}


const getAreaIDByKey = (key) =>{ 
	const text = `
            SELECT area_id
            FROM user_area
            WHERE user_area.user_id =     
            (
                SELECT id 
                FROM api_key 
                WHERE key=$1
            )
	`
	const values = [
       key
	];

	const query = {
		text,
		values
	};
    
	return query;
}

const searchByMacAddress  = (mac_address,Lbeacon) => {   
    if (Lbeacon != undefined){
        const query =  `
            SELECT *  FROM location_history_table 
            WHERE
            (  
            mac_address IN (${mac_address.map(item => `'${item.mac_address}'`)})
            AND
            uuid IN (${Lbeacon.map(item => `'${item}'`)})
            )
        `    
    
        return query
    }  else{
        const query =  `
            SELECT *  FROM location_history_table 
            WHERE 
            mac_address IN (${mac_address.map(item => `'${item.mac_address}'`)})
        `    
        return query
    }
}

const filterMacAddressByArea  = (area_id,tag) => { 
    if (tag != undefined){
            const query = 
                `
                SELECT mac_address  FROM object_table
                WHERE  
                (
                area_id IN (${area_id.map(item => `'${item.area_id}'`)}) 
                AND
                mac_address IN  (${tag.map(item => `'${item}'`)})  
                )
                `     
            
            return query;
    }else{
        const query = 
            `
            SELECT mac_address  FROM object_table
            WHERE   
            area_id IN (${area_id.map(item => `'${item.area_id}'`)})  
            `    
         return query
    }

   
}

const getAllUser = () => { 
    const query = 
		` 
			SELECT  *
            FROM user_table
		` 
	return query;
}
 
module.exports = {
    confirmValidation,
    setKey,
    getAllKey,
    searchByMacAddress,
    getAreaIDByKey,
    filterMacAddressByArea ,
    getAllUser
}