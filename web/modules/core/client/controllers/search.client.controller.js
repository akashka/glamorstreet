(function() {
    'use strict';

    angular
        .module('core')
        .controller('SearchController', SearchController);
  SearchController.$inject = ['$scope', 'Authentication', '$rootScope', '$stateParams', '$http', 'ngMeta', '$state', 'CLIENT', 'MetaTagsServices'];
    function SearchController($scope, Authentication, $rootScope, $stateParams, $http, ngMeta, $state, CLIENT, MetaTagsServices) {
      $scope.propertyType = $stateParams.propertyType;
      $scope.country = $stateParams.country;
      $scope.deal = $stateParams.deal;
      $scope.promo = $stateParams.promo;
      $scope.stateId = $stateParams.stateId;

      $http.get('/api/getLocations').success(function(res) {

        // Code to remove the vitual cities from the list
       var virtualcities = [9313, 9326, 9316];
        for(var c = 0; c < virtualcities.length; c++){
          _.remove(res.locations, function(currentObject) {
            return currentObject.city_id === virtualcities[c];
        });
        }

        var dividedLocations = _.uniq(_.map(res.locations,"state_id"));
        for (var i = 0; i < dividedLocations.length; i++){
          var dl = _.find(res.locations, {'state_id': dividedLocations[i]});
          var newState = {
            city: "",
            city_id: -1,
            country: dl.country,
            country_id: dl.country_id,
            lattitude: dl.lattitude,
            longitude: dl.longitude,
            state: dl.state,
            state_id: dl.state_id
          };
          res.locations.unshift(newState);
        }

        // Locations
        $rootScope.locations = res.locations;

            $scope.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        if ($stateParams.location) {
          var city = _.find($rootScope.locations, { 'city_id': Number($stateParams.location) });
          $rootScope.locationcity = city.city;
          $rootScope.locationcountry = city.country;
          $rootScope.locationCountry = '';
          $rootScope.locationstatecountry = '';
          $rootScope.locationstate = city.state;
          $rootScope.hotelsMetaTags();

        } else if ($stateParams.stateId) {
          var state = _.find($rootScope.locations, { 'state_id': Number($stateParams.stateId) });
          $rootScope.locationstate = state.state;
          $rootScope.locationstatecountry = state.country;
          $rootScope.locationCountry = '';
          $rootScope.locationcity = '';
          $rootScope.locationcountry = '';
          $rootScope.hotelsMetaTags();
        } else if ($stateParams.country) {
          var country = _.find($rootScope.locations, { 'country_id': Number($stateParams.country) });
          $rootScope.locationCountry = country.country;
          $rootScope.locationcity = '';
          $rootScope.locationcountry = '';
          $rootScope.locationstate = '';
          $rootScope.locationstatecountry = '';
          $rootScope.hotelsMetaTags();
        } else {
          $rootScope.locationcity = '';
          $rootScope.locationcountry = '';
          $rootScope.locationstate = '';
          $rootScope.locationstatecountry = '';
          $rootScope.locationCountry = '';
        }

        // Datepicker Logic
        var maxDate = new Date(2020, 5, 22);

        $scope.clear = function() {
          $scope.startDate = null;
        };

        var n = 1; //number of days to add (cutoff days).
        var today = new Date();
        var sd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
        var ed = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (n + 1));

        $scope.dateOptions1 = {
          format: $scope.format,
          maxDate: new Date(maxDate),
          minDate: sd,
          startingDay: 1,
          showWeeks: false
        };

        $scope.dateOptions2 = {
          format: $scope.format,
          maxDate: new Date(maxDate),
          minDate: new Date(),
          startingDay: 1,
          showWeeks: false
        };

        $scope.open1 = function() {
          $scope.popup1.opened = true;
        };


        $scope.open2 = function() {
          $scope.popup2.opened = true;
        };

        $scope.setMinMaxDate = function() {
          var start = angular.copy($scope.startDate);
          $scope.endDate = '';
          $scope.dateOptions2.minDate = new Date(moment(start).add(1, 'd'));
          $scope.dateOptions2.initDate = new Date(moment(start).add(1, 'd'));
          $scope.open2();

          if ($state.current.name == "listDisplay") {
            console.log("yes");
            $scope.ispophover = false;
          }
        };

        // only for packages
        if ($state.current.name == "viewPackag") {
          $rootScope.noOfDays = $stateParams.noOfDays;
          $scope.setMinMaxDatePackage = function() {
            var start = angular.copy($scope.startDate);
            $scope.endDate = new Date(moment(start).add($rootScope.noOfDays, 'd'));
          };
        }

        $scope.format = 'dd MMM yyyy';
        $scope.popup1 = { opened: false };
        $scope.popup2 = { opened: false };

        if ($state.current.name == "listDisplay") {
          $scope.popup1 = { opened: true };
          $scope.popup2 = { opened: false };
          $scope.ispophover = true;
        }


        // Guest selection logic

        $scope.status = {
          isopen: false
        };

        $scope.toggleDropdown = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.status.isopen = !$scope.status.isopen;
        };

        // Spinner logic
        $scope.spinUproom = function(val) {
          if (val == 'rooms') {
            $scope.guest.rooms++;
            $scope.guest.adults = $scope.guest.rooms * 2;
          }

        };
        $scope.spinDownroom = function(val) {
          if (val == 'rooms' && $scope.guest.rooms != 1) {
            $scope.guest.rooms--;
            $scope.guest.adults = $scope.guest.rooms * 2;
          }
        };

        $scope.spinUp = function(val) {
          if (val == 'adults') {
            $scope.guest.adults++;
            $scope.guest.rooms = Math.round($scope.guest.adults / 2);
          }

        };
        $scope.spinDown = function(val) {
          if (val == 'adults' && $scope.guest.adults != 1) {
            $scope.guest.adults--;
            $scope.guest.rooms = Math.round($scope.guest.adults / 2);
          }
        };

        $scope.onAdultsChange = function() {
          $scope.guest.rooms = Math.round($scope.guest.adults / 2);
        };

        $scope.onRoomChange = function() {
          $scope.guest.adults = $scope.guest.rooms * 2;
        };

        $scope.setLoc = function(loc) {
          $scope.location = loc.city;
          $scope.cityId = loc.city_id;
          $scope.stateId = loc.state_id;
        };

        if($stateParams.location != undefined && $stateParams.location != ""){
          $scope.location = $stateParams.location ? _.find($scope.locations, { 'city_id': Number($stateParams.location) }) : (($rootScope.location != undefined) ? $rootScope.location : '');
        }
        else if($stateParams.stateId != null && $stateParams.stateId != undefined){
          $scope.location = _.find($scope.locations, {'state_id': Number($stateParams.stateId)});
        }
        else{
          $scope.location = ($rootScope.location != undefined) ? $rootScope.location : "";
        }
        $rootScope.location = $scope.location;
        $scope.cityId = $scope.location.city_id;
        $scope.stateId = ($scope.location.stateId != undefined) ? $scope.location.stateId : $scope.location.state_id;
        $rootScope.startDate = $stateParams.checkin ? new Date(strToDate($stateParams.checkin)) : (($rootScope.startDate != undefined) ? $rootScope.startDate : sd);
        $rootScope.endDate = $stateParams.checkout ? new Date(strToDate($stateParams.checkout)) : (($rootScope.endDate != undefined) ? $rootScope.endDate : ed);
        $rootScope.guest = {
          rooms: $stateParams.rooms ? $stateParams.rooms : (($rootScope.guest != undefined) ? $rootScope.guest.rooms : 1),
          adults: $stateParams.adults ? $stateParams.adults : (($rootScope.guest != undefined) ? $rootScope.guest.adults : 2)
        };

        $rootScope.allLocations = $scope.locations;

        function strToDate(dt) {
          var d = dt.split('-');
          return moment([d[2], (Number(d[0]) - 1), d[1]]);
        }
        });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
