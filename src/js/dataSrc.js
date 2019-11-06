const dataSrcIP = process.env.DATASRC_IP;
const getTrackingData = `http://${dataSrcIP}/data/getTrackingData`;
const getObjectTable = `http://${dataSrcIP}/data/getObjectTable`;
const getPatientTable = `http://${dataSrcIP}/data/getPatientTable`;
const getLbeaconTable = `http://${dataSrcIP}/data/getLbeaconTable`;
const getGatewayTable = `http://${dataSrcIP}/data/getGatewayTable`;
const searchResult = `http://${dataSrcIP}/data/searchResult`;
const geofenceData = `http://${dataSrcIP}/data/geofenceData`;
const editObject = `http://${dataSrcIP}/data/editObject`;
const editPatient = `http://${dataSrcIP}/data/editPatient`;
const addObject = `http://${dataSrcIP}/data/addObject`;
const addPatient= `http://${dataSrcIP}/data/addPatient`;

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
const deleteEditObjectRecord = `http://${dataSrcIP}/test/deleteEditObjectRecord`
const getUserList = `http://${dataSrcIP}/test/getUserList`
const getUserRole = `http://${dataSrcIP}/test/getUserRole`
const getRoleNameList = `http://${dataSrcIP}/test/getRoleNameList`
const deleteUser = `http://${dataSrcIP}/test/deleteUser`
const setUserRole = `http://${dataSrcIP}/test/setUserRole`
const getAreaTable = `http://${dataSrcIP}/data/getAreaTable`
const getGeoFenceConfig = `http://${dataSrcIP}/data/getGeoFenceConfig`
const setGeoFenceConfig = `http://${dataSrcIP}/data/setGeoFenceConfig`
const addShiftChangeRecord = `http://${dataSrcIP}/data/addShiftChangeRecord`


const pdfUrl = function(path){
    return `http://${dataSrcIP}/${path}`
}

module.exports = {
    getTrackingData,
    getObjectTable,
    getPatientTable,
    getLbeaconTable,
    getGatewayTable,
    searchResult,
    geofenceData,
    editObject,
    editPatient,
    addObject,
    addPatient,
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
    deleteEditObjectRecord,
    getUserList,
    getUserRole,
    getRoleNameList,
    deleteUser,
    setUserRole,
    getAreaTable,
    getGeoFenceConfig,
    setGeoFenceConfig,
    addShiftChangeRecord
};
