'use strict';

/**
 * Module dependencies
 */
var collectionsPolicy = require('../policies/collections.server.policy'),
  collections = require('../controllers/collections.server.controller');

module.exports = function (app) {

  app.route('/api/getPropertytype')
    .get(collections.getPropertytype);

};
