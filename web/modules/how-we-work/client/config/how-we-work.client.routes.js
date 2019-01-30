(function() {
    'use strict';

    angular
        .module('howWeWork.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('howWeWork', {
                url: '/how-we-work',
                templateUrl: '/views/' + CLIENT.name + '/modules/how-we-work/client/views/how-we-work.client.view.html',
                controller: 'howWeWorkController'
            });
    }
}());
