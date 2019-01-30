'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  request = require('request'),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var config = projectConfig();

var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};

exports.validatePromo = function(req, res) {
  var headers = {
    apiKey: config.apiKey,
    channelId: config.channelId
  };
  // setting the booking engine id
  req.body.bookingEngineId = config.bookingEngineId;

  // Configure the request
  var options = {
    url: config.url + config.validpromoApi,
    method: 'POST',
    headers: headers,
    body: JSON.stringify(req.body)
  };

  request(options, function(error, response, body) {
    if (!error) {
      res.json(JSON.parse(body));
    }
  })
};

exports.submit = function(req, res) {
  var headers = {
    apiKey: config.apiKey,
    channelId: config.channelId
  };

  // setting the booking engine id
  req.body.bookingEngineId = config.bookingEngineId;
  var params = {
    bookingEngineId : config.bookingEngineId
  };
  var keys = Object.keys(req.body), len = keys.length, i = 0, prop, value;
  while (i < len) {
      prop = keys[i];
      value = req.body[prop];
      i += 1;
      params[prop] = value;
  };

  // Configure the request
  var options = {
    url: config.url + config.bookingApi,
    method: 'POST',
    headers: headers,
    body: JSON.stringify(params)
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

//manage Book
exports.getmanageBook = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    userId: (params.userId ? '?userId=' + params.userId : '')
  };
  // Configure the request
  var options = {
    url: config.url + config.buyerBookingHistoryApi + param.userId,
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

//get booking details

exports.getBookingDetails = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    userId: (params.bookingRefId ? '?bookingId=' + params.bookingRefId : '')
  }
  // Configure the request
  var options = {
    url: config.url + config.getBookingDetailsApi + param.userId,
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

// google recaptcha
exports.captcha = function(req, res) {
  // Configure the request
  var options = {
    url: "https://www.google.com/recaptcha/api/siteverify",
    method: 'POST',
    headers: {
      secret: config.captchaSecretKey,
      response: req.body.captchaResponse
    }
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

// promos
exports.getPromos = function(req, res) {
  // Configure the request
  var options = {
    url: config.url + config.promoApi,
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

// Get single booking details
exports.getSingleBookingDetails = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    bookingId: (params.orderId ? '?bookingId=' + params.orderId : '')
  }

  // Configure the request
  var options = {
    url: config.url + config.getBookingDetailsApi + param.bookingId,
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

// Get IP address details
exports.getIpDetails = function(req, res) {
  // Configure the request
  var options = {
    url: "http://gd.geobytes.com/GetCityDetails?callback",
    method: 'GET'
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};


