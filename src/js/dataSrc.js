const IP = 'localhost:3000' //'bot.iis.sinica.edu.tw'

const trackingData = 'http://' + IP + '/data/trackingData';
const objectTable = 'http://' + IP + '/data/objectTable';
const lbeaconTable = 'http://' + IP + '/data/lbeaconTable';
const gatewayTable = 'http://' + IP + '/data/gatewayTable';
const searchResult = 'http://' + IP + '/data/searchResult';
const geofenceData = 'http://' + IP + '/data/geofenceData';
const editObject = 'http://' + IP + '/data/editObject';

module.exports = {
    trackingData,
    objectTable,
    lbeaconTable,
    gatewayTable,
    searchResult,
    geofenceData,
    editObject,
};