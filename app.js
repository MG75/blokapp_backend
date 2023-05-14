var express = require('express');
var mysql = require('mysql');
var connection = require('./database')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

var users = require('./routes/users')
var buildings = require('./routes/buildings')
var posts = require('./routes/posts')
var votes = require('./routes/votes')
const port = 3000;

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/buildings', buildings);
app.use('/posts', posts);
app.use('/votes', votes)




app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, function () {
  console.log('Node server running on port : 3000')
})