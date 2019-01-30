'use strict';

/**
 * Module dependencies
 */
var hotelsPolicy = require('../policies/hotels.server.policy'),
  hotels = require('../controllers/hotels.server.controller');

module.exports = function (app) {

  app.route('/api/getHotels')
    .get(hotels.getHotels);

  app.route('/api/getSingleHotel')
    .get(hotels.getSingleHotel);

  app.route('/api/getLhotels')
    .get(hotels.getLHotels);

  // app.route('/api/blogCat')
  //   .get(hotels.getblogCat);

  app.route('/api/hotels')
    .post(hotels.create);

  app.route('/api/hotels/:hotelId')
    .put(hotels.update);

  app.param('hotelId', hotels.hotelByID);

 app.route('/api/reviews')
    .get(hotels.getReviews);

 app.route('/api/getCurrencyRate')
    .get(hotels.getCurrencyRate);

};
