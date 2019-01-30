(function () {
  'use strict';

  angular
    .module('homepage.services')
    .factory('HomepageServices', HomepageServices);

  HomepageServices.$inject = ['$resource', '$log'];

  function HomepageServices($resource, $log) {

  }
}());
