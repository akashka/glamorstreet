'use strict';

/**
 * Module dependencies
 */
var contactPolicy = require('../policies/contact.server.policy'),
  contact = require('../controllers/contact.server.controller');

module.exports = function (app) {

  app.route('/api/contact-form')
    .post(contact.contactForm);
  app.route('/api/checkCaptcha')
    .post(contact.captcha);

};
