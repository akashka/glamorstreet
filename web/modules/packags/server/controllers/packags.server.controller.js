'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Packag = mongoose.model('Packags'),
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
    if (adults == rooms) {
      for (var i = 0; i < rooms; i++) {
          paxInfo += (i == rooms-1) ? '1|0' : '1|0||';
      }
    } else if (adults >= rooms) {
      var adultRemainder = adults % rooms;
      var adultsIndividual = (adults - adultRemainder) / rooms;
      for (var i = 0; i < rooms; i++) {
        paxInfo += (i == rooms-1) ? (adultsIndividual + adultRemainder + '|0') : (adultsIndividual + '|0||');
      }
    }
    return paxInfo;
}

exports.create = function(req, res) {
  var packag = new Packag(req.body);
  packag.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(packag);
  })
};

exports.update = function(req, res) {
  var packag = req.packag;
  packag = _.extend(packag, req.body);
  packag.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(packag);
  });
};

exports.packagByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Packag is invalid' })
  }
  var query = Packag.findById(id);
  query.exec(function(err, hotel) {
    if (err) return next(err);
    else if (!packag) return res.status(404).send(err);
    req.packag = packag;
    next();
  });
};

exports.getPackags = function(req, res) {
  var params = JSON.parse(req.headers.params);
  var param = {
    packagId: '&packageId=' + params.packageId,
    checkIn: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkOut: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(50, 'd').format('DD/MM/YYYY'),
    paxInfo: params.adults && params.rooms ? formPaxInfo(Number(params.adults), Number(params.rooms)) : ''
  };
  // Configure the request
  var options = {
    url: config.url + config.packagSearchApi + config.beId + param.checkIn + param.checkOut + param.packagId + param.paxInfo,
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
