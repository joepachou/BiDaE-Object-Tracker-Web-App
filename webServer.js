require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const httpsPort = 443;
const httpPort = 80;
const path = require('path');
const https = require('https');
const http = require('http');
const session = require('express-session');
const validation = require('./api/middlewares/validation');
const sessionOptions = require('./api/config/session');
const credentials = require('./api/config/credentials');
const dataRoutes = require('./api/routes/dataRoutes');
const authRoutes = require('./api/routes/dataRoutes/authRoutes');
const UIRoutes = require('./api/routes/UIRoutes');
const APIRoutes = require('./web_server/routes/APIRoutes');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(session(sessionOptions));

app.use(express.static(path.join(__dirname,'dist')));

UIRoutes(app);

authRoutes(app);

/** Access control of data retrieving from database by session */
// app.use(validation.authChecker);

/** Data retrieving routes */
dataRoutes(app);

APIRoutes(app);

switch(process.env.ENABLE_HTTP) {
    case "1":
    case 1:
    case true:
        const httpServer = http.createServer(app);

        /** Initiate HTTPS server */
        httpServer.listen(httpPort, () => {
            console.log(`HTTP Server running on PORT ${httpPort}`)
        })

        httpServer.timeout = parseInt(process.env.SERVER_TIMEOUT);
        break;
    default: 
        const httpsServer = https.createServer(credentials, app);

        /** Initiate HTTPS server */
        httpsServer.listen(httpsPort, () => {
            console.log(`HTTPS Server running on PORT ${httpsPort}`)
        })

        httpsServer.timeout = parseInt(process.env.SERVER_TIMEOUT);
        break;
}





