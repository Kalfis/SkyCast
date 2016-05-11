'use strict'
let express = require('express');
let logger = require('morgan');
let request = require('request')
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let User = require('./models/user'); // get our mongoose model for user
// require our routes
let user = require('./controllers/users_controller');
let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
// Register our routes
// all routes starting with /users will be in userRoutes
app.use('/user', user);

let mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/WeatherApp');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', (callback) => {
  console.log('Mongoose Connected');
});

let server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('express running', host, port);
  console.log(process.env.SECRET);
});
