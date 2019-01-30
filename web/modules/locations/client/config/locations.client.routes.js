(function() {
    'use strict';

    angular
        .module('locations.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('locations', {
                url: '/locations?location?stateId?country?checkin?checkout?rooms?adults?deal?propertyType?promo',
                templateUrl: '/views/' + CLIENT.name + '/modules/locations/client/views/locations.client.view.html',
                controller: 'locationsController',
                controllerAs: 'vm',
                data: {
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Locations'
                  }
                }
            })
            .state('viewLocation', {
                url: '/locations/:url?searchId?productId?location?checkin?checkout?rooms?adults?promo',
                templateUrl: '/views/' + CLIENT.name + '/modules/locations/client/views/viewLocation.client.view.html',
                controller: 'viewLocationController',
                controllerAs: 'vm'
              })
    }
}());
