(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsController', cmsController);

    cmsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', '$timeout', 'CLIENT'];

    function cmsController($scope, Authentication, $rootScope, $http, $timeout, CLIENT) {
    // Function to get the screen to lower level, after the screen is loaded based on the timeout.
      $timeout(function () {
      (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 1000);
    }
}());
