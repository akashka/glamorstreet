'use strict';

/**
 * Module dependencies
 */
var cmsPolicy = require('../policies/cms.server.policy'),
  cms = require('../controllers/cms.server.controller');

module.exports = function (app) {

  //get property types
  app.route('/api/getPropertytype')
    .get(cms.getPropertytype);

  //get collections
  app.route('/api/selectedCollections')
    .get(cms.getSelectedCollections);
  app.route('/api/selectedCollection/:collectionId')
    .put(cms.updateSelectedCollection);
  app.route('/api/selectedCollection')
    .post(cms.setSelectedCollection);

  //get deals
  app.route('/api/deals')
    .get(cms.getMyDeals)
  app.route('/api/deals')
    .post(cms.setMyDeals)
  app.route('/api/deals/:dealId')
    .put(cms.updateMyDeal);

  //get locations
  app.route('/api/selectedLocations')
    .get(cms.getSelectedLocations);
  app.route('/api/selectedLocation/:locationId')
    .put(cms.updateSelectedLocation);
  app.route('/api/selectedLocation')
    .post(cms.setSelectedLocation);

  //blogs
  app.route('/api/selectedBlogs')
    .get(cms.getSelectedBlogs);
  app.route('/api/selectedBlog/:blogId')
    .put(cms.updateSelectedBlogs);
  app.route('/api/selectedBlog')
    .post(cms.setSelectedBlog);

  //getpromos
  app.route('/api/Promos')
    .get(cms.getPromos);
  app.route('/api/Promos/:promoId')
    .put(cms.updatePromos);
  app.route('/api/Promos')
    .post(cms.setPromos);

  //get Static pages
  app.route('/api/StaticPages')
    .get(cms.getStaticPages);
  app.route('/api/StaticPages/:Screen')
    .post(cms.setStaticPages);
  app.route('/api/StaticPages/:Screen')
    .put(cms.updateStaticPages);

  //updating user details
  app.route('/api/users/')
    .get(cms.getUserDetails);
  app.route('/api/users/:user_id')
    .put(cms.updateUserDetails);

  //currency
  app.route('/api/currency')
    .get(cms.getCurrency);
  app.route('/api/currency')
    .post(cms.setCurrency);
  app.route('/api/currency/:currencyId')
    .put(cms.updateCurrency);

  //Metatag
  app.route('/api/metatag')
    .get(cms.getMetatag);
  app.route('/api/metatag')
    .post(cms.setMetatag);
  app.route('/api/metatag/:metatagId')
    .put(cms.updateMetatag);

  //Destination
  app.route('/api/destinations')
    .get(cms.getDestination);
  app.route('/api/destinations')
    .post(cms.setDestination);
  app.route('/api/destinations/:destinationId')
    .put(cms.updateDestination);

  //headings
  app.route('/api/headings')
    .get(cms.getHeadings);
  app.route('/api/heading/:headingName')
    .get(cms.getHeading);
  app.route('/api/heading/:headingId')
    .put(cms.updateHeading);
  app.route('/api/heading')
    .post(cms.setHeading);

  //get CSS
  app.route('/api/css')
    .get(cms.getCss)
    .post(cms.updateCss);

  //get Packags
  app.route('/api/selectedPackags')
    .get(cms.getSelectedPackags);
  app.route('/api/selectedPackag/:packagId')
    .put(cms.updateSelectedPackag);
  app.route('/api/selectedPackag')
    .post(cms.setSelectedPackag);

//OrderDetails
  app.route('/api/orderDetails')
    .get(cms.getOrderDetail);
  app.route('/api/orderDetails')
    .post(cms.setOrderDetail);
  app.route('/api/orderDetails/:_id')
    .put(cms.updateOrderDetail);

//Maintenance
  app.route('/api/maintenance')
    .get(cms.getMaintenance);
  app.route('/api/maintenance/:_id')
    .put(cms.updateMaintenance);

//SearchLogger
  app.route('/api/searchLogger')
    .post(cms.setSearchLogger);

//Newsletter
  app.route('/api/newsletter')
    .get(cms.getNewsletter);
  app.route('/api/newsletter')
    .put(cms.setNewsletter);

//Favourite Hotels
  app.route('/api/favouriteHotels/:user_id')
    .get(cms.getFavouriteHotels);
  app.route('/api/favouriteHotels')
    .post(cms.setFavouriteHotels);
  app.route('/api/favouriteHotels/:user_id')
    .put(cms.updateFavouriteHotels);
};
