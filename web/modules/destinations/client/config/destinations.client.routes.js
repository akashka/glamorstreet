(function() {
    'use strict';

    angular
        .module('destinations.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('destinations', {
              url: '/destinations',
              templateUrl: '/views/' + CLIENT.name + '/modules/destinations/client/views/destinations.client.view.html',
              controller: 'destinationsController',
              controllerAs: 'vm'
            })
            .state('viewDestination', {
              url: '/destinations/:destinationId',
              templateUrl: '/views/' + CLIENT.name + '/modules/destinations/client/views/viewDestination.client.view.html',
              controller: 'viewDestinationController',
              controllerAs: 'vm'
            })
    }
}());
