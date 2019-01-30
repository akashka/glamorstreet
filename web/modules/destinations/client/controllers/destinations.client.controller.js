(function() {
    'use strict';

    angular
        .module('destinations')
        .controller('destinationsController', destinationsController);

    destinationsController.$inject = ['$scope', 'Authentication', '$rootScope', 'Destinations',
        '$stateParams', '$window', '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location', 'CLIENT','MetaTagsServices'
    ];

    function destinationsController($scope, Authentication, $rootScope, Destinations, $stateParams,
                              $window, $http, $filter, $uibModal, $timeout, Calculate,$location, CLIENT, MetaTagsServices) {

      $timeout(function() {
        (CLIENT.name == "staydilly") ? window.scrollTo(0, 120) : "";
        (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 1000);

      $scope.dataReceived = false;

      Destinations.get().success(function (res) {
          $scope.destinations = res;
          $http.get('/api/getLocations').success(function(loc) {
            for(var i = 0; i < $scope.destinations.length; i++){
              var isFound = _.find(loc.locations, {"city": $scope.destinations[i].city});
              if(isFound == null || isFound == undefined){
                $scope.destinations.splice(i,1);
                i--;
              }
            }
            $scope.dataReceived = true;
          });
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
    }
}());
