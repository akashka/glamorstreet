'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  request = require('request'),
  passport = require('passport'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  sgTransport = require('nodemailer-sendgrid-transport'),
  projectConfig = require(path.resolve('./modules/core/server/config/config'));

var configuration = projectConfig();

var headers = {
  apiKey: configuration.apiKey,
  channelId: configuration.channelId
};

var options = {
  auth: {
    api_user: 'axisrooms',
    api_key: 'admin1!'
  }
};
var transporter = nodemailer.createTransport(sgTransport(options));

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  var BePassword = req.body.password;
  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  var beUserDeatails = {
    emailId : user.email,
    firstName :user.firstName,
    lastName : user.lastName,
    password: BePassword,
    mobileNo : user.mobileNo,
    address : user.address? user.address: '',
    bookingEngineId : configuration.bookingEngineId
  };
  // Configure the request
  var options = {
    url: configuration.url + configuration.userRegistrationApi,
    method: 'POST',
    headers: headers,
    body: JSON.stringify(beUserDeatails)
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var BeLoginResponse = JSON.parse(body);
      user.userId = BeLoginResponse.result.userId;
      user.be_id = configuration.bookingEngineId;
      user.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              user.password = undefined;
              user.salt = undefined;
              sendMailtoClientonSignup(user);
              res.json(user);
            }
          });
        }
      });
    } else if(!error && response.statusCode == 500){
      res.json(JSON.parse(body));
    }
    else{
      res.status(422).send(error);
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  var BeLoginInfo = req.body;
  var param = {
    emailId: BeLoginInfo.usernameOrEmail ? '&emailId=' + BeLoginInfo.usernameOrEmail : '',
    password: BeLoginInfo.password ? '&password=' + BeLoginInfo.password : ''
  };
  var options = {
    url: configuration.url + configuration.buyerLoginApi + configuration.beId + param.emailId + param.password,
    method: 'GET',
    headers: headers
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var storeSigninInfo = JSON.parse(body);
      if(storeSigninInfo.user_id){
        User.find({ "userId": storeSigninInfo.user_id }).exec(function(err, userData) {
          userData= userData[0];
          if (err) {
            res.status(400).send(err);
          }
          else {
                req.login(userData, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  }
                  else {
                    userData.password = undefined;
                    userData.salt = undefined;
                    //updating userData with the latest response
                    userData.displayName = storeSigninInfo.first_name + storeSigninInfo.last_name;
                    userData.firstName = storeSigninInfo.first_name;
                    userData.lastName = storeSigninInfo.last_name;
                    res.json(userData);
                  }
                });
          }
        });
      }
    } else if(!error && response.statusCode == 500){
        res.json(JSON.parse(body));
    }
  });
};

/**
 * Signout
 */
exports.signout = function (req, res) {

  req.session.destroy(function() {
    res.clearCookie('sessionId');
    res.redirect('/');
  });
  res.json({'status': true});
};


// forgot Password
exports.forgotPassword = function(req, res) {
  var params = req.query;
  var param = {
    emailId: (params.email ? '&emailId=' + params.email : ''),
    forgotPassword: (params.forgotPassword ? '&forgotPassword=' + params.forgotPassword : '')
  };
  // Configure the request
  var options = {
    url: configuration.url + configuration.buyerLoginApi + configuration.beId + param.emailId + param.forgotPassword,
    method: 'GET',
    headers: headers
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    } else if (response.statusCode == 500) {
      res.json(JSON.parse(body));
    }
  })
};

// facebook token based login
exports.getFacebookSigninData = function(req, res) {
  var params = req.headers.params ? req.headers.params : {};
  var options = {
    url: "https://graph.facebook.com/v2.8/me?access_token=" + params + "&debug=all&fields=id%2Cemail%2Cfirst_name%2Clast_name%2Cgender%2Cpicture%2Clocation&format=json&method=get&pretty=0&suppress_http_code=1",
    method: 'GET'
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

//google token based login
exports.getgoogleSigninData = function(req, res) {
  var params = req.headers.params ? req.headers.params : {};
  var options = {
    url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + params,
    method: 'GET'
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

//google token based login
exports.socialSignin = function(req, res) {
  var socialuserData = req.query;
  req.body = req.query;
  req.body.username = req.body.firstName + req.body.lastName;
  req.body.password = "password";
  if(socialuserData.email){
    User.find({ "email": socialuserData.email }).exec(function(err, userData) {
      var userDataInDatabase = userData[0];
      if(userDataInDatabase == null || userDataInDatabase == undefined){
        exports.signup(req, res);
      }
      if (userDataInDatabase!= null && userDataInDatabase!= "undefined"){
        var registeredUser = true;
        userDataInDatabase = userData[0];
        var param = {
          userId: (userDataInDatabase.userId ? '?userId=' + userDataInDatabase.userId : '')
        };
        // Configure the request
        var options = {
          url: configuration.url + configuration.walletDetailsApi + param.userId,
          method: 'GET',
          headers: headers
        };
        // Start the request
        request(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var Response = JSON.parse(body);
            var socialUserloginResponse ={
              "userId":Response.user_id,
              "displayName":Response.first_name + Response.last_name,
              "provider":"local",
              "mobileNo":Response.mobile,
              "roles":["user"],
              "profileImageURL":socialuserData.picture,
              "email":Response.email,
              "lastName": Response.last_name,
              "firstName":Response.first_name
            };
            res.json(socialUserloginResponse);
          }
        });

      }
    });
  }
};


//sending registration mail to Client
var sendMailtoClientonSignup = function(data) {
  var output = '';

  var emailToClient = {
    to: [data.email],
    from: [configuration.email],
    subject: 'Thanks for registering with ' + configuration.project,
    text: '',
    html: '<h2>Hi ' + data.firstName + ',</h2> Thanks for registering with our website, we will be in touch with you.'
  };
  transporter.sendMail(emailToClient, function(err, res) {
    if (err) {
      output = err;
    }
    output = res;
  });
};


/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info object
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    info.redirect_to = req.session.redirect_to;

  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // Email intentionally added later to allow defaults (sparse settings) to be applid.
            // Handles case where no email is supplied.
            // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
            user.email = providerUserProfile.email;

            // And save the user
            user.save(function (err) {
              return done(err, user, info);
            });
          });
        } else {
          return done(err, user, info);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
