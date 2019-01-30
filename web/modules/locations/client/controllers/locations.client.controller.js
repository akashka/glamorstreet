(function() {
    'use strict';

    angular
        .module('locations')
        .controller('locationssController', locationsController);

    locationsController.$inject = ['$scope', 'Authentication', '$rootScope', 'LocationsServices', '$stateParams', '$window', '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location', 'CLIENT'];

    function locationsController($scope, Authentication, $rootScope, LocationsServices, $stateParams, $window, $http, $filter, $uibModal, $timeout, Calculate,$location, CLIENT) {

      $timeout(function() {
        (CLIENT.name == "staydilly") ? window.scrollTo(0, 120) : "";
      }, 1000);
      $rootScope.dataReceived = false;

    }

}());
