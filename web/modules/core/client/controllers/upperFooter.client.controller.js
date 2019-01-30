(function() {
        'use strict';

        angular
            .module('core')
            .controller('upperFooterCtrl', upperFooterCtrl);

  upperFooterCtrl.$inject = ['$scope', '$state', 'Authentication', '$rootScope', '$stateParams', '$http'
        ];

        function upperFooterCtrl($scope, $state, Authentication, $rootScope, $stateParams, $http) {
          $http.get('/api/getLocations').success(function(res) {

            // remove Virtual cities from list of cities
            var virtualcities = [9313,9326,9320,9316];
            for(var c = 0; c < virtualcities.length; c++){
              _.remove(res.locations, function(currentObject){
                return currentObject.city_id === virtualcities[c];
             });
            }

            $rootScope.locations = res.locations;
            $scope.menuText = 'Hotels in Top Cities';

            // if there are no state parameters in other pages
            // *** May be used in future ***
            //if (!($stateParams.checkin && $stateParams.checkout)) {
            //
            //  var maxDate = new Date(2020, 5, 22);
            //
            //  $scope.clear = function() {
            //    $scope.startDate = null;
            //  };
            //  var n = 2; //number of days to add (cutoff days).
            //  var today = new Date();
            //  var sd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
            //  var ed = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (n + 1));
            //
            //  $rootScope.startDate = $stateParams.checkin ? new Date(strToDate($stateParams.checkin)) : sd;
            //  $rootScope.endDate = $stateParams.checkout ? new Date(strToDate($stateParams.checkout)) : ed;
            //  $rootScope.guest = {
            //    rooms: $stateParams.rooms ? $stateParams.rooms : 1,
            //    adults: $stateParams.adults ? $stateParams.adults : 2
            //  };
            //}

            function chunk(arr, size) {
              var newArr = [];
              arr = _.sortBy(arr, 'city');
              for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
              }
              return newArr;
            }

            $scope.topCities = chunk($rootScope.locations, Math.ceil($rootScope.locations.length) / 5);

          });

          $scope.diplaycity = function(City) {
            var city = (City.city).replace(/ /g, '-');
            var state = (City.state).replace(/ /g, '-');
            var country = (City.country).replace(/ /g, '-');

            $state.go('cityDisplay', { 'city': city, 'stateId': state, 'country': country });
          }
        }
    }());
