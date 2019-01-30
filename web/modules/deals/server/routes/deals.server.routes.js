'use strict';

/**
 * Module dependencies
 */
var dealsPolicy = require('../policies/deals.server.policy'),
  deals = require('../controllers/deals.server.controller');

module.exports = function (app) {

  app.route('/api/getDeals')
    .get(deals.getDeals);

  app.route('/api/deals')
    .get(deals.getMyDeals);

  app.route('/api/deals')
    .post(deals.setMyDeals);

  app.route('/api/deals/:dealId')
    .put(deals.updateMyDeal);

  app.param('dealId', deals.dealByID);

};
