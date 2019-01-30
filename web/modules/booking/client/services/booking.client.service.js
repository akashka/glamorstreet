(function () {
  'use strict';

  angular
    .module('booking.services')
    .factory('BookingServices', BookingServices);

  BookingServices.$inject = ['$http'];

  function BookingServices($http) {
    return {
      getOrderDetails: function(params) {
        return $http.get('/api/getSingleBookingDetails', {
          headers: {
            "params": JSON.stringify(params)
          }
        });
      }
    }
  }
}());
