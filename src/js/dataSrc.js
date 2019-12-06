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

const getTrackingData = `https://${dataSrcIP}/data/getTrackingData`;
const getObjectTable = `https://${dataSrcIP}/data/getObjectTable`;
const getPatientTable = `https://${dataSrcIP}/data/getPatientTable`;
const getLbeaconTable = `https://${dataSrcIP}/data/getLbeaconTable`;
const getGatewayTable = `https://${dataSrcIP}/data/getGatewayTable`;
const searchResult = `https://${dataSrcIP}/data/searchResult`;
const geofenceData = `https://${dataSrcIP}/data/geofenceData`;
const editObject = `https://${dataSrcIP}/data/editObject`;
const editPatient = `https://${dataSrcIP}/data/editPatient`;
const addObject = `https://${dataSrcIP}/data/addObject`;
const addPatient= `https://${dataSrcIP}/data/addPatient`;
const getImportTable = `https://${dataSrcIP}/data/getImportTable`;
const getImportData = `https://${dataSrcIP}/data/getImportData`;
const editImportData = `https://${dataSrcIP}/data/editImportData`;
const editObjectPackage = `https://${dataSrcIP}/data/editObjectPackage`;
const signin = `https://${dataSrcIP}/user/signin`;
const signup = `https://${dataSrcIP}/user/signup`;
const getUserInfo = `https://${dataSrcIP}/user/getUserInfo`;
const addUserSearchHistory = `https://${dataSrcIP}/user/addUserSearchHistory`;
const editLbeacon = `https://${dataSrcIP}/data/editLbeacon`;
const modifyMyDevice = `https://${dataSrcIP}/data/modifyMyDevice`;
const generatePDF = `https://${dataSrcIP}/data/generatePDF`;
const getPDFInfo = `https://${dataSrcIP}/data/PDFInfo`;
const validateUsername = `https://${dataSrcIP}/validation/username`;
const getEditObjectRecord = `https://${dataSrcIP}/test/getEditObjectRecord`
const deleteEditObjectRecord = `https://${dataSrcIP}/test/deleteEditObjectRecord`
const deleteShiftChangeRecord = `https://${dataSrcIP}/test/deleteShiftChangeRecord`
const deletePatient = `https://${dataSrcIP}/test/deletePatient`
const deleteDevice = `https://${dataSrcIP}/test/deleteDevice`
const deleteLBeacon= `https://${dataSrcIP}/test/deleteLBeacon`
const deleteGateway= `https://${dataSrcIP}/test/deleteGateway`
const getUserList = `https://${dataSrcIP}/test/getUserList`
const getUserRole = `https://${dataSrcIP}/test/getUserRole`
const getRoleNameList = `https://${dataSrcIP}/test/getRoleNameList`
const deleteUser = `https://${dataSrcIP}/test/deleteUser`
const setUserRole = `https://${dataSrcIP}/test/setUserRole`
const getAreaTable = `https://${dataSrcIP}/data/getAreaTable`
const getGeoFenceConfig = `https://${dataSrcIP}/data/getGeoFenceConfig`
const setGeoFenceConfig = `https://${dataSrcIP}/data/setGeoFenceConfig`
const addShiftChangeRecord = `https://${dataSrcIP}/data/addShiftChangeRecord`
const checkoutViolation = `https://${dataSrcIP}/data/checkoutViolation`
const confirmValidation = `https://${dataSrcIP}/data/confirmValidation`
const getMonitorConfig = `https://${dataSrcIP}/data/getMonitorConfig`
const setMonitorConfig = `https://${dataSrcIP}/data/setMonitorConfig`
const backendSearch = `https://${dataSrcIP}/data/backendSearch`
const getSearchQueue = `https://${dataSrcIP}/data/getSearchQueue`
const objectImport = `https://${dataSrcIP}/data/objectImport`


const addBulkObject = `https://${dataSrcIP}/data/addBulkObject`
const pinImage = `https://${dataSrcIP}/image/pinImage`


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
