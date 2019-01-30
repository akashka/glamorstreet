(function () {
  'use strict';

  angular
    .module('locations.services')
    .factory('LocationsServices', LocationsServices);

  LocationsServices.$inject = ['$resource', '$log', '$http'];

  function LocationsServices($resource, $log, $http) {
    return {
      get: function(params) {
        return $http.get('/api/getLocations', {
          headers: {
            "params": JSON.stringify(params)
          }
        });
      },
      single: function(params) {
        return $http.get('/api/getSingleLocation', {
          headers: {
            "params": JSON.stringify(params)
          }
        });
      }
    }
  }

}());
