(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.admin.services')
    .factory('UserAdminServices', UserAdminServices);

  UserAdminServices.$inject = ['$resource'];

  function UserAdminServices($resource) {


  }
}());
