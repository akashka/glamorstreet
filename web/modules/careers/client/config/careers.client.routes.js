(function() {
    'use strict';

    angular
        .module('careers.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('careers', {
                url: '/careers',
                templateUrl: '/views/' + CLIENT.name + '/modules/careers/client/views/careers.client.view.html',
                controller: 'careersController'
            });
    }}());
