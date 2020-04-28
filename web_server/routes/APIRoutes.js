const db = require('../api_query');

module.exports = app => { 

    /** 給我帳號密碼 給你金鑰 **/
    app.post('/api/1.0/get_key', db.get_key)

    /** 給我金鑰 我還你屬於這金鑰持有者的地區擁有的物品 **/
    app.post('/api/1.0/get_data', db.get_data) 
}