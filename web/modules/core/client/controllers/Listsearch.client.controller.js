(function() {
    'use strict';

    angular
        .module('core')
        .controller('listSearchController', listSearchController);
        listSearchController.$inject = [ '$scope', 'Authentication', 'CLIENT', '$rootScope', '$stateParams',
          '$http', 'ngMeta', '$state','MetaTagsServices'];
    function listSearchController( $scope, Authentication, CLIENT, $rootScope, $stateParams,
    $http, ngMeta, $state, MetaTagsServices) {
      $http.get('/api/getLocations').success(function(res) {

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
                  state_id: dl.state_id,
              };
              res.locations.unshift(newState);
          }

        // Locations
        $rootScope.locations = res.locations;

        if ($stateParams.city) {
          $stateParams.city = ($stateParams.city).replace(/\-/g, ' ');
          var city = _.find($rootScope.locations, { 'city': $stateParams.city });
          $scope.cityId = city.city_id;
          $rootScope.locationcity = city.city;
          $rootScope.locationcountry = city.country;
          $rootScope.locationCountry = '';
          $rootScope.locationstatecountry = '';
          $rootScope.locationstate = '';
          ngMeta.setTitle("Hotel deals in " + $rootScope.locationcity + ", " + $rootScope.locationcountry +  " | Staydilly");
          ngMeta.setTag('description', 'Hotel deals in ' + $rootScope.locationcity + ", " + $rootScope.locationcountry +"." + " Book your discounted hotels in " + $rootScope.locationcity + ", " + $rootScope.locationcountry + " today.");
          ngMeta.setTag('keywords', 'Discounted hotels in ' + $rootScope.locationcity + ", " + $rootScope.locationcountry +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");
        } else if ($stateParams.stateId) {
          $stateParams.stateId = ($stateParams.stateId).replace(/\-/g, ' ');
          var state = _.find($rootScope.locations, { 'state': $stateParams.stateId });
          $scope.stateId = state.state_id;
          $rootScope.locationstate = state.state;
          $rootScope.locationstatecountry = state.country;
          $rootScope.locationCountry = '';
          $rootScope.locationcity = '';
          $rootScope.locationcountry = '';
          ngMeta.setTitle("Hotel deals in " + $rootScope.locationstate + ", " + $rootScope.locationcountry +  " | Staydilly");
          ngMeta.setTag('description', 'Hotel deals in ' + $rootScope.locationstate + ", " + $rootScope.locationCountry +"." + " Book your discounted hotels in " + $rootScope.locationstate + ", " + $rootScope.locationCountry + " today.");
          ngMeta.setTag('keywords', 'Discounted hotels in ' + $rootScope.locationstate + ", " + $rootScope.locationCountry +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");

        } else if ($stateParams.country) {
          $stateParams.country = ($stateParams.country).replace(/\-/g, ' ');
          var country = _.find($rootScope.locations, { 'country': $stateParams.country });
          $scope.countryId = country.country_id;
          $rootScope.locationCountry = country.country;
          $rootScope.locationcity = '';
          $rootScope.locationcountry = '';
          $rootScope.locationstate = '';
          $rootScope.locationstatecountry = '';
          ngMeta.setTitle("Hotel deals in " + $rootScope.locationcountry +  " | Staydilly");
          ngMeta.setTag('description', 'Hotel deals in ' + $rootScope.locationCountry +"." + " Book your discounted hotels in " + $rootScope.locationCountry + " today.");
          ngMeta.setTag('keywords', 'Discounted hotels in ' + $rootScope.locationCountry +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");

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

          if ($state.current.name == "cityDisplay" || $state.current.name == "stateList" || $state.current.name == "countryList") {
            $scope.ispophover = false;
          }
        };

        $scope.format = 'dd MMM yyyy';
        $scope.popup1 = { opened: false };
        $scope.popup2 = { opened: false };

        if ($state.current.name == "cityDisplay" || $state.current.name == "stateList" || $state.current.name == "countryList") {
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

        $scope.setLoc = function(loc) {
          $scope.location = loc.city;
          $scope.cityId = loc.city_id;
        };

        $scope.location = $stateParams.location ? _.find($scope.locations, { 'city_id': Number($stateParams.location) }) : '';
        //    $scope.cityId = $scope.location.city_id;
        $rootScope.startDate = $stateParams.checkin ? new Date(strToDate($stateParams.checkin)) : sd;
        $rootScope.endDate = $stateParams.checkout ? new Date(strToDate($stateParams.checkout)) : ed;
        $rootScope.guest = {
          rooms: $stateParams.rooms ? $stateParams.rooms : 1,
          adults: $stateParams.adults ? $stateParams.adults : 2
        };

        function strToDate(dt) {
          var d = dt.split('-');
          return moment([d[2], (Number(d[0]) - 1), d[1]]);
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
