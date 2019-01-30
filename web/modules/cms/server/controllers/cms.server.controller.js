'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Collection = mongoose.model('Collection'),
  Heading = mongoose.model('Heading'),
  Deal = mongoose.model('Deal'),
  Location = mongoose.model('Location'),
  Packag = mongoose.model('Packag'),
  Blog = mongoose.model('Blog'),
  StaticPages = mongoose.model('StaticPages'),
  User = mongoose.model('User'),
  Currency = mongoose.model('Currency'),
  Promo = mongoose.model('Promo'),
  Metatag = mongoose.model('Metatag'),
  Destination = mongoose.model('Destination'),
  OrderDetail = mongoose.model('OrderDetail'),
  Maintenance = mongoose.model('Maintenance'),
  SearchLogger = mongoose.model('SearchLogger'),
  Newsletter = mongoose.model('Newsletter'),
  FavouriteHotels = mongoose.model('FavouriteHotels'),
  request = require('request'),
  projectConfig = require(path.resolve('./modules/core/server/config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var _ = require('lodash');

var config = projectConfig();

var headers = {
  apiKey: config.apiKey,
  channelId: config.channelId
};


// Blogs
exports.getSelectedBlogs = function(req, res) {
  var allBlogs = [];
  var selectedBlogs = [];
  var options = {
    url: "http://axisrooms.website/staydillyblog/?json=get_posts",
    method: 'GET'
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {

      Blog.find({ "be_id": config.bookingEngineId }).exec(function(err, blogs) {
        if (err) return res.status(400).send(err);
        else{
          allBlogs = JSON.parse(body);
          _(blogs).forEach(function (blog) {
            selectedBlogs[blog.position] = _.find(allBlogs.posts, function(post){
              post._id = blog._id;
              post.blog_id = blog.blog_id;
              post.position = blog.position;
              return post.id == blog.blog_id
            });

          });
          res.send(_.compact(selectedBlogs));
        }
      });
    }
  });
};

exports.setSelectedBlog = function(req, res) {
  var blog = new Blog(req.body);
  blog.be_id = config.bookingEngineId;
  blog.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(blog);
  })
};

exports.updateSelectedBlogs = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Blog.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.blogId}, {$set: req.body}, {new: true}, function(err, updatedBlog) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedBlog);
  });
};


// Collections
exports.getSelectedCollections = function(req, res) {
  var propertyTypes = [];
  var selectedCollections = [];
  // Configure the request
  var options = {
    url: config.url + config.propertytypeApi,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      propertyTypes = JSON.parse(body);
      Collection.find({ "be_id": config.bookingEngineId }).exec(function(err, collections) {
        if (err) return res.status(400).send(err);
        else {
          _(collections).forEach(function (collection) {
            selectedCollections[collection.position] = _.find(propertyTypes.PropertyList, {'id': collection.collection_id});
            selectedCollections[collection.position]._id = collection._id;
            selectedCollections[collection.position].collection_id = collection.collection_id;
            selectedCollections[collection.position].description = collection.description;
            selectedCollections[collection.position].image = collection.image;
            selectedCollections[collection.position].position = collection.position;
          });
          res.send(_.compact(selectedCollections));
        }
      });
    }
  })
};

exports.setSelectedCollection = function(req, res) {
  var collection = new Collection(req.body);
  collection.be_id = config.bookingEngineId;
  collection.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(collection);
  })
};

exports.updateSelectedCollection = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Collection.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.collectionId }, { $set: req.body }, { new: true }, function(err, updatedCollection) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedCollection);
  });
};


// deals
exports.getMyDeals = function(req, res) {
  Deal.find({ "be_id": config.bookingEngineId }).exec(function(err, deals) {
    if (err) return res.status(400).send(err);
    else res.jsonp(deals);
  });
};

exports.setMyDeals = function(req, res) {
  var deal = new Deal(req.body);
  deal.be_id = config.bookingEngineId;
  deal.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(deal);
  })
};

exports.updateMyDeal = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Deal.findOneAndUpdate({ "be_id": config.bookingEngineId, 'position': req.params.dealId}, {$set: req.body}, {new: true}, function(err, deal) {
     if (err) return res.status(400).send(err);
    else res.jsonp(deal);
  });
};

exports.dealByID = function(req, res, next, id) {
  var query = Deal.findOne({ "be_id": config.bookingEngineId, "position": id });
  query.exec(function(err, deal) {
    if (err) return next(err);
    else if (!deal) return res.status(404).send(err);
    req.deal = deal;
    next();
  });
};

exports.getDeals = function(req, res) {
  // Configure the request
  var options = {
    url: config.url + config.dealApi,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};


//locations
exports.getSelectedLocations = function(req, res) {
  var allCities = [];
  var selectedLocations = [];
  var headers = {
    apiKey: config.apiKey,
    channelId: config.channelId
  };
  var options = {
    url: config.url + config.locationApi,
    method: 'GET',
    headers: headers
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      allCities = JSON.parse(body).locations;
      Location.find({ "be_id": config.bookingEngineId }).exec(function(err, locations) {
        if (err) return res.status(400).send(err);
        else {
          _(locations).forEach(function (location) {
            selectedLocations[location.position] = _.find(allCities, {'state_id': location.location_id});
            selectedLocations[location.position]._id = location._id;
            selectedLocations[location.position].location_id = location.location_id;
            selectedLocations[location.position].image = location.image;
            selectedLocations[location.position].position = location.position;
          });
          res.send(_.compact(selectedLocations));
        }
      });
    }
  })
};

exports.setSelectedLocation = function(req, res) {
  var location = new Location(req.body);
  location.be_id = config.bookingEngineId;
  location.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(location);
  })
};

exports.updateSelectedLocation = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Location.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.locationId}, {$set: req.body}, {new: true}, function(err, updatedLocation) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedLocation);
  });
};


//Packages
exports.getSelectedPackags = function(req, res) {
  var allPackags = [];
  var selectedPackags = [];
  var headers = {
    apiKey: config.apiKey,
    channelId: config.channelId
  };
  var options = {
    url: config.url + config.packagApi,
    method: 'GET',
    headers: headers
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      allPackags = JSON.parse(body).packags;
      Packag.find({ "be_id": config.bookingEngineId }).exec(function(err, packags) {
        if (err) return res.status(400).send(err);
        else {
          _(packags).forEach(function (selectedPackag) {
            selectedPackags[packags] = _.find(allPackags, {'packag_id': selectedPackag.packag_id});
          });
          res.send(_.compact(selectedPackags));
        }
      });
    }
  })
};

exports.setSelectedPackag = function(req, res) {
  var packags = new Packag(req.body);
  packags.be_id = config.bookingEngineId;
  packags.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(packags);
  })
};

exports.updateSelectedPackag = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Packag.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.packagId}, {$set: req.body}, {new: true}, function(err, updatedPackag) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedPackag);
  });
};


//promos
exports.getPromos = function(req, res) {
  Promo.find({ "be_id": config.bookingEngineId }).exec(function(err, Promos) {
    if (err) return res.status(400).send(err);
    else res.jsonp(Promos);
  });
};

exports.updatePromos = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Promo.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.promoId}, {$set: req.body}, {new: true}, function(err, updatedpromo) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedpromo);
  });
};

exports.setPromos = function(req, res) {
  var promos = new Promo(req.body);
  promos.be_id = config.bookingEngineId;
  promos.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(promos);
  })
};


// StaticPages
exports.getStaticPages = function(req, res) {
  StaticPages.find({ "be_id": config.bookingEngineId }).exec(function(err, StaticPages) {
    if (err) return res.status(400).send(err);
    else res.jsonp(StaticPages);
  });
};

exports.setStaticPages = function(req, res) {
  var staticPages = new StaticPages(req.body);
  staticPages.be_id = config.bookingEngineId;
  staticPages.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(staticPages);
  })
};

exports.updateStaticPages = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  StaticPages.findOneAndUpdate({ "be_id": config.bookingEngineId, 'screen': req.params.Screen}, {$set: req.body}, {new: true}, function(err, updatedStaticPages) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedStaticPages);
  });
};


//get user details
exports.getUserDetails = function(req, res) {
  User.find({ "be_id": config.bookingEngineId }).exec(function(err, userDetail) {
    if (err) return res.status(400).send(err);
    else res.jsonp(userDetail);
  });
};

//update User Details
exports.updateUserDetails = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  User.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.user_id}, {$set: req.body}, {new: true}, function(err, updatedUserDetails) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedUserDetails);
  });
};


// Currency
exports.getCurrency = function(req, res) {
  Currency.find({ "be_id": config.bookingEngineId }).exec(function(err, currency) {
    if (err) return res.status(400).send(err);
    else res.jsonp(currency);
  });
};

exports.setCurrency = function(req, res) {
  var currency = new Currency(req.body);
  currency.be_id = config.bookingEngineId;
  currency.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(currency);
  })
};

exports.updateCurrency = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Currency.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.currency_id}, {$set: req.body}, {new: true}, function(err, updatedCurrency) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedCurrency);
  });
};


// Metatags
exports.getMetatag = function(req, res) {
  Metatag.find({ "be_id": config.bookingEngineId }).exec(function(err, metatag) {
    if (err) return res.status(400).send(err);
    else res.jsonp(metatag);
  });
};

exports.setMetatag = function(req, res) {
  var metatag = new Metatag(req.body);
  metatag.be_id = config.bookingEngineId;
  metatag.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(metatag);
  })
};

exports.updateMetatag = function(req, res) {
  Metatag.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.metatagId}, {$set: req.body}, {new: true}, function(err, updatedMetatag) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedMetatag);
  });
};


// Destinations
exports.getDestination = function(req, res) {
  Destination.find({ "be_id": config.bookingEngineId }).exec(function(err, destination) {
    if (err) return res.status(400).send(err);
    else res.jsonp(destination);
  });
};

exports.setDestination = function(req, res) {
  var destination = new Destination(req.body);
  destination.be_id = config.bookingEngineId;
  destination.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(destination);
  })
};

exports.updateDestination = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Destination.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.destinationId}, {$set: req.body}, {new: true}, function(err, updatedDestination) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedDestination);
  });
};


// Headings
exports.getHeadings = function(req, res) {
   Heading.find({ "be_id": config.bookingEngineId }).exec(function(err, heading) {
    if (err) return res.status(400).send(err);
    else res.jsonp(heading);
  });
};

exports.getHeading = function(req, res) {
  Heading.findOne({ "be_id": config.bookingEngineId, 'type': req.params.headingName}).exec(function(err, heading) {
    if (err) return res.status(400).send(err);
    else res.jsonp(heading);
  });
};

exports.setHeading = function(req, res) {
  var heading = new Heading(req.body);
  heading.be_id = config.bookingEngineId;
  heading.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(heading);
  })
};

exports.updateHeading = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Heading.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params.headingId}, {$set: req.body}, {new: true}, function(err, updatedHeading) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedHeading);
  });
};


// propertytype
exports.getPropertytype = function(req, res) {
  // Configure the request
  var options = {
    url: config.url + config.propertytypeApi,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};


// css
var fs = require('fs');
var Project = config.project;
var css = "views/" +Project+ "/modules/users/client/css/zCmsCustomResponsive.css";

exports.getCss = function (req, res) {
  var cssData = fs.readFileSync(css, 'utf8');
  res.jsonp(cssData);
};

exports.updateCss = function (req, res) {
  fs.writeFile(css, req.body.css, 'utf8', function (err) {
    if (err) throw err;
    res.json({updated: true, file: req.body.css});
  })
};


// Order Details
exports.getOrderDetail = function(req, res) {
  OrderDetail.find({ "be_id": config.bookingEngineId }).exec(function(err, orderDetail) {
    if (err) return res.status(400).send(err);
    else res.jsonp(orderDetail);
  });
};

exports.setOrderDetail = function(req, res) {
  var orderDetail = new OrderDetail(req.body);
  orderDetail.be_id = config.bookingEngineId;
  orderDetail.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(orderDetail);
  })
};

exports.updateOrderDetail = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  OrderDetail.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params._id}, {$set: req.body}, {new: true}, function(err, updatedOrderDetail) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedOrderDetail);
  });
};


// Maintenance Page
exports.getMaintenance = function(req, res) {
  Maintenance.find({ "be_id": config.bookingEngineId }).exec(function(err, maintenance) {
    if (err) return res.status(400).send(err);
    else res.jsonp(maintenance);
  });
};

exports.updateMaintenance = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  Maintenance.findOneAndUpdate({ "be_id": config.bookingEngineId, '_id': req.params._id }, {$set: req.body}, {new: true}, function(err, updatedMaintenance) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedMaintenance);
  });
};

exports.setSearchLogger = function(req, res) {
  var searchLogger = new SearchLogger(req.body);
  searchLogger.be_id = config.bookingEngineId;
  searchLogger.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(searchLogger);
  })
};

// Newsletter Page
exports.getNewsletter = function(req, res) {
  Newsletter.find({ "be_id": config.bookingEngineId }).exec(function(err, newsletter) {
    if (err) return res.status(400).send(err);
    else res.jsonp(newsletter);
  });
};

exports.setNewsletter = function(req, res) {
  var newsletter = new Newsletter(req.body);
  newsletter.be_id = config.bookingEngineId;
  newsletter.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(newsletter);
  })
};


// Favourite Hotels
exports.getFavouriteHotels = function(req, res) {
  FavouriteHotels.find({ "be_id": config.bookingEngineId, 'user_id': req.params.user_id }).exec(function(err, favouriteHotels) {
    if (err) return res.status(400).send(err);
    else res.jsonp(favouriteHotels);
  });
};

exports.setFavouriteHotels = function(req, res) {
  var favouriteHotels = new FavouriteHotels(req.body);
  favouriteHotels.be_id = config.bookingEngineId;
  favouriteHotels.save(function(err) {
    if (err) return res.status(400).send(err);
    else res.jsonp(favouriteHotels);
  })
};

exports.updateFavouriteHotels = function(req, res) {
  req.body.be_id = config.bookingEngineId;
  FavouriteHotels.findOneAndUpdate({ "be_id": config.bookingEngineId, 'user_id': req.params.user_id}, {$set: req.body}, {new: true}, function(err, updatedFavouriteHotels) {
    if (err) return res.status(400).send(err);
    else res.jsonp(updatedFavouriteHotels);
  });
};
