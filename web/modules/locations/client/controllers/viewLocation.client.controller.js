(function() {
    'use strict';

    angular
        .module('locations')
        .controller('viewLocationController', viewLocationController);

    viewLocationController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'LocationsServices', '$stateParams', '$state', '$cookieStore', '$timeout', 'Calculate', 'ngMeta', 'CLIENT'];

    function viewLocationController($scope, Authentication, $rootScope, $http, LocationsServices, $stateParams, $state, $cookieStore, $timeout, Calculate, ngMeta, CLIENT) {
      $rootScope.dataReceived = false;
      
    }
}());
