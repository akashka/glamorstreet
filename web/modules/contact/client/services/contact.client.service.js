(function () {
  'use strict';

  angular
    .module('contact.services')
    .factory('ContactServices', ContactServices);

  ContactServices.$inject = ['$resource', '$log'];

  function ContactServices($resource, $log) {

  }
}());
