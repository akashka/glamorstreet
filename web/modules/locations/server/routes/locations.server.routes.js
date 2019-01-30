'use strict';

/**
 * Module dependencies
 */
var locationsPolicy = require('../policies/locations.server.policy'),
  locations = require('../controllers/locations.server.controller');

module.exports = function (app) {

  app.route('/api/getLocations')
    .get(locations.getLocations);
};
