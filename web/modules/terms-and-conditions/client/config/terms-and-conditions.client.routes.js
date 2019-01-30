(function() {
    'use strict';

    angular
        .module('termsConditions.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('termsConditions', {
                url: '/terms-and-conditions',
                templateUrl: '/views/' + CLIENT.name + '/modules/terms-and-conditions/client/views/terms-and-conditions.client.view.html',
                controller: 'termsConditionsController'
            });
    }
}());
