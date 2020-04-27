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
 
const match_key = (request, response) => {
    let { 
        key 
    } = request.body  
    pool.query(queryType.get_all_key())
        .then(res => {
            console.log(`match key success`)
            console.log(res.rows[0].include(key))
            response.status(200).json(res.rows[0])
        })
        .catch(err => {
            console.log(`match key fails ${err}`)
        }) 
}

const search_by_mac_address = (request, response) => {
    let { 
        key, 
        mac_address 
    } = request.body 
    pool.query(queryType.search_by_mac_address(mac_address))
        .then(res => {
            console.log(`search by mac address success`)
            response.status(200).json(res)
        })
        .catch(err => {
            console.log(`search by mac address fails ${err}`)
        }) 
}


module.exports = {
    get_key,
    search_by_mac_address,
    match_key
}