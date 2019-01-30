'use strict';

/**
 * Module dependencies
 */
var packagsPolicy = require('../policies/packags.server.policy'),
  packags = require('../controllers/packags.server.controller');

module.exports = function (app) {

  app.route('/api/getPackags')
    .get(packags.getPackags);

  app.route('/api/packags')
    .post(packags.create);

  app.route('/api/packags/:packagId')
    .put(packags.update);

  app.param('packagId', packags.packagByID);

};
