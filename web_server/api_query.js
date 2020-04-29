require('moment-timezone')
const moment = require('moment');
const sha256 = require('sha256');
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

const get_api_key = (request, response) => {
    let { 
        username, 
        password 
    } = request.body 


    const saltRounds = 10; 
    let getUserName = ''
    pool.query(queryType.getAllUser())//驗證帳號的正確並找出name
    .then(res =>{
        res.rows.map(item =>{ 
            if (username == item.username_sha256 && password == item.password_sha256){
                getUserName = item.name
            }
        })   
        if (getUserName != ''){
            pool.query(queryType.confirmValidation(getUserName))
            .then(res => {   
                    console.log(`confirm validation succeed`)  
                    const hash = bcrypt.hashSync(username, saltRounds); 
                    pool.query(queryType.setKey(res.rows[0].user_id,username,hash)) 
                        .then(res => {  
                            response.status(200).json({
                                error_code: '0',
                                error_message:'get key success',
                                key: hash,
                                note:'validity period of key until : ' + moment().add(300, 'm').locale('en').format('LT')
                            }) 
                            console.log('set Key success')  
                        })
                        .catch(err => {
                            console.log(`set Key failer ${err}`)
                    })    
                    console.log(`get key succeed`)   
            })
            .catch(err => {
            console.log(`confirm validation fails ${err}`)
            })   
        }else{
            console.log(`username or pwd fail`)
        } 
    })
    .catch(err => {
        console.log(`get user fails ${err}`)
    }) 
 
}


async function get_history_data(request, response){

    let { 
        key,
        tag, // array
        Lbeacon, // array
        start_time, // YYYY/MM/DD HH:mm:ss
        end_time, // YYYY/MM/DD HH:mm:ss
        count_limit, // 
        sort_type,
    } = request.body 
    
    tagFilter =[]
    LbeaconFilter = []
    tag.map(tagItem=>{tagFilter.push(tagItem.replace(/`'/g, ""))  }) 
    Lbeacon.map(LbeaconItem=>{LbeaconFilter.push(LbeaconItem.replace(/`'/g, ""))  }) 
     
 
    var matchRes = ( Promise.resolve(match_key(key)));
    await   matchRes.then(function(result){matchRes = result}) 

    if (matchRes == 1 ){   // 金鑰驗證通過

        // 檢查這把金鑰的所屬地區 
        area = (Promise.resolve(get_area_role(key)));
        await  area.then(function(result){area = result}) 

        //找出出屬於此區域的mac_address －> 並依照輸入的資料再過濾
        var filterObject = (Promise.resolve(filterMacAddressByArea(area,tagFilter)));
        await  filterObject.then(function(result){filterObject = result}) 
 
        //用過濾後的mac_address 配合LBeacon 找出history
        let data  = (Promise.resolve(get_history(filterObject,LbeaconFilter)));
        await  data.then(function(result){data = result})  


        let temp      
        temp = (Promise.resolve(filterData_ByTime(data,start_time,end_time)));
        await  temp.then(function(result){temp = result}) 
        data = temp
 
  
        //預設是抓 "最新" "10" 筆
        //有過濾資料條件：count limit 
        temp = (Promise.resolve(filterData_Bylimit(data,count_limit,sort_type)));
        await  temp.then(function(result){temp = result}) 
        data = temp 


        response.status(200).json(data)  
 
        

    }else if (matchRes == 2 ){
        response.json({
            error_code: '201',
            error_message:'get data fail : key is out of active time',
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
 





 
async function match_key(key, response){  
    let matchFlag = 0
    return await pool.query(queryType.getAllKey()) 
        .then(res => {    
            res.rows.map(item =>{ 
                let vaildTime = moment(item.register_time).add(300, 'm')
                
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

async function filterMacAddressByArea(area  ,tag, response){    
    
    return await   pool.query(queryType.filterMacAddressByArea(area,tag)) 
        .then(res => {    
            console.log(`filter Mac Address success`) 
            return res.rows
        })
        .catch(err => { 
            console.log(`filter Mac Address ${err}`)
        })  

} 

async function get_history(filterObject, Lbeacon,response){    
    return await   pool.query(queryType.searchByMacAddress(filterObject,Lbeacon))
    .then(res => { 
        res.error_code= '0'
        res.error_message='get data success'  

        console.log(`search by mac address success`)    
        return res.rows
    })
    .catch(err => { 
        console.log(`search by mac address fail ${err}`)
        response.json({
            error_code: '300',
            error_message:'get data fail : no object for this area',
            data: ''
        })
    }) 
}  

async function filterData_ByTime(data,start_time,end_time){    
    var filterRes = []
    var filterResFinal = []  
    if(start_time != undefined)
    { 
        try{
            data.map(dataItem=>{
                    if (moment(dataItem.record_timestamp).isAfter(moment(start_time,'YYYY/MM/DD HH:mm:ss').format()) ){ 
                        filterRes.push(dataItem)
                    } 
            })
        }catch(error){ 
            console.log(`filter data by start_time fail ${err}`)
        }
    }else{
        filterRes = data  
    }

    if(end_time != undefined)
    { 
        try{
            filterRes.map(dataItem=>{ 
                    if (moment(dataItem.record_timestamp).isBefore(moment(end_time,'YYYY/MM/DD HH:mm:ss').format()) ){ 
                        filterResFinal.push(dataItem)
                    } 
            })
        }catch(error){
            console.log(`filter data by end_time fail ${err}`)
        }    
    }else{
        filterResFinal = filterRes
    }

    return filterResFinal
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


 

module.exports = {
    get_api_key,
    get_history_data, 
}