const IP = 'localhost';//'bot.iis.sinica.edu.tw'

const getTrackingData = 'https://' + IP + '/data/getTrackingData';
const getObjectTable = 'https://' + IP + '/data/getObjectTable';
const getLbeaconTable = 'https://' + IP + '/data/getLbeaconTable';
const getGatewayTable = 'https://' + IP + '/data/getGatewayTable';
const searchResult = 'https://' + IP + '/data/searchResult';
const geofenceData = 'https://' + IP + '/data/geofenceData';
const editObject = 'https://' + IP + '/data/editObject';
const editObjectPackage = 'https://' + IP +'/data/editObjectPackage';
const signin = 'https://' + IP + '/user/signin';
const signup = 'https://' + IP + '/user/signup';
const getUserInfo = 'https://' + IP + '/user/getUserInfo';
const getUserSearchHistory = 'https://' + IP + '/user/getUserSearchHistory'
const addUserSearchHistory = 'https://' + IP + '/user/addUserSearchHistory'
const editLbeacon = 'https://' + IP + '/data/editLbeacon'

module.exports = {
    getTrackingData,
    getObjectTable,
    getLbeaconTable,
    getGatewayTable,
    searchResult,
    geofenceData,
    editObject,
    editObjectPackage,
    signin,
    signup,
    getUserInfo,
    getUserSearchHistory,
    addUserSearchHistory,
    editLbeacon
};
