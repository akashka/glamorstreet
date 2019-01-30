'use strict';

var validator = require('validator'),
  path = require('path'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  request = require('request'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  Hotel = mongoose.model('Hotels'),
  Metatag = mongoose.model('Metatag'),
  Destination = mongoose.model('Destination');

var configuration = projectConfig();

var headers = {
  apiKey: configuration.apiKey,
  channelId: configuration.channelId
};


/**
 * Render the main application page
 */

exports.socialCrawler = function(req,res,next) {
  var ua = req.headers['user-agent'];
  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    res.render('modules/core/server/views/social-index', {
      sharedConfig: JSON.stringify(config.shared),
      project: configuration.project,
      metaTags: req.metaTags
    });
  } else {
    next();
  }
};

//getting meta Tag Details from the database
var getMetaTagDetails = function(req,res,next,page){
    return Metatag.findOne({ "be_id": configuration.bookingEngineId, "screen": page }).exec(function(err, metatag) {
      if (!err && metatag != undefined){
        var metaTags = {
          img       : metatag.imageUrl,
          url       : metatag.url,
          title     : metatag.title,
          descriptionText : metatag.description,
          keywords : metatag.keywords
        };
        //return metaTags;
        req.metaTags = metaTags;
        next();
      }
    });
};

//getting destination from the database
var getDetinationDetails = function(req,res,next,destinationId){
  return Destination.findOne({ "be_id": configuration.bookingEngineId, '_id': destinationId }).exec(function(err, destination) {
    if (!err && destination != undefined){
      var metaTags = {
        img       : destination.images[0],
        url       : req.headers.host + req.url,
        title     : destination.address,
        descriptionText : destination.description,
        keywords : destination.description
      };
      //return metaTags;
      req.metaTags = metaTags;
      next();
    }
  });
};



//Static pages
exports.homePage = function(req,res,next) {
  getMetaTagDetails(req,res,next,"homepage");
};
exports.aboutUs = function(req,res,next) {
  getMetaTagDetails(req,res,next,"aboutUs");
};
exports.FAQ = function(req,res,next) {
  getMetaTagDetails(req,res,next,"faq");
};
exports.contactUs = function(req,res,next) {
  getMetaTagDetails(req,res,next,"contact");
};
exports.careers = function(req,res,next) {
  getMetaTagDetails(req,res,next,"careers");
};
exports.pressRelease = function(req,res,next) {
  getMetaTagDetails(req,res,next,"pressRelease");
};
exports.pressKit = function(req,res,next) {
  getMetaTagDetails(req,res,next,"pressKit");
};
exports.partnersPortal = function(req,res,next) {
  getMetaTagDetails(req,res,next,"partnerPortal");
};
exports.privacyPolicy = function(req,res,next) {
  getMetaTagDetails(req,res,next,"privacyPolicy");
};
exports.becomeAPartner = function(req,res,next) {
  getMetaTagDetails(req,res,next,"becomePartner");
};
exports.howWeWork = function(req,res,next) {
  getMetaTagDetails(req,res,next,"howWeWork");
};
exports.termsAndConditions = function(req,res,next) {
  getMetaTagDetails(req,res,next,"termsConditions");
};
exports.hotelsResorts = function(req,res,next) {
  getMetaTagDetails(req,res,next,"hotelsResorts");
};
exports.destinations = function(req,res,next) {
  getMetaTagDetails(req,res,next,"destinations");
};
exports.bookingPage = function(req,res,next) {
  getMetaTagDetails(req,res,next,"booking");
};
exports.techSauce = function(req,res,next) {
  getMetaTagDetails(req,res,next,"techSauce");
};
exports.breakbulk = function(req,res,next) {
  getMetaTagDetails(req,res,next,"breakbulk");
};

//Dynamic pages

exports.hotelsDetailsPage = function(req,res,next) {
  var params = req.query;
  var param = {
    location: params.location ? '&cityId=' + params.location : '',
    stateId: params.stateId ? '&stateId=' + params.stateId : '',
    country: params.country ? '&countryId=' + params.country : '',
    checkin: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkout: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(2, 'd').format('DD/MM/YYYY'),
    propertyType: params.propertyType ? '&propertyTypeId=' + params.propertyType : '',
    dealId: params.deal ? '&dealId=' + params.deal : '',
    promoId: params.promo ? '&promoId=' + params.promo : ''
  };


  // Configure the request
  var options = {
    url: configuration.url + configuration.searchApi + configuration.beId +
    param.location + param.stateId + param.country + param.checkin + param.checkout +
    param.propertyType + param.dealId + param.promoId,
    method: 'GET',
    headers: headers
  };


  if(params.location){
    // Start the request
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var hotelList = JSON.parse(body);
        var selectedHotel = hotelList.Hotel_Details[0];

        var metaTags = {
          img       :  selectedHotel.images[0],
          url       : req.headers.host + '/' + req.url,
          title     : selectedHotel.address.city + ", " + selectedHotel.address.country + " Hotel Deals - "+configuration.projectSite,
          descriptionText : 'Hotels in ' + selectedHotel.address.city + ", " + selectedHotel.address.state + ", " + selectedHotel.address.country + ". Luxury hotels & resorts booking at the lowest prices. Great deals, up to 60% less, on a wide selection of popular hotels across South East Asia. 5-star hotels at 3-star prices!" ,
          imageUrl  : selectedHotel.images[0],
          keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
        };
        req.metaTags = metaTags;
      }
      next();
    });
  }else if(params.stateId){
    // Start the request
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var hotelList = JSON.parse(body);
        var selectedHotel = hotelList.Hotel_Details[0];

        var metaTags = {
          img: selectedHotel.images[0],
          url: req.headers.host + '/' + req.url,
          title: selectedHotel.address.state  + ", " + selectedHotel.address.country + " Hotel Deals - "+configuration.projectSite,
          descriptionText: 'Hotels in ' + selectedHotel.address.city + ", " + selectedHotel.address.state + ", " + selectedHotel.address.country + ". Luxury hotels & resorts booking at the lowest prices. Great deals, up to 60% less, on a wide selection of popular hotels across South East Asia. 5-star hotels at 3-star prices!" ,
          imageUrl: selectedHotel.images[0],
          keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
        };
        req.metaTags = metaTags;
        next();
      }
    });
  }else if(params.country){
    // Start the request
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var hotelList = JSON.parse(body);
        var selectedHotel = hotelList.Hotel_Details[0];

        var metaTags = {
          img: selectedHotel.images[0],
          url: req.headers.host + '/' + req.url,
          title: selectedHotel.address.country + " Hotel Deals - "+configuration.projectSite,
          descriptionText: 'Hotels in ' + selectedHotel.address.country + ". Luxury hotels & resorts booking at the lowest prices. Great deals, up to 60% less, on a wide selection of popular hotels across South East Asia. 5-star hotels at 3-star prices!" ,
          imageUrl: selectedHotel.images[0],
          keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
        };
        req.metaTags = metaTags;
        next();
      }
    });
  }else {
    // Start the request
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var hotelList = JSON.parse(body);
        var selectedHotel = hotelList.Hotel_Details[0];

        var metaTags = {
          img: selectedHotel.images[0],
          url: req.headers.host + '/' + req.url,
          title: 'Hotel Booking and Deals at Unbeatable Prices  - ' + configuration.projectSite,
          descriptionText: 'Luxury hotels & resorts booking at the lowest prices. Great deals, up to 60% less, on a wide selection of popular hotels across South East Asia. 5-star hotels at 3-star prices',
          imageUrl: selectedHotel.images[0],
          keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
        };
        req.metaTags = metaTags;
        next();
      }
    });
  }
};


exports.listHotelsDetailsPage = function(req,res,next) {
  var selectedParams = req.params;
  var cityId,stateId,countryId;

  // Configure the request
  var options = {
    url: configuration.url + configuration.locationApi,
    method: 'GET',
    headers: headers
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var locations = JSON.parse(body);
      locations = locations.locations;
      if (selectedParams.cityName) {
        selectedParams.cityName = (selectedParams.cityName).replace(/\-/g, ' ');
        var city = _.find(locations, { 'city': selectedParams.cityName });
        cityId = city.city_id;
      } else if (selectedParams.stateName) {
        selectedParams.stateName = (selectedParams.stateName).replace(/\-/g, ' ');
        var state = _.find(locations, { 'state': selectedParams.stateName });
        stateId = state.state_id;
      } else if (selectedParams.countryName) {
        selectedParams.countryName = (selectedParams.countryName).replace(/\-/g, ' ');
        var country = _.find(locations, { 'country': selectedParams.countryName });
        countryId = country.country_id;
      }
    }
    var param = {
      cityId: cityId ? '&cityId=' + cityId : '',
      stateId: stateId ? '&stateId=' + stateId : '',
      countryId: countryId ? '&countryId=' + countryId : ''
    };

    // Configure the request
    var hotelsOptions = {
      url: configuration.url + configuration.searchApi + configuration.beId +
      param.cityId + param.stateId + param.countryId,
      method: 'GET',
      headers: headers
    };
    if(selectedParams.cityName){
      // Start the request
      request(hotelsOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var hotelList = JSON.parse(body);
          var selectedHotel = hotelList.Hotel_Details[0];

          var metaTags = {
            img       :  selectedHotel.images[0],
            url       : req.headers.host + '/' + req.url,
            title     : selectedHotel.address.city,
            descriptionText : 'Hotels in ' + selectedHotel.address.city ,
            imageUrl  : selectedHotel.images[0],
            keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
          };
          req.metaTags = metaTags;
        }
        next();
      });
    }else if(selectedParams.stateName){
      // Start the request
      request(hotelsOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var hotelList = JSON.parse(body);
          var selectedHotel = hotelList.Hotel_Details[0];

          var metaTags = {
            img: selectedHotel.images[0],
            url: req.headers.host + '/' + req.url,
            title: selectedHotel.address.state,
            descriptionText: 'Hotels in ' + selectedHotel.address.state,
            imageUrl: selectedHotel.images[0],
            keywords: configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
          };
          req.metaTags = metaTags;
          next();
        }
      });
    }else if(selectedParams.countryName){
      // Start the request
      request(hotelsOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var hotelList = JSON.parse(body);
          var selectedHotel = hotelList.Hotel_Details[0];

          var metaTags = {
            img: selectedHotel.images[0],
            url: req.headers.host + '/' + req.url,
            title: selectedHotel.address.country,
            descriptionText: 'Hotels in ' + selectedHotel.address.country,
            imageUrl: selectedHotel.images[0],
            keywords: configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
          };
          req.metaTags = metaTags;
          next();
        }
      });
    }
  });
};

exports.hotelDetailPage = function(req,res,next) {

  var params = req.query;
  var hotelId = req.params.selectedHotelId;
  var selectedHotel = {};

  var param = {
    searchId: '&searchId=' + params.searchId,
    productId: '&productId=' + params.productId,
    checkIn: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkOut: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(2, 'd').format('DD/MM/YYYY')
  };


  // Configure the request
  var options = {
    url: configuration.url + configuration.roomApi + configuration.beId + param.searchId + param.productId + param.checkIn + param.checkOut,
    method: 'GET',
    headers: headers
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var hotelList = JSON.parse(body);
      selectedHotel = hotelList.Hotel_Details[0];
      var metaTags = {
        img       : selectedHotel.images[0],
        url       : req.headers.host + '/' + req.url,
        title     : selectedHotel.hotel_name + " Hotel in " + selectedHotel.address.state + ", " + selectedHotel.address.country + " - "+configuration.projectSite,
        descriptionText : selectedHotel.description,
        imageUrl  : selectedHotel.images[0],
        keywords : configuration.projectNameCapitalize + ", hotel, hotels, booking, discount, reservations, deals, cheap, travel, Asia, South East Asia, Kuala Lumpur, Bangkok, Phuket, Thailand, Malaysia, Bali, Melaka, Penang, Chiangmai, Chiangmai, Pattaya, acommodation, accomodation, accommodation"
      };
      req.metaTags = metaTags;
      next();
    }
  });


};


exports.viewDestinationPage = function(req,res,next) {
  var destinationId = req.params.destinationId;
  getDetinationDetails(req,res,next,destinationId);
};

exports.packagesListPage = function(req,res,next) {
  var params = req.query;
  var packagesList = {};

  var param = {
    packagId: '&packageId=' + params.package_id,
    checkIn: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkOut: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(50, 'd').format('DD/MM/YYYY')
  };


  // Configure the request
  var options = {
    url: configuration.url + configuration.packagSearchApi + configuration.beId + param.checkIn + param.checkOut + param.paxInfo,
    method: 'GET',
    headers: headers
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var responseList = JSON.parse(body);
      packagesList = responseList.Packages[0];
      var metaTags = {
        url       : req.headers.host + req.url,
        title     : "Packages for " + configuration.project,
        descriptionText : "Enjoy the best package from " + configuration.project,
        keywords : ""
      };
      if(packagesList.images != undefined && packagesList.images.length > 0) {metaTags.img = packagesList.images[0];
        metaTags.imageUrl = packagesList.images[0]};

      req.metaTags = metaTags;
      next();
    }
  });
};

exports.packageDetailPage = function(req,res,next) {
  var params = req.query;
  var packageId = req.query.package_id;
  var packagesList = {};
  var param = {
    packagId: '&packageId=' + params.package_id,
    checkIn: params.checkin ? '&checkIn=' + moment(new Date(params.checkin)).format('DD/MM/YYYY') : '&checkIn=' + moment().add(1, 'd').format('DD/MM/YYYY'),
    checkOut: params.checkout ? '&checkOut=' + moment(new Date(params.checkout)).format('DD/MM/YYYY') : '&checkOut=' + moment().add(50, 'd').format('DD/MM/YYYY')
    //paxInfo: params.adults && params.rooms ? formPaxInfo(Number(params.adults), Number(params.rooms)) : ''
  };



  // Configure the request
  var options = {
    url: configuration.url + configuration.packagSearchApi + configuration.beId + param.checkIn + param.checkOut,
    method: 'GET',
    headers: headers
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var responseList = JSON.parse(body);
      packagesList = responseList.Packages;
      var packageDetail = _.find(packagesList, { 'package_id': Number(packageId) });
      var metaTags = {
        img       :  packageDetail.images[0],
        url       : req.headers.host + req.url,
        title     : packageDetail.package_name,
        descriptionText : packageDetail.description,
        imageUrl  : packageDetail.images[0],
        keywords : ""
      };
      req.metaTags = metaTags;
      next();
    }
  });


};
