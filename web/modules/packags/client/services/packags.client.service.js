(function () {
  'use strict';

  angular
    .module('packags.services')
    .factory('PackagsServices', PackagsServices);

  PackagsServices.$inject = ['$resource', '$log', '$http'];

  function PackagsServices($resource, $log, $http) {
    return {
      getPackags: function(params) {
        return $http.get('/api/getPackags', {
          headers: {
            "params": JSON.stringify(params)
          }
        });
      },
    }
  }

}());
