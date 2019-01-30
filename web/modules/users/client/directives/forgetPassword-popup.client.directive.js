(function () {
  'use strict';

  angular.module('users')
    .directive('forgetPassword', forgetPassword);

  forgetPassword.$inject = ['$rootScope', '$interpolate', '$state', 'CLIENT'];

  function forgetPassword($rootScope, $interpolate, $state, CLIENT) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'views/staydilly/modules/users/client/views/password/forgot-password.client.view.html',
      controller: 'AuthenticationController'
    };

    return directive;
  }
}());
