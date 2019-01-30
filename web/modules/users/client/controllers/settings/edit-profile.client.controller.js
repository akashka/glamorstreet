(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification', '$rootScope', '$timeout'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification, $rootScope, $timeout) {

  }
}());
