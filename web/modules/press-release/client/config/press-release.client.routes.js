(function() {
    'use strict';

    angular
        .module('pressRelease.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('pressMedia', {
                url: '/press-media',
                templateUrl: '/views/' + CLIENT.name + '/modules/press-release/client/views/press-release.client.view.html',
                controller: 'pressReleaseController'
            })
            .state('pressRelease', {
                url: '/press-release',
                templateUrl: '/views/' + CLIENT.name + '/modules/press-release/client/views/press-release.client.view.html',
                controller: 'pressReleaseController'
            });
    }
}());
