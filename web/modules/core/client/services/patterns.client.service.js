(function() {
    'use strict';

    // Create the Socket.io wrapper service
    angular
        .module('core')
        .factory('patterns', Socket);

    Socket.$inject = ['Authentication', '$state', '$timeout'];

    function Socket(Authentication, $state, $timeout) {
      return({
        ALNUM: '^[0-9a-zA-Z]+$',
        ALNUMWITHAMPSPACE: '^[0-9a-zA-Z& ]+$',
        ALNUMSPACE: '^[ a-zA-Z0-9]+$',
        ALPHA: '^[a-zA-Z]+$',
        NUM: '^[0-9]+$',
        MOBILE: '^([0|\+[0-9]{0,15})?([0-9])$',
        EMAIL: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
        WEB: '[a-z0-9.-]+\.[a-z]{2,4}$',
        DECIMAL: '^[0-9]+(\.[0-9]{1,5})?$',
        PASSWORD: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        USERNAME: '^[0-9a-z&]+$',
        FLOAT: '^[0-9]+(\.[0-9]+)?$'
      });
    }
}());
