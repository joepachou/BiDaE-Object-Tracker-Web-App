const IP = 'localhost';//'bot.iis.sinica.edu.tw'

const trackingData = 'https://' + IP + '/data/trackingData';
const objectTable = 'https://' + IP + '/data/objectTable';
const lbeaconTable = 'https://' + IP + '/data/lbeaconTable';
const gatewayTable = 'https://' + IP + '/data/gatewayTable';
const searchResult = 'https://' + IP + '/data/searchResult';
const geofenceData = 'https://' + IP + '/data/geofenceData';
const editObject = 'https://' + IP + '/data/editObject';
const editObjectPackage = 'https://' + IP +'/data/editObjectPackage';
const signin = 'https://' + IP + '/user/signin';
const signup = 'https://' + IP + '/user/signup';
const userInfo = 'https://' + IP + '/user/info';
const userSearchHistory = 'https://' + IP + '/user/searchHistory'
const addUserSearchHistory = 'https://' + IP + '/user/addUserSearchHistory'
const editLbeacon = 'https://' + IP + '/data/editLbeacon'

module.exports = {
    trackingData,
    objectTable,
    lbeaconTable,
    gatewayTable,
    searchResult,
    geofenceData,
    editObject,
    editObjectPackage,
    signin,
    signup,
    userInfo,
    userSearchHistory,
    addUserSearchHistory,
    editLbeacon
};
