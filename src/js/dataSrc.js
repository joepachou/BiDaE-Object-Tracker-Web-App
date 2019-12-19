const dataSrcIP = process.env.DATASRC_IP;
const protocol = process.env.PROTOCOL;
const domain = `${protocol}://${dataSrcIP}`;
const getTrackingData = `${protocol}://${dataSrcIP}/data/getTrackingData`;
const getObjectTable = `${protocol}://${dataSrcIP}/data/getObjectTable`;
const getObjectTable_fromImport = `${protocol}://${dataSrcIP}/data/getObjectTable_fromImport`;
const getPatientTable = `${protocol}://${dataSrcIP}/data/getPatientTable`;
const getLbeaconTable = `${protocol}://${dataSrcIP}/data/getLbeaconTable`;
const getGatewayTable = `${protocol}://${dataSrcIP}/data/getGatewayTable`;
const searchResult = `${protocol}://${dataSrcIP}/data/searchResult`;
const geofenceData = `${protocol}://${dataSrcIP}/data/geofenceData`;
const editObject = `${protocol}://${dataSrcIP}/data/editObject`;
const editImport = `${protocol}://${dataSrcIP}/data/editImport`;
const editPatient = `${protocol}://${dataSrcIP}/data/editPatient`;
const addObject = `${protocol}://${dataSrcIP}/data/addObject`;
const addPatient= `${protocol}://${dataSrcIP}/data/addPatient`;
const getImportTable = `${protocol}://${dataSrcIP}/data/getImportTable`;
const getImportData = `${protocol}://${dataSrcIP}/data/getImportData`;
const editImportData = `${protocol}://${dataSrcIP}/data/editImportData`;
const cleanBinding = `${protocol}://${dataSrcIP}/data/cleanBinding`;
const editObjectPackage = `${protocol}://${dataSrcIP}/data/editObjectPackage`;
const signin = `${protocol}://${dataSrcIP}/user/signin`;
const signup = `${protocol}://${dataSrcIP}/user/signup`;
const getUserInfo = `${protocol}://${dataSrcIP}/user/getUserInfo`;
const addUserSearchHistory = `${protocol}://${dataSrcIP}/user/addUserSearchHistory`;
const editLbeacon = `${protocol}://${dataSrcIP}/data/editLbeacon`;
const modifyMyDevice = `${protocol}://${dataSrcIP}/data/modifyMyDevice`;
const generatePDF = `${protocol}://${dataSrcIP}/data/generatePDF`;
const getPDFInfo = `${protocol}://${dataSrcIP}/data/PDFInfo`;
const validateUsername = `${protocol}://${dataSrcIP}/validation/username`;
const getEditObjectRecord = `${protocol}://${dataSrcIP}/test/getEditObjectRecord`;
const deleteEditObjectRecord = `${protocol}://${dataSrcIP}/test/deleteEditObjectRecord`
const deleteShiftChangeRecord = `${protocol}://${dataSrcIP}/test/deleteShiftChangeRecord`
const deletePatient = `${protocol}://${dataSrcIP}/test/deletePatient`
const deleteDevice = `${protocol}://${dataSrcIP}/test/deleteDevice`
const deleteImportData = `${protocol}://${dataSrcIP}/test/deleteImportData`
const deleteLBeacon= `${protocol}://${dataSrcIP}/test/deleteLBeacon`
const deleteGateway= `${protocol}://${dataSrcIP}/test/deleteGateway`
const getUserList = `${protocol}://${dataSrcIP}/test/getUserList`
const getUserRole = `${protocol}://${dataSrcIP}/test/getUserRole`
const getRoleNameList = `${protocol}://${dataSrcIP}/test/getRoleNameList`
const deleteUser = `${protocol}://${dataSrcIP}/test/deleteUser`
const setUserRole = `${protocol}://${dataSrcIP}/test/setUserRole`
const getAreaTable = `${protocol}://${dataSrcIP}/data/getAreaTable`
const getGeoFenceConfig = `${protocol}://${dataSrcIP}/data/getGeoFenceConfig`
const setGeoFenceConfig = `${protocol}://${dataSrcIP}/data/setGeoFenceConfig`
const addShiftChangeRecord = `${protocol}://${dataSrcIP}/data/addShiftChangeRecord`
const checkoutViolation = `${protocol}://${dataSrcIP}/data/checkoutViolation`
const confirmValidation = `${protocol}://${dataSrcIP}/data/confirmValidation`
const getMonitorConfig = `${protocol}://${dataSrcIP}/data/getMonitorConfig`
const setMonitorConfig = `${protocol}://${dataSrcIP}/data/setMonitorConfig`
const backendSearch = `${protocol}://${dataSrcIP}/data/backendSearch`
const getSearchQueue = `${protocol}://${dataSrcIP}/data/getSearchQueue`
const objectImport = `${protocol}://${dataSrcIP}/data/objectImport`
const addBulkObject = `${protocol}://${dataSrcIP}/data/addBulkObject`
const pinImage = `${protocol}://${dataSrcIP}/image/pinImage`
const getTransferredLocation = `${protocol}://${dataSrcIP}/data/getTransferredLocation`

const pdfUrl = function(path){
    return `${protocol}://${dataSrcIP}/${path}`
}

module.exports = {
    domain,
    getTrackingData,
    getImportData,
    editImportData,
    editImport,
    cleanBinding,
    getObjectTable,
    getPatientTable,
    getImportTable,
    getLbeaconTable,
    getGatewayTable,
    getMonitorConfig,
    getTransferredLocation,
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
    getObjectTable_fromImport,
    pinImage
};
