const dataSrcIP = process.env.dataSrcIP;
const getTrackingData = `http://${dataSrcIP}/data/getTrackingData`;
const getObjectTable = `http://${dataSrcIP}/data/getObjectTable`;
const getLbeaconTable = `http://${dataSrcIP}/data/getLbeaconTable`;
const getGatewayTable = `http://${dataSrcIP}/data/getGatewayTable`;
const searchResult = `http://${dataSrcIP}/data/searchResult`;
const geofenceData = `http://${dataSrcIP}/data/geofenceData`;
const editObject = `http://${dataSrcIP}/data/editObject`;
const addObject = `http://${dataSrcIP}/data/addObject`;
const editObjectPackage = `http://${dataSrcIP}/data/editObjectPackage`;
const signin = `http://${dataSrcIP}/user/signin`;
const signup = `http://${dataSrcIP}/user/signup`;
const getUserInfo = `http://${dataSrcIP}/user/getUserInfo`;
const addUserSearchHistory = `http://${dataSrcIP}/user/addUserSearchHistory`;
const editLbeacon = `http://${dataSrcIP}/data/editLbeacon`;
const modifyMyDevice = `http://${dataSrcIP}/data/modifyMyDevice`;
const generatePDF = `http://${dataSrcIP}/data/generatePDF`;
const getPDFInfo = `http://${dataSrcIP}/data/PDFInfo`;
const validateUsername = `http://${dataSrcIP}/validation/username`;
const getEditObjectRecord = `http://${dataSrcIP}/test/getEditObjectRecord`
const getUserList = `http://${dataSrcIP}/test/getUserList`
const getUserRole = `http://${dataSrcIP}/test/getUserRole`
const getRoleNameList = `http://${dataSrcIP}/test/getRoleNameList`
const removeUser = `http://${dataSrcIP}/test/removeUser`
const setUserRole = `http://${dataSrcIP}/test/setUserRole`



const pdfUrl = function(path){
    return `http://${dataSrcIP}/${path}`
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
    validateUsername,    
    getEditObjectRecord,
    getUserList,
    getUserRole,
    getRoleNameList,
    removeUser,
    setUserRole,
};
