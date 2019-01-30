(function () {
  'use strict';

  angular
    .module('hotels.services')
    .factory('HotelsServices', HotelsServices);

  HotelsServices.$inject = ['$resource', '$log', '$http'];

  function HotelsServices($resource, $log, $http) {
        return {
          get: function(params) {
            return $http.get('/api/getHotels', {
              headers: {
                "params": JSON.stringify(params)
              }
            });
          },
          getBreak: function(params) {
            return $http.get('/api/getHotels', {
              headers: {
                "params": JSON.stringify(params)
              }
            });
          },
          Lhotels: function(params) {
            return $http.get('/api/getLhotels', {
              headers: {
                "params": JSON.stringify(params)
              }
            });
          },
          single: function(params) {
            return $http.get('/api/getSingleHotel', {
              headers: {
                "params": JSON.stringify(params)
              }
            });
          },
          deals: function() {
            return $http.get('/api/getDeals')
          },
          hotels: function(){
            return $http.get('/api/getDeals')
          },
          currencyRate: function(params){
            return $http.get('/api/getCurrencyRate',{
              headers: {
                "params": JSON.stringify(params)
              }
            })
          }
        }
  }
}());
