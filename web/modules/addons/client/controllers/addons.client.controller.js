(function() {
    'use strict';

    angular
        .module('addons')
        .controller('addonsController', addonsController);

    addonsController.$inject = ['$scope', 'Authentication', '$rootScope', 'AddonsServices', '$stateParams', '$window',
    '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location', 'CLIENT', 'ngMeta', 'HotelsServices'];

    function addonsController($scope, Authentication, $rootScope, AddonsServices, $stateParams, $window, 
      $http, $filter, $uibModal, $timeout, Calculate,$location, CLIENT, ngMeta, HotelsServices) {
          
      $scope.dataReceived = false;
      var parameters = {
        checkin: (moment().add(1, 'd').format('MM-DD-YYYY')),
        checkout: (moment().add(2, 'd').format('MM-DD-YYYY')),
        rooms: 1,
        adults: 2
      };

      HotelsServices.get(parameters).success(function(res) {
        if (res) {
          $scope.dataReceived = true;
          $scope.searchId = res.search_id;
        }

        $scope.addOns = [];
        if (res.Hotel_Details) {
          var hotels = res.Hotel_Details;
          $scope.hotelCount = hotels.length;
          $scope.count = 0;

          _(hotels).forEach(function(hotel){
            var params = {
              searchId: ($scope.searchId).toString(),
              productId: (hotel.hotel_id).toString()
            };
            var i = 0;
            AddonsServices.policies(params).success(function(res){
              _(res.policies).forEach(function(policy) { $scope.addOns.push(policy); });
              $scope.count ++;
              if($scope.count >= ($scope.hotelCount)) $scope.addons = _.map(_.uniqBy($scope.addOns, 'policy_id'));
            });
          });
        }

      });
    }
}());
