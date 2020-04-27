const bcrypt = require('bcrypt');
const queryType = require ('./api_queryType');
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)  

const get_key = (request, response) => {
    let { 
        username, 
        password 
    } = request.body 
    pool.query(queryType.confirmValidation(username))
        .then(res => {
            if (res.rowCount < 1) {
                console.log(`confirm validation failed: incorrect`)
                response.json({
                    error_code: '100',
                    error_message:'get key fail : error username or error password',
                    key: ''
                })
            } else {
                const hash = res.rows[0].password
                
                if (bcrypt.compareSync(password, hash)) {
                    let { 
                        roles, 
                    } = res.rows[0] 
                    /** authenticate if user is care provider */ 
                     
                    console.log(`confirm validation succeed`) 
                    // const saltRounds = 10;
                    // const hash = bcrypt.hashSync(username, saltRounds);
                    // console.log(hash)
                    pool.query(queryType.apiGetKey(username)) 
                        .then(res => {

                            response.status(200).json({
                                error_code: '0',
                                error_message:'get key success',
                                key: res.rows[0].key
                            }) 
                            console.log('api Get Key success') 
                            
                        })
                        .catch(err => {
                            console.log(`api Get Key failer ${err}`)
                    })   
                } else {
                    console.log(`confirm validation failed: password is incorrect`)
                    response.json({
                        error_code: '100',
                        error_message:'get key fail : error username or error password',
                        key: ''
                    })
                }
            }
        })
        .catch(err => {
            console.log(`confirm validation fails ${err}`)
        }) 
}
 
async function match_key(key, response){  
    let matchFlag = 0
    return await pool.query(queryType.getAllKey()) 
        .then(res => {   
            res.rows.map(item =>{item.key == key ? matchFlag = 1 : null  })    
            return matchFlag
        })
        .catch(err => { 
            console.log(`match key fails ${err}`)
        })  
} 

async function get_area_role(key, response){    
    return await pool.query(queryType.getAreaIDByKey(key))  //get area id
        .then(res => {     
            console.log(`get area role success`)   
            return res.rows
        })
        .catch(err => { 
            console.log(`get area role fails ${err}`)
        })  
} 

async function filterMacAddress(area, response){    
    return await   pool.query(queryType.filterMacAddress(area)) 
        .then(res => {    
            console.log(`filter Mac Address success`) 
            return res.rows
        })
        .catch(err => { 
            console.log(`filter Mac Address ${err}`)
        })  
} 

async function get_mac_address(request, response){

    let { 
        key, 
        mac_address 
    } = request.body 


    var matchRes = ( Promise.resolve( match_key(key) )  );
    await   matchRes.then(function(result){matchRes = result}) 

    if (matchRes == 1 ){   // 金鑰驗證通過

        // 檢查這把金鑰的所屬地區 
        area = ( Promise.resolve( get_area_role(key) )  );
        await  area.then(function(result){area = result})  
        // 輸出此區域擁有的mac_address
        var filterObject = ( Promise.resolve( filterMacAddress(area)));
        await  filterObject.then(function(result){filterObject = result})  
 
        //輸出所有mac_address的location history
        pool.query(queryType.searchByMacAddress(filterObject))
        .then(res => { 
            res.error_code= '0'
            res.error_message='get data success'
            
            res.area_id = ''
            area.map(item => { item.area_id ?  res.area_id += item.area_id + ',' : null})
            res.area_id =  res.area_id.substring(0,res.area_id.length-1)

            response.status(200).json(res)
            console.log(`search by mac address success`)    
        })
        .catch(err => { 
            console.log(`search by mac address fails ${err}`)
        }) 

    }else{ // 金鑰驗證失敗



        response.json({
            error_code: '200',
            error_message:'get data fail : key is incorrect',
            data: ''
        })
    } 
}
 

module.exports = {
    get_key,
    get_mac_address,
    match_key,
    get_area_role
}