require('moment-timezone')
const moment = require('moment');

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
            if (res.rowCount < 1) { //帳號密碼驗證失敗
                console.log(`confirm validation failed: incorrect`)
                response.json({
                    error_code: '100',
                    error_message:'get key fail : error username or error password',
                    key: ''
                })
            } else {
                const hash = res.rows[0].password
                
                if (bcrypt.compareSync(password, hash)) { 
                     
                    console.log(`confirm validation succeed`) 

                    const saltRounds = 10;
                    const hash = bcrypt.hashSync(username, saltRounds);
                    
                    pool.query(queryType.setKey(res.rows[0].user_id,username,hash)) 
                        .then(res => {  
                            response.status(200).json({
                                error_code: '0',
                                error_message:'get key success',
                                key: hash,
                                note:'validity period of key until : ' +moment().add(30, 'm').locale('en').format('LT')
                            }) 
                            console.log('set Key success')  
                        })
                        .catch(err => {
                            console.log(`set Key failer ${err}`)
                    })   

                    console.log(`get key succeed`) 


                } else { //帳號密碼驗證失敗
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
            res.rows.map(item =>{ 
                let vaildTime = moment(item.register_time).add(30, 'm')
                
                //時間內，且key正確
                if (moment().isBefore(moment(vaildTime)) && item.key == key ){ 
                   matchFlag = 1  
                } else if(moment().isAfter(moment(vaildTime)) && item.key == key ){
                   matchFlag = 2
                }
                //key正確,時間超出 
            })    
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

async function filterMacAddressByArea(area, shouldFilter , response){    
    
    if (shouldFilter){ //非全院不分區
        return await   pool.query(queryType.filterMacAddressByArea(area)) 
            .then(res => {    
                console.log(`filter Mac Address success`) 
                return res.rows
            })
            .catch(err => { 
                console.log(`filter Mac Address ${err}`)
            })  
    }else{ //輸出全院
        return await   pool.query(queryType.getAllMacAddress()) 
        .then(res => {    
            console.log(`get Mac Address success`) 
            return res.rows
        })
        .catch(err => { 
            console.log(`get Mac Address Address ${err}`)
        })  
    }

} 

async function get_history(filterObject, response){    
    return await   pool.query(queryType.searchByMacAddress(filterObject))
    .then(res => { 
        res.error_code= '0'
        res.error_message='get data success' 

        // res.area_id = ''
        // area.map(item => { item.area_id ?  res.area_id += item.area_id + ',' : null})
        // res.area_id =  res.area_id.substring(0,res.area_id.length-1)

        console.log(`search by mac address success`)    
        return res.rows
    })
    .catch(err => { 
        response.json({
            error_code: '300',
            error_message:'get data fail : no object for this area',
            data: ''
        })
    }) 
} 
 

async function filterData_ByTAG(data,tag){    
    var filterRes = []
    try{
        data.map(dataItem=>{
            tag.map(filterItem=>{
                if (dataItem.mac_address == filterItem ){ 
                    filterRes.push(dataItem)
                } 
            })
        })  
    }catch(error){
        console.log('filter by tag fail')
    }

    return filterRes
} 

async function filterData_ByLbeacon(data,Lbeacon){    
    var filterRes = []
    try{
        data.map(dataItem=>{
            Lbeacon.map(filterItem=>{
                if (dataItem.uuid == filterItem ){ 
                    filterRes.push(dataItem)
                } 
            })
        })
    }catch(error){
        console.log('filter by tag Lbeacon fail')
    }
    return filterRes
} 

async function filterData_ByStartTime(data,start_time){    
    var filterRes = []
    try{
        data.map(dataItem=>{
                if (moment(dataItem.record_timestamp).isAfter(moment(start_time)) ){ 
                    filterRes.push(dataItem)
                } 
        })
    }catch(error){
        console.log('filter data by start_time fail')
    }
    return filterRes
} 

async function filterData_ByEndTime(data,end_time){    
    var filterRes = []
    try{
        data.map(dataItem=>{
                if (moment(dataItem.record_timestamp).isBefore(moment(end_time)) ){ 
                    filterRes.push(dataItem)
                } 
        })
    }catch(error){
        console.log('filter data by end_time fail')
    }
    return filterRes
} 

async function filterData_Bylimit(data,count_limit,sort_type){    
    var filterRes = [],count = 0  
    count_limit == undefined ? count_limit = 10 : null
    sort_type == undefined ? data = data.reverse() :null 
  
    try{
        data.map(dataItem=>{
            count < count_limit ?  filterRes.push(dataItem) : null
            count ++                 
        })
    }catch(error){
        console.log('filter data by limit fail')
    } 
     
    return filterRes
} 


async function get_data(request, response){

    let { 
        key,
        tag, // array
        Lbeacon, // array
        start_time, // YYYY/MM/DD HH:mm:ss
        end_time, // YYYY/MM/DD HH:mm:ss
        count_limit, // 
        sort_type,
    } = request.body 
 
    var matchRes = ( Promise.resolve(match_key(key)));
    await   matchRes.then(function(result){matchRes = result}) 

    if (matchRes == 1 ){   // 金鑰驗證通過

        // 檢查這把金鑰的所屬地區 
        area = (Promise.resolve(get_area_role(key)));
        await  area.then(function(result){area = result}) 

        let shouldFilter = true //判斷是否需要過濾
        area.map(item=>{
            if(item.area_id == '9999') { shouldFilter = false}
        }) 

        //過濾出屬於此區域的mac_address
        var filterObject = (Promise.resolve(filterMacAddressByArea(area,shouldFilter)));
        await  filterObject.then(function(result){filterObject = result})  
         
        //用mac_address找出location history
        let data  = (Promise.resolve(get_history(filterObject)));
        await  data.then(function(result){data = result}) 
 

        let temp  
        if (tag){ //有輸入過濾資料條件：ＴＡＧ
            temp = (Promise.resolve(filterData_ByTAG(data,tag)));
            await  temp.then(function(result){temp = result}) 
            data = temp
        }  
  
        if (Lbeacon){ //有輸入過濾資料條件：ＴＡＧ
            temp = (Promise.resolve(filterData_ByLbeacon(data,Lbeacon)));
            await  temp.then(function(result){temp = result}) 
            data = temp
        }  
      
  
        if (start_time){ //有輸入過濾資料條件：START TIME
            temp = (Promise.resolve(filterData_ByStartTime(data,start_time)));
            await  temp.then(function(result){temp = result}) 
            data = temp
        }  
         
        if (end_time){ //有輸入過濾資料條件：END TIME
            temp = (Promise.resolve(filterData_ByStartTime(data,start_time)));
            await  temp.then(function(result){temp = result}) 
            data = temp
        }  
  
        //預設是抓 "最新" "10"筆
        //有過濾資料條件：count limit 
        temp = (Promise.resolve(filterData_Bylimit(data,count_limit,sort_type)));
        await  temp.then(function(result){temp = result}) 
        data = temp 


        response.status(200).json(data)  
 
        

    }else if (matchRes == 2 ){
        response.json({
            error_code: '201',
            error_message:'get data fail : key is out of active period',
            data: ''
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
    get_data,
    match_key,
    get_area_role,
    get_history,
    filterData_ByTAG,
    filterData_ByLbeacon,
    filterData_ByStartTime,
    filterData_ByEndTime,
    filterData_Bylimit
}