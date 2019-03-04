const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000;
const db = require('./query')
const path = require('path');

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(path.join(__dirname,'dist')));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/users', db.getUsers);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
    console.log(process.env)
})

