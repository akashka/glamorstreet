(function () {
  'use strict';

  angular
    .module('homepage.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'CLIENT'];

  function routeConfig($stateProvider, CLIENT) {
    $stateProvider
      .state('homepage', {
        url: '/',
        templateUrl: '/views/' + CLIENT.name + '/modules/homepage/client/views/homepage.client.view.html',
        controller: 'HomePageController',
        controllerAs: 'vm'
      })
      .state('index', {
        url: '/index.html',
        templateUrl: '/views/' + CLIENT.name + '/modules/homepage/client/views/homepage.client.view.html',
        controller: 'HomePageController',
        controllerAs: 'vm'
      });
  }
}());
