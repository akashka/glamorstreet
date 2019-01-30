(function () {
  'use strict';

  angular
    .module('users')
    .controller('referAFriendController', referAFriendController);

  referAFriendController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication',
    'Notification', '$rootScope', '$timeout', '$stateParams', 'patterns'];

  function referAFriendController($scope, $state, $http, $window, Authentication, Notification, $rootScope, $timeout, $stateParams, patterns) {
    $rootScope.usersPage = "refarAFriend";
    $scope.patterns = patterns;
    $scope.refer = function(userData) {
      var referalParams = {
          userId: $rootScope.user.userId,
          referalEmail: userData.email
      };
      var params = {
        headers: { "params": JSON.stringify(referalParams) }
      };
      $http.get('/api/referAFriend', params).success(function(res) {
        $scope.refferd = res.reffered;
        if ($scope.refferd) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Referred Successfully!' });
          $scope.user.refarelEmail = null; // making input value null
          $scope.refferedSuccess = true; // refereed your friend
        } else {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong!' });
        }
      });
    }
  }
}());
