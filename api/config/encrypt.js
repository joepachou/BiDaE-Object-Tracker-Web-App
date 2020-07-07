const crypto = require('crypto');

const createHash = password => {
    const secret = 'BeDIS@1807'; 
    return crypto.createHash('sha256', secret) 
        .update(password)                     
        .digest('hex'); 
    
}

module.exports = {
    createHash
}