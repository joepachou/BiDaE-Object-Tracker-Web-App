
function query_getTrackingData (rssi = -55) {

// return `
// 	SELECT  table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.rssi as avg_stable FROM 
// 	    (
// 	    SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi FROM tracking_table 
// 		WHERE final_timestamp > NOW() - INTERVAL '10 seconds'  
// 		AND object_mac_address::TEXT LIKE 'c1:%' 
// 		GROUP BY object_mac_address, lbeacon_uuid
// 		HAVING avg(rssi) > ${rssi}
// 		) as table1 
// 		LEFT JOIN
// 		(
// 		SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi 
// 		FROM tracking_table 
// 		WHERE final_timestamp > NOW() - INTERVAL '120 seconds' 
// 		AND final_timestamp < NOW() - INTERVAL '10 seconds' 
// 		AND object_mac_address::TEXT LIKE 'c1:%' 
// 		GROUP BY object_mac_address, lbeacon_uuid
// 		HAVING avg(rssi) > ${rssi}
// 		) as table2 
// 		ON table1.object_mac_address = table2.object_mac_address 
// 		AND table1.lbeacon_uuid = table2.lbeacon_uuid 
// 		ORDER BY table1.object_mac_address DESC, table1.lbeacon_uuid ASC;
// 		`
	return `
		(SELECT table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.avg_stable as avg_stable, table1.push_button 
		 FROM 
	        (SELECT table_recent.object_mac_address, table_recent.lbeacon_uuid, table_max.rssi, table_max.push_button
		     FROM
		        (SELECT object_mac_address, lbeacon_uuid, max(rssi) as rssi
		         FROM tracking_table
		            WHERE final_timestamp >= NOW() - INTERVAL '20 seconds'  
		            AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '3 seconds'  
		            AND rssi > -100
		            GROUP BY object_mac_address, lbeacon_uuid
		        ) as table_recent
		
		        LEFT JOIN
			
		        (SELECT object_mac_address, lbeacon_uuid, max(rssi) as rssi, max(push_button) as push_button
		         FROM tracking_table 
		            WHERE final_timestamp >= NOW() - INTERVAL '20 seconds'  
		            AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '10 seconds'  
		            GROUP BY object_mac_address, lbeacon_uuid
		        ) as table_max
		    
			    ON table_recent.object_mac_address = table_max.object_mac_address
		        AND table_recent.lbeacon_uuid = table_max.lbeacon_uuid
		        WHERE table_max.rssi > -100
		    ) as table1 
		
		    LEFT JOIN
		
		    (SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as avg_stable
		     FROM tracking_table 
		        WHERE final_timestamp >= NOW() - INTERVAL '70 seconds'
		        AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '60 seconds' 
		        GROUP BY object_mac_address, lbeacon_uuid
		        HAVING avg(rssi) > -55 and count(object_mac_address) >= 50
		    ) as table2 
		
		    ON table1.object_mac_address = table2.object_mac_address 
		    AND table1.lbeacon_uuid = table2.lbeacon_uuid
        )	    
		     
		UNION
		
		(SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as avg, round(avg(rssi),2) as avg_stable, max(push_button) as push_button 
		 FROM tracking_table
            WHERE final_timestamp >= NOW() - INTERVAL '70 seconds'
            AND final_timestamp >= NOW() - (server_time_offset||' seconds')::INTERVAL - INTERVAL '60 seconds'
            GROUP BY object_mac_address, lbeacon_uuid			
		    HAVING max(push_button) > 0
		)			
		     
		ORDER BY object_mac_address ASC, lbeacon_uuid ASC
		`;

}
    // `
	// SELECT  table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.rssi as avg_stable FROM 
	//     (
	//     SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi FROM tracking_table 
	// 	WHERE final_timestamp > NOW() - INTERVAL '5 seconds'  
	// 	AND object_mac_address::TEXT LIKE 'c1:%' 
	// 	GROUP BY object_mac_address, lbeacon_uuid
	// 	HAVING avg(rssi) > -50
	// 	) as table1 
	// 	LEFT JOIN
	// 	(
	// 	SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi 
	// 	FROM tracking_table 
	// 	WHERE final_timestamp > NOW() - INTERVAL '120 seconds' 
	// 	AND final_timestamp < NOW() - INTERVAL '5 seconds' 
	// 	AND object_mac_address::TEXT LIKE 'c1:%' 
	// 	GROUP BY object_mac_address, lbeacon_uuid
	// 	HAVING avg(rssi) > -55
	// 	) as table2 
	// 	ON table1.object_mac_address = table2.object_mac_address 
	// 	AND table1.lbeacon_uuid = table2.lbeacon_uuid 
	// 	ORDER BY table1.object_mac_address DESC, table1.lbeacon_uuid ASC;
	// 	`;
		/*
		`
		SELECT table1.name, table1.object_mac_address, table1.lbeacon_uuid, table1.rssi as avg, table2.rssi as avg_stable FROM 
			(
			SELECT name, object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi FROM tracking_table 
			INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address 
			WHERE final_timestamp > NOW() - INTERVAL '30 seconds'  
			AND object_mac_address::TEXT LIKE 'c1:%' 
			GROUP BY object_mac_address, lbeacon_uuid, object_table.name 
			HAVING avg(rssi) > -45
			) as table1 
			LEFT JOIN
			(
			SELECT object_mac_address, lbeacon_uuid, round(avg(rssi),2) as rssi 
			FROM tracking_table 
			WHERE final_timestamp > NOW() - INTERVAL '180 seconds' 
			AND final_timestamp < NOW() - INTERVAL '30 seconds' 
			AND object_mac_address::TEXT LIKE 'c1:%' 
			GROUP BY object_mac_address, lbeacon_uuid
			HAVING avg(rssi) > -45
			) as table2 
			ON table1.object_mac_address = table2.object_mac_address 
			AND table1.lbeacon_uuid = table2.lbeacon_uuid 
			ORDER BY table1.object_mac_address DESC;
			`;
			*/

/*
    `
    select time_bucket('30 seconds', final_timestamp) 
    as thirty_seconds, name, object_mac_address, lbeacon_uuid, avg(rssi) 
    from tracking_table 
	INNER JOIN object_table ON tracking_table.object_mac_address = object_table.mac_address
    where final_timestamp > now() - interval '30 seconds'
    AND rssi > -50
	AND object_mac_address::TEXT LIKE 'c1:%'
    GROUP BY thirty_seconds, object_mac_address, lbeacon_uuid, object_table.name
    ORDER BY thirty_seconds DESC`; 
*/


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

module.exports = {
    query_getTrackingData,
    query_getObjectTable,
    query_getLbeaconTable,
    query_getGatewayTable,
}

