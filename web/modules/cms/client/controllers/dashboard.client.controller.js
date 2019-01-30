(function() {
    'use strict';

    angular
        .module('cms')
        .controller('dashboardCmsController', dashboardCmsController);

    dashboardCmsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http'];

    function dashboardCmsController($scope, Authentication, $rootScope, $http) {
      $rootScope.page = 'dashboard';
    }
}());
