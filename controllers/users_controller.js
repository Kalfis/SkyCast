'use strict';
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = process.env.SECRET;
let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
// require model
let User = require('../models/user');

let express = require('express');
let router = express.Router();

var userToken;

// route to user auth
router.route('/authenticate')
  .post((req, res) => {
    // let authenticateUser = function(){
    console.log('hit /users/authenticate');
    // console.log('req.body.user: ' + req.body);
    // console.log('req.body.username: ' + req.body.username )
  User.findOne({
    username: req.body.username
  }, function(err, user) {
      console.log(req.body);
      console.log('user: ' + user);
      if (err) throw err;
      // if unable to find the username in the app's database
      if (user == undefined) {

        res.json({ success: false, message: 'Authentication failed. User not found.'});
      // if is a user in database
      } else {

        user.authenticate(req.body.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            // send back a success message, a token, and all of the user data for user matching that username and password.
            return res.send({message: "Password is good friend! Have a token buddy.", token: jwt.sign(user, secret), user: user});
            //userToken = token;
          } else {

            return res.send({message: "Password ain't right friend. No token(soup) for you!."});
          }
        }) //ends .authenticate
      } //ends .findOne
    });//ends authenticateUser
});//ends .post

router.route('/signup')
  .post((req, res) => {
    let newUser = new User(req.body);
    console.log(req.body);
    newUser.save();
  })

router.route('/:id')
  .get((req, res, next) => {
    console.log(req.headers.host);
    User.find({ _id: req.params.id }, (err, user) => {
      if (err) return next(err);
      res.send(user);
    }); //ends .find
  })

// === route middleware to verify a token
router.use(function(req, res, next) {
  console.log("user token: " + userToken);
  // var token = req.query.token
  var token = req.body.token || req.query.token || req.headers['Authorization'];
  //console.log('req.query.token: ' + req.query.token);
  console.log(token);
  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log('err' + err);
        return res.json({ success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        console.log('This is the secret, post decode: '+ secret);
        //let's see what I'm setting to x-access-token in .all below--jwt is giving object Object, which means in line 10 it's not being set to the token... figure out how to access token within that...
        console.log('jwt test: ' + jwt.sign);
        next();
      }
    }); // ends jwt.verify
    // if there is no token, return error.
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }); //ends router.use

module.exports = router;
