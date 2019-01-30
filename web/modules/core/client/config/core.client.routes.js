
(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'CLIENT'];

  function routeConfig($stateProvider, $urlRouterProvider, CLIENT) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('switch-off-maintenance', {
        url: '/switch-off-maintenance',
        templateUrl: '/views/' + CLIENT.name + '/modules/core/client/views/400.client.view.html',
        controller: 'switchOffMaintenanceController',
        controllerAs: 'vm',
        data: {
          ignoreState: true,
          pageTitle: 'Maintenance is being switched off'
        }
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/views/' + CLIENT.name + '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Not Found',
          meta: {
            'title': CLIENT.name + ' | Oops, File Not Found'
          }
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/views/' + CLIENT.name + '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Bad Request',
          meta: {
            'title': CLIENT.name + ' | Oops, Bad Request'
          }
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/views/' + CLIENT.name + '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      });
  }
}());
