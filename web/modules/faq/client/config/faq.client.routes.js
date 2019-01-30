(function() {
    'use strict';

    angular
        .module('faq.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('faq', {
                url: '/faq',
                templateUrl: '/views/' + CLIENT.name + '/modules/faq/client/views/faq.client.view.html',
                controller: 'faqController'
            });
    }
}());
