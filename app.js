var express = require('express');
var mysql = require('mysql');
var connection = require('./database')
const bodyParser = require('body-parser');



var users = require('./routes/users')
var buildings = require('./routes/buildings')

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/buildings', buildings);




app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, function () {
  console.log('Node server running on port : 3000')
})