'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  app.route('/api/referAFriend')
    .get(users.referAFriend);
  // Setting up the users profile api
  app.route('/api/getWalletDetails')
    .get(users.getWalletDetails);
  app.route('/api/addWalletAmount')
    .get(users.addWalletAmount);
  app.route('/api/updateUserPassword')
    .get(users.updateUserPassword);
  app.route('/api/updateUserProfile')
    .post(users.updateUserProfile);


  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
