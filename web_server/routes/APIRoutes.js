const db = require('../api_query');

module.exports = app => { 
    app.post('/api/1.0/apiGetKey', db.apiGetKey)
}