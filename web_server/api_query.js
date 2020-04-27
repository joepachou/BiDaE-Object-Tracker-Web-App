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


const apiGetKey = (request, response) => {
    let { 
        username, 
        password 
    } = request.body 
    pool.query(queryType.confirmValidation(username))
        .then(res => {
            if (res.rowCount < 1) {
                console.log(`confirm validation failed: incorrect`)
                response.json({
                    confirmation: false,
                    message: 'incorrect'
                })
            } else {
                const hash = res.rows[0].password
                
                if (bcrypt.compareSync(password, hash)) {
                    let { 
                        roles, 
                    } = res.rows[0] 
                    /** authenticate if user is care provider */
                    if (roles.includes('3') || roles.includes('4')) {

                        console.log(`confirm validation succeed`) 
                        // const saltRounds = 10;
                        // const hash = bcrypt.hashSync(username, saltRounds);
                        // console.log(hash)
                        pool.query(queryType.apiGetKey(username)) 
                            .then(res => {

                                response.status(200).json({
                                    confirmation: true,
                                    key: res.rows[0].key
                                }) 
                                console.log('api Get Key success') 
                                
                            })
                            .catch(err => {
                                console.log(`api Get Key failer ${err}`)
                        })  

                    } else {

                        console.log(`confirm validation failed: authority is not enough`)
                        response.json({
                            confirmation: false,
                            message: 'authority is not enough'
                        })
                    }
                } else {
                    console.log(`confirm validation failed: password is incorrect`)
                    response.json({
                        confirmation: false,
                        message: 'password incorrect'
                    })
                }
            }
        })
        .catch(err => {
            console.log(`confirm validation fails ${err}`)
        }) 
}

 


module.exports = {
    apiGetKey
}