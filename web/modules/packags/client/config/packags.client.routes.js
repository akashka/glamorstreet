(function() {
    'use strict';

    angular
        .module('packags.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('packags', {
                url: '/packages',
                templateUrl: '/views/' + CLIENT.name + '/modules/packags/client/views/packags.client.view.html',
                controller: 'packagsController',
                controllerAs: 'vm'
            })
            .state('amex', {
                url: '/amex',
                templateUrl: '/views/' + CLIENT.name + '/modules/packags/client/views/amex.client.view.html',
                controller: 'packagsController',
                controllerAs: 'vm'
            })
            .state('viewPackag', {
                url: '/viewpackages?package_id?checkin?checkout?rooms?adults?promo?noOfDays?ratePlanId?price?roomId?package?',
                templateUrl: '/views/' + CLIENT.name + '/modules/packags/client/views/ViewPackag.client.view.html',
                controller: 'viewPackagController',
                controllerAs: 'vm'
              })
    }
}());
