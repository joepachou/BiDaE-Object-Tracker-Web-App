require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;
const db = require('./web_server/query')
const path = require('path');
const fs = require('fs')
const http = require('http');;
const https = require('https');
const session = require('express-session')
const formidable = require('formidable');
const cors = require('cors');
// const csv = require('csv-parse')
const csv =require('csvtojson')
const {
    PRIVATE_KEY,
    CERTIFICATE,
    CA_BUNDLE
} = process.env


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static(path.join(__dirname,'dist')));
// app.use(cors())

app.use(session({
    secret: 'super_hound',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000 * 300
    }
}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.get('/', (req,res) => {
//     if (req.session.userInfo) {
//         res.write('views: ' + req.session.userInfo + req.sessionID)
//         res.end()
//     } else {
//         req.session.userInfo = 'joechou'
//         res.end('welcome to the session demo. refresh!')
//     }
// })
// fs.createReadStream('transferred_location.csv')
// .pipe(csv())
// .on('data', function(data){
//     try {
//         console.log(data)
//     }
//     catch(err) {
//         console.log(err)
//     }
// })

// csv()
// .fromFile('transferred_location.csv')
// .then( jsonObj => {
//     console.log(jsonObj)
// })


app.get('/image/pinImage/:pinImage', (req, res) => {
    res.sendFile(path.join(__dirname, 'src','img','colorPin',req.params['pinImage']));
})

app.get(/^\/page\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})

app.post('/data/getObjectTable', db.getObjectTable);

app.post('/data/getObjectTable_fromImport', db.getObjectTable_fromImport);

app.post('/data/getTrackingTableByMacAddress', db.getTrackingTableByMacAddress);

app.post('/data/getPatientTable', db.getPatientTable);

app.post('/data/getImportTable', db.getImportTable);

app.post('/data/getImportData', db.getImportData);

app.post('/data/editImportData', db.editImportData);

app.post('/data/cleanBinding', db.cleanBinding);

app.post('/data/getLbeaconTable', db.getLbeaconTable);

app.post('/data/getGatewayTable', db.getGatewayTable);

app.post('/data/geofenceData', db.getGeofenceData);

app.post('/data/getTrackingData', db.getTrackingData);

app.post('/data/editObject', db.editObject);

app.post('/data/editImport', db.editImport);


app.post('/data/editPatient', db.editPatient);

app.post('/data/objectImport', db.objectImport);

app.post('/data/addObject', db.addObject);

app.post('/data/addPatient', db.addPatient);

app.post('/data/editObjectPackage', db.editObjectPackage)

app.post('/user/signin', db.signin)

app.post('/user/signup', db.signup);

app.post('/user/getUserInfo', db.getUserInfo)

app.post('/user/addUserSearchHistory', db.addUserSearchHistory)

app.post('/data/editLbeacon', db.editLbeacon)

app.post('/data/generatePDF',db.generatePDF)

app.post('/data/PDFInfo',db.getPDFInfo)

app.post('/data/modifyMyDevice', db.modifyUserDevices)

app.post('/data/getAreaTable', db.getAreaTable)

app.post('/data/getGeoFenceConfig', db.getGeoFenceConfig)

app.post('/data/setGeoFenceConfig', db.setGeoFenceConfig)

app.post('/data/setGeoFenceConfigRows', db.setGeoFenceConfigRows)

app.post('/validation/username', db.validateUsername)

app.post('/test/getUserList', db.getUserList)

app.post('/test/getUserRole', db.getUserRole)

app.post('/test/getRoleNameList', db.getRoleNameList)

app.post('/test/deleteUser', db.deleteUser)

app.post('/test/setUserRole', db.setUserRole)

app.post('/test/getEditObjectRecord', db.getEditObjectRecord)

app.post('/test/deleteEditObjectRecord', db.deleteEditObjectRecord)

app.post('/test/deleteShiftChangeRecord', db.deleteShiftChangeRecord)

app.post('/test/deletePatient', db.deletePatient)

app.post('/test/deleteDevice', db.deleteDevice)

app.post('/test/deleteImportData', db.deleteImportData)

app.post('/test/deleteLBeacon', db.deleteLBeacon)

app.post('/test/deleteGateway', db.deleteGateway)

app.post('/data/addShiftChangeRecord', db.addShiftChangeRecord)

app.post('/data/checkoutViolation', db.checkoutViolation)

app.post('/data/confirmValidation', db.confirmValidation)

app.post('/data/getMonitorConfig', db.getMonitorConfig)

app.post('/data/setMonitorConfig', db.setMonitorConfig)

app.post('/data/backendSearch', db.backendSearch)

app.post('/data/getSearchQueue', db.getBackendSearchQueue)

app.post('/data/getAreaTable', db.getAreaTable)

app.post('/data/addBulkObject', db.addBulkObject)

app.get('/data/getTransferredLocation', (req, res) => {
    csv()
    .fromFile('transferred_location.csv')
    .then(jsonObj => {
        res.status(200).json(jsonObj)
    })
    .catch(err => {
        console.log(`get tranferred location data error: ${err}`)
    })
})

app.get(`/${process.env.DEFAULT_FOLDER}/shift_record/:file`, (req, res) =>{
	res.sendFile(path.join(__dirname, `${process.env.DEFAULT_FOLDER}/shift_record`,req.params['file']));
})

app.get(`/${process.env.DEFAULT_FOLDER}/search_result/:file`, (req, res) =>{
	res.sendFile(path.join(__dirname, `${process.env.DEFAULT_FOLDER}/search_result`,req.params['file']));
})

app.get(`/${process.env.DEFAULT_FOLDER}/edit_object_record/:file`, (req, res) =>{
	res.sendFile(path.join(__dirname, `${process.env.DEFAULT_FOLDER}/edit_object_record`,req.params['file']));
})

app.get('/download/com.beditech.IndoorNavigation.apk', (req, res) => {
    const file = `${__dirname}/download/com.beditech.IndoorNavigation.apk`;
    res.download(file);
});


/** privatekey name: private.key
 *  certificate name: certificate.cert or certificate.crt
 *  ca_bundle name: ca.bundle.crt
 */

/** Create self-signed certificate  
 *  >> openssl req -nodes -new -x509 -keyout private.key -out certificate.cert 
 * If it is window os, please refer to https://tecadmin.net/install-openssl-on-windows/ install openssl 
 * and set the environment variables*/

// var privateKey = PRIVATE_KEY ? fs.readFileSync(__dirname + `/ssl/${PRIVATE_KEY}`) : null
// var certificate = CERTIFICATE ? fs.readFileSync(__dirname + `/ssl/${CERTIFICATE}`) : null
// var ca_bundle = CA_BUNDLE ? fs.readFileSync(__dirname + `/ssl/${CA_BUNDLE}`) : null

// var credentials = PRIVATE_KEY ? { 
//     key: privateKey, 
//     cert: certificate,
//     ca: ca_bundle
// } : null

// const httpsServer = https.createServer(credentials, app)

const httpServer = http.createServer(app);


/** Enable HTTP server */
httpServer.listen(httpPort, () =>{
    console.log(`HTTP Server running on port ${httpPort}`)
})

/** Enable HTTPS server */
// PRIVATE_KEY ? httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server running on PORT ${httpsPort}`)
// }) : null

