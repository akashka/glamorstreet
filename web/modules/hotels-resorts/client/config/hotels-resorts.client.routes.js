(function() {
    'use strict';

    angular
        .module('hotelsResorts.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('hotelsResorts', {
                url: '/hotels-resorts',
                templateUrl: '/views/' + CLIENT.name + '/modules/hotels-resorts/client/views/hotels-resorts.client.view.html',
                controller: 'hotelsResortsController'
            });
    }
}());
