(function() {
    'use strict';

    angular
        .module('help.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('help', {
                url: '/help',
                templateUrl: '/views/' + CLIENT.name + '/modules/help/client/views/help.client.view.html',
                controller: 'helpController',
                data: {
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Help',
                    'description': 'This is designed to appeal to bots',
                    'keywords': ''
                  }
                }
            })
            .state('travel-forum', {
                url: '/travel-forum',
                templateUrl: '/views/' + CLIENT.name + '/modules/help/client/views/help.client.view.html',
                controller: 'helpController',
                data: {
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Travel Forum',
                    'description': 'This is designed to appeal to bots',
                    'keywords': ''
                  }
                }
            });
    }
}());
