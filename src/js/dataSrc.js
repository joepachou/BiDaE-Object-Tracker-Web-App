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
const getImportTable = `http://${dataSrcIP}/data/getImportTable`;
const getImportData = `http://${dataSrcIP}/data/getImportData`;
const editImportData = `http://${dataSrcIP}/data/editImportData`;
const cleanImportData = `http://${dataSrcIP}/data/cleanImportData`;
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
const deleteShiftChangeRecord = `http://${dataSrcIP}/test/deleteShiftChangeRecord`
const deletePatient = `http://${dataSrcIP}/test/deletePatient`
const deleteDevice = `http://${dataSrcIP}/test/deleteDevice`
const deleteImportData = `http://${dataSrcIP}/test/deleteImportData`
const deleteLBeacon= `http://${dataSrcIP}/test/deleteLBeacon`
const deleteGateway= `http://${dataSrcIP}/test/deleteGateway`
const getUserList = `http://${dataSrcIP}/test/getUserList`
const getUserRole = `http://${dataSrcIP}/test/getUserRole`
const getRoleNameList = `http://${dataSrcIP}/test/getRoleNameList`
const deleteUser = `http://${dataSrcIP}/test/deleteUser`
const setUserRole = `http://${dataSrcIP}/test/setUserRole`
const getAreaTable = `http://${dataSrcIP}/data/getAreaTable`
const getGeoFenceConfig = `http://${dataSrcIP}/data/getGeoFenceConfig`
const setGeoFenceConfig = `http://${dataSrcIP}/data/setGeoFenceConfig`
const addShiftChangeRecord = `http://${dataSrcIP}/data/addShiftChangeRecord`
const checkoutViolation = `http://${dataSrcIP}/data/checkoutViolation`
const confirmValidation = `http://${dataSrcIP}/data/confirmValidation`
const getMonitorConfig = `http://${dataSrcIP}/data/getMonitorConfig`
const setMonitorConfig = `http://${dataSrcIP}/data/setMonitorConfig`
const backendSearch = `http://${dataSrcIP}/data/backendSearch`
const getSearchQueue = `http://${dataSrcIP}/data/getSearchQueue`
const objectImport = `http://${dataSrcIP}/data/objectImport`
const addBulkObject = `http://${dataSrcIP}/data/addBulkObject`
const pinImage = `http://${dataSrcIP}/image/pinImage`


const pdfUrl = function(path){
    return `https://${dataSrcIP}/${path}`
}

module.exports = {
    getTrackingData,
    getImportData,
    editImportData,
    cleanImportData,
    getObjectTable,
    getPatientTable,
    getImportTable,
    getLbeaconTable,
    getGatewayTable,
    getMonitorConfig,
    searchResult,
    geofenceData,
    editObject,
    deletePatient,
    editPatient,
    addObject,
    addPatient,
    editObjectPackage,
    signin,
    signup,
    getUserInfo,
    objectImport,
    addUserSearchHistory,
    editLbeacon,
    pdfUrl,
    generatePDF,
    modifyMyDevice,
    deleteDevice,
    deleteImportData,
    deleteLBeacon,
    deleteGateway,
    getPDFInfo,
    validateUsername,    
    getEditObjectRecord,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    getUserList,
    getUserRole,
    getRoleNameList,
    deleteUser,
    setUserRole,
    getAreaTable,
    getGeoFenceConfig,
    setGeoFenceConfig,
    addShiftChangeRecord,
    checkoutViolation,
    confirmValidation,
    setMonitorConfig,
    backendSearch,
    getSearchQueue, 
    pinImage
};
