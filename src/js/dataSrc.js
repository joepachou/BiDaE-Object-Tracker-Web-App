const dataSrcIP = process.env.DATASRC_IP;
const protocol = process.env.PROTOCOL;
const domain = `${protocol}://${dataSrcIP}`;
const getTrackingData = `${protocol}://${dataSrcIP}/data/getTrackingData`;
const getTrackingTableByMacAddress = `${protocol}://${dataSrcIP}/data/getTrackingTableByMacAddress`;
const getObjectTable = `${protocol}://${dataSrcIP}/data/getObjectTable`;
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
const addAssociation = `${protocol}://${dataSrcIP}/data/addAssociation`;
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
const getGeofenceConfig = `${protocol}://${dataSrcIP}/data/getGeofenceConfig`
const setGeofenceConfig = `${protocol}://${dataSrcIP}/data/setGeofenceConfig`
const addShiftChangeRecord = `${protocol}://${dataSrcIP}/data/addShiftChangeRecord`
const checkoutViolation = `${protocol}://${dataSrcIP}/data/checkoutViolation`
const confirmValidation = `${protocol}://${dataSrcIP}/data/confirmValidation`
const getMonitorConfig = `${protocol}://${dataSrcIP}/data/getMonitorConfig`
const setMonitorConfig = `${protocol}://${dataSrcIP}/data/setMonitorConfig`
const addMonitorConfig = `${protocol}://${dataSrcIP}/data/addMonitorConfig`
const addGeofenceConfig = `${protocol}://${dataSrcIP}/data/addGeofenceConfig`
const deleteMonitorConfig = `${protocol}://${dataSrcIP}/data/deleteMonitorConfig`
const backendSearch = `${protocol}://${dataSrcIP}/data/backendSearch`
const getSearchQueue = `${protocol}://${dataSrcIP}/data/getSearchQueue`
const objectImport = `${protocol}://${dataSrcIP}/data/objectImport`
const getImportPatient = `${protocol}://${dataSrcIP}/data/getImportPatient`
const addBulkObject = `${protocol}://${dataSrcIP}/data/addBulkObject`
const pinImage = `${protocol}://${dataSrcIP}/image/pinImage`
const getTransferredLocation = `${protocol}://${dataSrcIP}/data/getTransferredLocation`
const pdfUrl = function(path){
    return `${protocol}://${dataSrcIP}/${path}`
}

module.exports = {
    domain,
    getTrackingData,
    getTrackingTableByMacAddress,
    getImportData,
    addAssociation,
    editImport,
    cleanBinding,
    getObjectTable,
    getPatientTable,
    getImportTable,
    getImportPatient,
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
    getGeofenceConfig,
    setGeofenceConfig,
    addShiftChangeRecord,
    checkoutViolation,
    confirmValidation,
    setMonitorConfig,
    backendSearch,
    getSearchQueue, 
    pinImage,
    addGeofenceConfig,
    deleteMonitorConfig,
    addMonitorConfig
};
