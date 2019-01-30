(function () {
  'use strict';

  angular
    .module('users')
    .controller('loginModalInstanceCtrl', loginModalInstanceCtrl);

  loginModalInstanceCtrl.$inject = ['$scope', '$state', 'Authentication', '$uibModalInstance', '$http',
    '$stateParams', '$rootScope', '$cookieStore', '$window',];

  function loginModalInstanceCtrl($scope, $state, Authentication, $uibModalInstance, $http,
                                  $stateParams, $rootScope, $cookieStore, $window ) {
    var $ctrl = this;


    $ctrl.forgotPassword = function() {
      $scope.setFlag = true;
      $scope.resetErrorMeassege = '';
    };
    $ctrl.logIn = function() {
      $scope.setFlag = false;
      $scope.message = '';
    };
    $ctrl.LoginAuth = function(user) {

      $ctrl.loginParam = {
        emailId: user.emailId,
        password: user.password
      };

      // Buyer Login
      $http.get('/api/buyerLogin', { "params": $ctrl.loginParam }).success(function(res) {
        $rootScope.loginAuth = res;
        $cookieStore.put('validUser', false);
        sessionStorage.UserName = $rootScope.loginAuth.email;
        if (user.emailId == $rootScope.loginAuth.email && $rootScope.loginAuth.user_id) {
          $cookieStore.put('validUser', true);
          $cookieStore.put('username', $rootScope.loginAuth.first_name);
          $cookieStore.put('userId', $rootScope.loginAuth.user_id);
          $rootScope.validUser = $cookieStore.get('validUser');
          $uibModalInstance.dismiss('cancel');
        } else if (res.Error != undefined) {
          $cookieStore.put('validUser', false);
          $scope.message = res.Error.ErrorMessage;
        }

      })

    };
    $ctrl.resetPassword = function(user) {
      user.forgotPassword = true; //setting forgetpassword default for true
      $http.get('/api/forgotPassword', { "params": user }).success(function(res) {

        if (res.Result != undefined) {
          $scope.resetMessage = true;
        } else if (res.Error != undefined) {
          $scope.resetMessage = false;
          $scope.resetErrorMeassege = res.Error.ErrorMessage;
        } else {

        }
      });
    };

    $ctrl.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          var params = {
            headers: { "params": response.access_token }
          };

          if (provider == "facebook") {
            $http.get('/api/getFbLoginDetails', params).success(function(data) {
              if (data.email != undefined && data.email != "") {
                $rootScope.loginAuth = data;
                $cookieStore.put('validUser', false);
                sessionStorage.UserName = data.email;
                $cookieStore.put('validUser', true);
                $cookieStore.put('username', data.first_name);
                $cookieStore.put('userId', data.user_id);
                $rootScope.validUser = $cookieStore.get('validUser');
              }
              $uibModalInstance.dismiss('cancel');
              $window.location.reload();

            });
          } else if (provider == "google") {
            $http.get('/api/getGoogleLoginDetails', params).success(function(data) {
              if (data.email != undefined && data.email != "") {
                $rootScope.loginAuth = data;
                $rootScope.loginAuth.first_name = data.given_name;
                $cookieStore.put('validUser', false);
                sessionStorage.UserName = data.email;
                $cookieStore.put('validUser', true);
                $cookieStore.put('username', data.given_name);
                $cookieStore.put('userId', data.user_id);
                $rootScope.validUser = $cookieStore.get('validUser');
              }
              $uibModalInstance.dismiss('cancel');
              $window.location.reload();

            });
          }
        });
    };
  }
}());
