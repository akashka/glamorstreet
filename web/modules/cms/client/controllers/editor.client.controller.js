(function() {
    'use strict';

    angular
        .module('cms')
        .controller('editorController', editorController);

    editorController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'css', 'Notification'
      ];

    function editorController($scope, Authentication, $rootScope, $http,
        css, Notification) {
      $rootScope.page = 'editor';
      $scope.css = css.data;

      $scope.update = function () {
        var css = $scope.css.replace(/"/g, "'");
        $http.post('/api/css', {css: css}).success(function (res) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully!' });
          $scope.updated = res.updated;
          $scope.css = res.file;
        })
      }
    }
}());
