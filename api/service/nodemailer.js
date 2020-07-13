const nodemailer = require('nodemailer');

// let transport = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//        user: 'daf0bca0f4f7b1',
//        pass: '50a28be26e3db7'
//     }
// });

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ossf402@gmail.com',
      pass: 'jane1807',
    },
  });

module.exports = transport;