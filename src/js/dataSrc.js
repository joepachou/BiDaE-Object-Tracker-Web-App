const IP = 'localhost:3000';//'bot.iis.sinica.edu.tw'

const getTrackingData = 'http://' + IP + '/data/getTrackingData';
const getObjectTable = 'http://' + IP + '/data/getObjectTable';
const getLbeaconTable = 'http://' + IP + '/data/getLbeaconTable';
const getGatewayTable = 'http://' + IP + '/data/getGatewayTable';
const searchResult = 'http://' + IP + '/data/searchResult';
const geofenceData = 'http://' + IP + '/data/geofenceData';
const editObject = 'http://' + IP + '/data/editObject';
const addObject = 'http://' + IP + '/data/addObject';
const editObjectPackage = 'http://' + IP +'/data/editObjectPackage';
const signin = 'http://' + IP + '/user/signin';
const signup = 'http://' + IP + '/user/signup';
const getUserInfo = 'http://' + IP + '/user/getUserInfo';
const addUserSearchHistory = 'http://' + IP + '/user/addUserSearchHistory'
const editLbeacon = 'http://' + IP + '/data/editLbeacon'
const modifyMyDevice = 'http://' + IP + '/data/modifyMyDevice';
const generatePDF = 'http://' + IP + '/data/generatePDF'
const getPDFInfo = 'http://' + IP + '/data/PDFInfo'



const pdfUrl = function(path){
    return 'http://' + IP + '/' + path
}

module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    searchResult,
    geofenceData,
    editObject,
    addObject,
    editObjectPackage,
    signin,
    signup,
    getUserInfo,
    addUserSearchHistory,
    editLbeacon,
    pdfUrl,
    generatePDF,
    modifyMyDevice,
    getPDFInfo,
    
};
