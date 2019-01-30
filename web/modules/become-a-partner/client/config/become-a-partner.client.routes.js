(function() {
    'use strict';

    angular
        .module('becomePartner.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('becomePartner', {
                url: '/become-a-partner',
                templateUrl: '/views/' + CLIENT.name + '/modules/become-a-partner/client/views/become-a-partner.client.view.html',
                controller: 'becomePartnerController'
            });
    }
}());
