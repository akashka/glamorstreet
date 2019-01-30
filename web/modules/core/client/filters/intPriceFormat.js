(function() {
    'use strict';

    angular
        .module('core')

    .filter('intPriceFormat', function() {
        return function(input) {
            return input ? input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
        }
    })
}());