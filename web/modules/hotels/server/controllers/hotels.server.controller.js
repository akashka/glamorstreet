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


exports.create = function(req, res) {
  var hotel = new Hotel(req.body);

  hotel.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(hotel);
  })
};

exports.update = function(req, res) {
  var hotel = req.hotel;
  hotel = _.extend(hotel, req.body);
  hotel.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(hotel);
  });
};

exports.hotelByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Hotel is invalid' })
  }
  var query = Hotel.findById(id);
  query.exec(function(err, hotel) {
    if (err) return next(err);
    else if (!hotel) return res.status(404).send(err);
    req.hotel = hotel;
    next();
  });
};

exports.getHotels = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    location: params.location ? '&cityId=' + params.location : '',
    stateId: params.stateId ? '&stateId=' + params.stateId : '',
    country: params.country ? '&countryId=' + params.country : '',
    checkin: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkout: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(2, 'd').format('DD/MM/YYYY'),
    paxInfo: params.adults && params.rooms ? formPaxInfo(Number(params.adults), Number(params.rooms)) : '',
    propertyType: params.propertyType ? '&propertyTypeId=' + params.propertyType : '',
    dealId: params.deal ? '&dealId=' + params.deal : '',
    promoId: params.promo ? '&promoId=' + params.promo : ''
  };

  // Configure the request
  var options = {
    url: config.url + config.searchApi + config.beId +
    param.location + param.stateId + param.country + param.checkin + param.checkout + param.paxInfo +
    param.propertyType + param.dealId + param.promoId,
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

exports.getLHotels = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    location: params.location ? '&cityId=' + params.location : '',
    stateId: params.stateId ? '&stateId=' + params.stateId : '',
    country: params.country ? '&countryId=' + params.country : ''
  };

  // Configure the request
  var options = {
    url: config.url + config.searchApi + config.beId +
    param.location + param.stateId + param.country,
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


exports.getSingleHotel = function(req, res) {
  var params = JSON.parse(req.headers.params);
  var param = {
    searchId: '&searchId=' + params.searchId,
    productId: '&productId=' + params.productId,
    checkIn: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkOut: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(2, 'd').format('DD/MM/YYYY')
  };

  // Configure the request
  var options = {
    url: config.url + config.roomApi + config.beId + param.searchId + param.productId + param.checkIn + param.checkOut,
    method: 'GET',
    headers: headers
  };
  console.log(options.url);
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

exports.getReviews = function(req, res){
  var options = {
    url: config.reviewsApi + req.headers.params,
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

exports.getCurrencyRate = function(req, res){
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var options = {
    url: "http://api.fixer.io/latest?base=" + params.oldCurrency + "&symbols=" + params.newCurrency,
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
