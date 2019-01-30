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

var _ = require('lodash');
var config = projectConfig();

var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};

exports.getMyDeals = function(req, res) {
  Deal.find({}).exec(function(err, deals) {
    if (err) return res.status(400).send(err);
    else res.jsonp(deals);
  });
};

exports.setMyDeals = function(req, res) {
  var deal = new Deal(req.body);

  deal.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(deal);
  })
};

exports.updateMyDeal = function(req, res) {
  var deal = req.deal;
  deal = _.extend(deal, req.body);
  deal.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(deal);
  })
};

exports.dealByID = function(req, res, next, id) {
  var query = Deal.findOne({ position: id });
  query.exec(function(err, deal) {
    if (err) return next(err);
    else if (!deal) return res.status(404).send(err);
    req.deal = deal;
    next();
  });
};

exports.getDeals = function(req, res) {
  // Configure the request
  var options = {
    url: config.url + config.dealApi,
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
