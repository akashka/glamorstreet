(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserDetailsController', UserDetailsController);

  UserDetailsController.$inject = ['$scope', '$rootScope', 'patterns', '$stateParams', '$http', '$timeout', 'CLIENT', 'Notification', 'Users', 'UsersPage'];

  function UserDetailsController($scope, $rootScope, patterns, $stateParams, $http, $timeout, CLIENT, Notification, Users, UsersPage) {
    $scope.dataReceived = true;
    $rootScope.usersPage = "profileDetails";

    $timeout(function() {
      (CLIENT.name == 'staydilly') ? window.scrollTo(0, 130) : "";
    }, 100);

    $scope.locations = [];
    _($rootScope.locations).forEach(function(loc){
      if(loc.city_id != -1) $scope.locations.push(loc.city);
    });

    $scope.editProfile= false;
    $scope.editUser = function(){
      $scope.editProfile= true;
    };
    $scope.profileUser = function(){
      $scope.editProfile= false;
    };

    $scope.patterns = patterns;
    var params = {
      headers: { "params": JSON.stringify($stateParams) }
    };

    $scope.updateUser = function(userUpdate) {
      $scope.selectedUser = _.find(Users.data, ['userId', Number(userUpdate.user_id)]);
      $scope.selectedUser.firstName = userUpdate.first_name;
      $scope.selectedUser.last_name = userUpdate.last_name;
      $scope.selectedUser.displayName = userUpdate.first_name +' ' + userUpdate.last_name;
      var user_id = $scope.selectedUser._id;
      delete $scope.selectedUser._id;
      UsersPage.put($scope.selectedUser, user_id).success(function (res) { //updating user name in database
      if(res){
        userUpdate.walletLog = [];
        $http.post('/api/updateUserProfile', userUpdate).success(function(res) {
          if(res.result){
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Profile Updated Successfully!' });
            $scope.editProfile= false;
          }else{
            Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong. Try Again!!' });
          }
        });
      }
      });

    }
  }
}());
