(function() {
    'use strict';

    angular
        .module('addons.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('addons', {
              url: '/experiences',
              templateUrl: '/views/' + CLIENT.name + '/modules/experiences/client/views/experiences.client.view.html',
              controller: 'addonsController'
            })
            .state('viewAddon', {
              url: '/viewExperiences/:addonId',
              templateUrl: '/views/' + CLIENT.name + '/modules/experiences/client/views/viewExperience.client.view.html',
              controller: 'viewAddonsController'
            })
    }
}());
