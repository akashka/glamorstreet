'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  request = require('request'),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'axisrooms',
    api_key: 'admin1!'
  }
};

var transporter = nodemailer.createTransport(sgTransport(options));

var config = projectConfig();

var options = {
  auth: {
    api_user: 'axisrooms',
    api_key: 'admin1!'
  }
};

var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};

exports.contactForm = function(req, res) {

  var data = req.body;
  var output = '';

  var emailToClient = {
    to: [data.email],
    from: [configuration.email],
    subject: 'Thanks for contacting with' + configuration.project + '.',
    text: '',
    html: '<h2>Hi ' + data.firstName + ',</h2> Thanks for contacting us, we will contact you soon.'
  };

  transporter.sendMail(emailToClient, function(err, res) {
    if (err) {
      output = err;
    }
    output = res;
  });

  var emailToStatdilly = {
    to: [configuration.email],
    from: data.email,
    subject: 'Enquiry from ' + data.firstName,
    text: '',
    html: '<h2>'+ 'Hi'+ configuration.project +',' + '</h2>' + 'Name : ' + data.firstName + ' ' + data.lastName + '<br/>' + 'Contact Number : ' + data.phoneNumber + '<br/>' + 'Email : ' + data.email + '<br/>' + 'Message : ' + data.message
  };

  transporter.sendMail(emailToStatdilly, function(err, res) {
    if (err) {
      output = err;
    }
    output = res;
  });

  res.json({ "success": true });
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
