'use strict'
const GOOGLE_KEY = process.env.GOOGLEAPI
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let request = require('request');

router.route('/zip')
  .get((req, res) => {
    let zip = req.params.zip
    console.log('The zip code is '+zip);
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+zip+'&key='+GOOGLE_KEY

    googleCall(url, (body) => {
      res.json(JSON.parse(body));
    });
  });

function googleCall(url, callback) {
  request(url, (err, res, body) => {
    if(!err && res.statusCode === 200) {
      callback(body);
    }
  });
}




module.exports = router;
