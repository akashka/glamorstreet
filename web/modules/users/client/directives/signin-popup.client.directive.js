(function () {
  'use strict';

  angular.module('users')
    .directive('signInPopup', signInPopup);

  signInPopup.$inject = ['$rootScope', '$interpolate', '$state', 'CLIENT'];

  function signInPopup($rootScope, $interpolate, $state, CLIENT) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'views/' +CLIENT.name+ '/modules/users/client/views/authentication/signin.client.view.html',
      controller: 'AuthenticationController',
      controllerAs: 'vm'
    };

    return directive;
  }
}());
