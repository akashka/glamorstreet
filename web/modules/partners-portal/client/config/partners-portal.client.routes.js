(function() {
    'use strict';

    angular
        .module('partnerPortal.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('partnerPortal', {
                url: '/partners-portal',
                templateUrl: '/views/' + CLIENT.name + '/modules/partners-portal/client/views/partners-portal.client.view.html',
                controller: 'partnerPortalController'
            });
    }
}());
