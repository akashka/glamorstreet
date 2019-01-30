(function() {
    'use strict';

    angular
        .module('contact.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('contact', {
                url: '/contact-us',
                templateUrl: '/views/' + CLIENT.name + '/modules/contact/client/views/contact.client.view.html',
                controller: 'contactController',
                controllerAs: 'vm'
            });
    }
}());
