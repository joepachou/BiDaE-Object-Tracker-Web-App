const db = require('../api_query');

module.exports = app => { 
    app.post('/api/1.0/get_key', db.get_key)
    app.post('/api/1.0/get_mac_address', db.search_by_mac_address)
    app.post('/api/1.0/match_key', db.match_key)
}