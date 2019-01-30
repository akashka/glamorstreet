'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  request = require('request'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  validator = require('validator'),
  projectConfig = require(path.resolve('./modules/core/server/config/config'));

var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

var configProject = projectConfig();

var headers = {
  apiKey: configProject.apiKey,
  channelId: configProject.channelId
};
/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

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
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var existingImageUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(user);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser () {
    return new Promise(function (resolve, reject) {
      user.profileImageURL = config.uploads.profile.image.dest + req.file.filename;
      user.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  function login () {
    return new Promise(function (resolve, reject) {
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};


//manage Wallet
exports.getWalletDetails = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    userId: (params.userId ? '?userId=' + params.userId : '')
  };
  // Configure the request
  var options = {
    url: configProject.url + configProject.walletDetailsApi + param.userId,
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

//Add Amount to Wallet
exports.addWalletAmount = function(req, res) {
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    userId: (params.userId ? '?userId=' + params.userId : ''),
    supplierId: (params.supplierId ? '&supplierId=' + params.supplierId : ''),
    txnAmt: (params.txnAmt ? '&txnAmt=' + params.txnAmt : ''),
  };
  // Configure the request
  var options = {
    url: configProject.url + configProject.addWalletAmountApi + param.userId + param.supplierId + param.txnAmt,
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

//updateUserProfile
exports.updateUserProfile = function(req, res) {
  // Configure the request
  var options = {
    url: configProject.url + configProject.updateUserProfileApi,
    method: 'POST',
    headers: headers,
    body: JSON.stringify(req.body)
  };
  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })
};

//update user password
exports.updateUserPassword = function(req, res) {
  // Configure the request
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    emailId: (params.emailId ? '&emailId=' + params.emailId : ''),
    oldPassword: (params.oldPassword ? '&oldpassword=' + params.oldPassword : ''),
    newPassword: (params.newPassword ? '&newpassword=' + params.newPassword : '')
  };
  var options = {
    url: configProject.url + configProject.updateUserPasswordAPi + configProject.beId + param.emailId + param.oldPassword + param.newPassword,
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


//Refer a Friend
exports.referAFriend = function(req, res) {
   //Configure the request
  var params = req.headers.params ? JSON.parse(req.headers.params) : {};
  var param = {
    userId: (params.userId ? '?userId=' + params.userId : ''),
    emailId: (params.referalEmail ? '&emailId=' + params.referalEmail : '')
  };
  var options = {
    url: configProject.url + configProject.referAfriendAPi + param.userId + param.emailId,
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



