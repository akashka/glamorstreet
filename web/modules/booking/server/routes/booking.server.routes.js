'use strict';

/**
 * Module dependencies
 */
var bookingPolicy = require('../policies/booking.server.policy'),
  booking = require('../controllers/booking.server.controller');

module.exports = function (app) {

  app.route('/api/book')
    .post(booking.submit);

  app.route('/api/validatePromo')
    .post(booking.validatePromo);

  app.route('/api/manageBook')
    .get(booking.getmanageBook);

  app.route('/api/getBookingDetails')
    .get(booking.getBookingDetails);

  app.route('/api/checkCaptcha')
    .post(booking.captcha);

  app.route('/api/getPromos')
    .get(booking.getPromos);

  app.route('/api/getSingleBookingDetails')
  .get(booking.getSingleBookingDetails);

  app.route('/api/getIpDetails')
    .get(booking.getIpDetails);

};
