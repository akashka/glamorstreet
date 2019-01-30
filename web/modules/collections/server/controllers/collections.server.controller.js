'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  request = require('request'),
  Deal = mongoose.model('Deals'),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var config = projectConfig();

var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};

//propertytype
exports.getPropertytype = function(req, res) {

  // Configure the request
  var options = {
    url: config.url + config.propertytypeApi,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};
