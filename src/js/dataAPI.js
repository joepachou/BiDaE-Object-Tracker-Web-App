const LocalIP = 'localhost:3000'
const RemoteIP = 'bot.iis.sinica.edu.tw'

const trackingData = 'http://' + RemoteIP + '/data/trackingData';
const objectTable = 'http://'  + RemoteIP + '/data/objectTable';
const lbeaconTable = 'http://' + RemoteIP + '/data/lbeaconTable';
const gatewayTable = 'http://' + RemoteIP + '/data/gatewayTable';
const searchResult = 'http://' + RemoteIP + '/data/searchResult';
const geofenceData = 'http://' + RemoteIP + '/data/geofenceData';


module.exports = {
    trackingData,
    objectTable,
    lbeaconTable,
    gatewayTable,
    searchResult,
    geofenceData,
};