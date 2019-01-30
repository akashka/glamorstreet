(function () {
  'use strict';

  angular.module('users')
    .directive('signUpPopup', signupPopup);

  signupPopup.$inject = ['$rootScope', '$interpolate', '$state', 'CLIENT'];

  function signupPopup($rootScope, $interpolate, $state, CLIENT) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'views/staydilly/modules/users/client/views/authentication/signup.client.view.html',
      controller: 'AuthenticationController'
    };

    return directive;
  }
}());
