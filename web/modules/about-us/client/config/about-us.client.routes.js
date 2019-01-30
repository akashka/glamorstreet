(function() {
    'use strict';

    angular
        .module('aboutUs.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('aboutUs', {
                url: '/about-us',
                templateUrl: '/views/' + CLIENT.name + '/modules/about-us/client/views/about-us.client.view.html',
                controller: 'aboutUsController'
            });
    }
}());
