'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hotel = mongoose.model('Hotels'),
  request = require('request'),
  _ = require('lodash'),
  moment = require('moment'),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var config = projectConfig();
var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};

function formPaxInfo(adults, rooms) {
  var paxInfo = '&paxInfo=';

  if (adults >= rooms) {

    if (adults == rooms) {
      for (var i = 0; i < rooms; i++) {
        if (i == rooms - 1) {
          paxInfo += '1|0';
        } else {
          paxInfo += '1|0||';
        }
      }
    } else {
      var adultRemainder = adults % rooms;
      var adultsIndividual = (adults - adultRemainder) / rooms;

      for (var i = 0; i < rooms; i++) {
        if (i == rooms - 1) {
          paxInfo += (adultsIndividual + adultRemainder) + '|0';
        } else {
          paxInfo += adultsIndividual + '|0||';
        }
      }
    }

  }

  return paxInfo;
}

exports.getHotelPolicies = function(req, res){
  var params = JSON.parse(req.headers.params);
  var param = {
    searchId: '&searchId=' + params.searchId,
    hotelId: '&hotelId=' + params.productId
  };
  // Configure the request
  var options = {
    url: config.url + config.policyApi + config.beId + param.hotelId + param.searchId,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  });
};
