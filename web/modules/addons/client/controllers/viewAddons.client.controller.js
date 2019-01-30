(function() {
    'use strict';

    angular
        .module('addons')
        .controller('viewAddonsController', viewAddonsController);

    viewAddonsController.$inject = ['$scope', 'Authentication', '$rootScope', 'AddonsServices', '$stateParams', '$window',
    '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location', 'CLIENT', 'ngMeta', 'HotelsServices'];

    function viewAddonsController($scope, Authentication, $rootScope, AddonsServices, $stateParams, $window,
      $http, $filter, $uibModal, $timeout, Calculate,$location, CLIENT, ngMeta, HotelsServices) {

      $scope.dataReceived = false;
      $scope.checkin = moment().add(1, 'd').format('MM-DD-YYYY');
      $scope.checkout = moment().add(2, 'd').format('MM-DD-YYYY');
      var parameters = {
        checkin: $scope.checkin,
        checkout: $scope.checkout,
        rooms: 1,
        adults: 2
      };

      $scope.itemsPerPage = (CLIENT.name == "traveler.mv") ? 10 : 50;
      // Display the number of page opptions in a pagination widget
      $scope.maxSize = (CLIENT.name == "traveler.mv") ? 5 : 3;

      $scope.totalItems = 0;
      $scope.currentPage = 1;
      $scope.priceRange = 0;
      $scope.pageChanged = function() {
        $scope.hotels = [];
        $scope.totalItems = $scope.allHotels.length;
        $scope.totalItem = 0;

        if ($scope.view == 'grid') {
          var itemsPer = $scope.itemsPerPage/2;
          $scope.startNum = (itemsPer * ($scope.currentPage - 1));
          $scope.endNum = ($scope.startNum + itemsPer) > $scope.totalItems ? ($scope.totalItems) : ($scope.startNum + itemsPer);
          $scope.totalItem = $scope.totalItems*2;
        } else {
          $scope.startNum = ($scope.itemsPerPage * ($scope.currentPage - 1));
          $scope.endNum = ($scope.startNum + $scope.itemsPerPage) > $scope.totalItems ? ($scope.totalItems) : ($scope.startNum + $scope.itemsPerPage);
          $scope.totalItem = $scope.totalItems;
        }

        for (var i = $scope.startNum; i < $scope.endNum; i++) {
          $scope.hotels.push($scope.allHotels[i]);
        }
      };

      HotelsServices.get(parameters).success(function(res) {
        if (res) {
          $scope.searchId = res.search_id;
        }

        $scope.hotel = [];
        $scope.addon = null;
        var hotels = [];

        if (res.Hotel_Details) {
          hotels = res.Hotel_Details;
          _(hotels).forEach(function(hotel){
            var params = {
              searchId: ($scope.searchId).toString(),
              productId: (hotel.hotel_id).toString()
            };
            AddonsServices.policies(params).success(function(res){
              _(res.policies).forEach(function(policy){
                if(policy.policy_id === $stateParams.addonId) {
                  if(!$scope.dataReceived) $scope.addon = policy;
                  $scope.dataReceived = true;
                  var hot = _.find(hotels, {"hotel_id": Number(params.productId)});
                  $scope.hotel.push(hot);
                }
              });
              $scope.pageChanged();
            });
          });
        }

      });

    }
}());
