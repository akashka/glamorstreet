(function () {
  'use strict';

  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'CLIENT'];

  function routeConfig($stateProvider, CLIENT) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: '/views/' + CLIENT.name + '/modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chat'
        }
      });
  }
}());
