(function () {
  'use strict';

  angular
    .module('addons.services')
    .factory('AddonsServices', AddonsServices);

  AddonsServices.$inject = ['$resource', '$log', '$http'];

  function AddonsServices($resource, $log, $http) {
        return {
          policies: function(params){
            return $http.get('/api/getHotelPolicies', {
              headers: {
                "params": JSON.stringify(params)
              }
            });
          }
        }
  }
}());
