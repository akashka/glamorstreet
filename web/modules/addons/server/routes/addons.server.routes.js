'use strict';

/**
 * Module dependencies
 */
var addons = require('../controllers/addons.server.controller');

module.exports = function (app) {

   app.route('/api/getHotelPolicies')
    .get(addons.getHotelPolicies);

};
