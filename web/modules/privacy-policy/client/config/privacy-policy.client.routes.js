(function() {
    'use strict';

    angular
        .module('privacyPolicy.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('privacyPolicy', {
                url: '/privacy-policy',
                templateUrl: '/views/' + CLIENT.name + '/modules/privacy-policy/client/views/privacy-policy.client.view.html',
                controller: 'privacyPolicyController'
            });
    }
}());
