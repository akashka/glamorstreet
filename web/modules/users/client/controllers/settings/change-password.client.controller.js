(function () {
  'use strict';

  angular
    .module('users')
    .controller('changePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification',
     '$rootScope', '$timeout'];

  function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, Notification,
                                    $rootScope, $timeout) {
    $scope.passwordUpdated = false;
    $rootScope.usersPage = "changePassword";
    $scope.updatepassword = function(updatePass) {
      if(updatePass.newPassword != updatePass.confirmPassword){
        $scope.newPasswordsMatching = true;
      }else{
        updatePass.emailId = $rootScope.user.email;
        var params = {
          headers: { "params": JSON.stringify(updatePass) }
        };
        $http.get('/api/updateUserPassword', params).success(function(res) {
          if (res.Result != undefined) {
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Updated Successfully!' });
            $scope.updatePass = {};
            $scope.passwordUpdated = true; // show message on successful update.
          } else if (res.Error != undefined) {
            $scope.errorMeassege = res.Error.ErrorMessage;
            Notification.error({ message: $scope.errorMeassege, title: '<i class="glyphicon glyphicon-remove"></i> Password update error!' });
          } else {
            $scope.errorMeassege = res.Error.ErrorMessage;
            Notification.error({ message: $scope.errorMeassege, title: '<i class="glyphicon glyphicon-remove"></i> Password update error!' });
          }

        });
      }

    }
  }
}());
