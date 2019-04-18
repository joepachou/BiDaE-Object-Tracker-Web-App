const LocalIP = 'localhost:3000'
const RemoteIP = 'bot.iis.sinica.edu.tw'

const trackingData = 'http://' + LocalIP + '/data/trackingData';
const objectTable = 'http://' + LocalIP + '/data/objectTable';
const lbeaconTable = 'http://' + LocalIP + '/data/lbeaconTable';
const gatewayTable = 'http://' + LocalIP + '/data/gatewayTable';


module.exports = {
    trackingData,
    objectTable,
    lbeaconTable,
    gatewayTable,
};