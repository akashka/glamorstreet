'use strict';

module.exports = function (app) {
  // Root routing
  var path = require('path');
  var coreMetaTags = require('../controllers/core-metatags.server.controller');
  var core = require('../controllers/core.server.controller'),
    hotels = require(path.resolve('./modules/hotels/server/controllers/hotels.server.controller'));

  //all static pages
  app.route('/about-us').get(coreMetaTags.aboutUs, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/faq').get(coreMetaTags.FAQ, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/contact-us').get(coreMetaTags.contactUs, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/careers').get(coreMetaTags.careers, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/press-release').get(coreMetaTags.pressRelease, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/press-kit').get(coreMetaTags.pressKit, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/partners-portal').get(coreMetaTags.partnersPortal, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/become-a-partner').get(coreMetaTags.becomeAPartner, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/how-we-work').get(coreMetaTags.howWeWork, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/privacy-policy').get(coreMetaTags.privacyPolicy, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/terms-and-conditions').get(coreMetaTags.termsAndConditions, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/hotels-resorts').get(coreMetaTags.hotelsResorts, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/techsauce').get(coreMetaTags.techSauce, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/breakbulk').get(coreMetaTags.breakbulk, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/destinations').get(coreMetaTags.destinations, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/booking').get(coreMetaTags.bookingPage, coreMetaTags.socialCrawler, core.renderIndex);



  //all dynamic pages
  app.route('/viewpackages').get(coreMetaTags.packageDetailPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/packages').get(coreMetaTags.packagesListPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/destinations/:destinationId').get(coreMetaTags.viewDestinationPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/hotel/:selectedHotelId').get(coreMetaTags.hotelDetailPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/hotels').get(coreMetaTags.hotelsDetailsPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/Hotels/:countryName/:stateName/:cityName').get(coreMetaTags.listHotelsDetailsPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/Hotels/:countryName/:stateName').get(coreMetaTags.listHotelsDetailsPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/Hotels/:countryName').get(coreMetaTags.listHotelsDetailsPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/deals').get(coreMetaTags.hotelsDetailsPage, coreMetaTags.socialCrawler, core.renderIndex);
  app.route('/').get(coreMetaTags.homePage, coreMetaTags.socialCrawler, core.renderIndex);

};
