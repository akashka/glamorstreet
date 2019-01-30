(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', '$rootScope', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification',
    'CLIENT', '$http', 'patterns', '$cookieStore', '$cookies', '$auth' ];

  function AuthenticationController($scope, $state, $rootScope, UsersService, $location, $window, Authentication, PasswordValidator, Notification,
                                    CLIENT, $http, patterns, $cookieStore, $cookies, $auth) {
    var vm = this;
    $scope.patterns = patterns;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.signout = signout;
    vm.callOauthProvider = callOauthProvider;
    $scope.SuccessSignInFlag = false;
    $scope.SuccessSignOutFlag = false;


    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $rootScope.user = vm.authentication.user;
    }

    function signout() {
      UsersService.userSignout()
        .then(onUserSignOutSuccess)
        .catch(onUserSignOutError);
    }

    function signup(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }
      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }

      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }
      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks
    function onUserSignOutSuccess(response) {
      // If successful we assign the response to the global user model
      $rootScope.user = null;
      vm.authentication.user = null;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Sign Out successful!' });
      // And redirect to the previous or home page
      $state.go('homepage');
      $cookieStore.remove('sessionId');
      $cookieStore.remove('admin');
    }

    function onUserSignOutError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> SignOut Error!', delay: 6000 });
    }

    function onUserSignupSuccess(response) {
      if(response.Error){
        $scope.loginErrorFlag = true;
        $scope.loginErrorMessage = response.Error.ErrorMessage;
      }else{
        // If successful we assign the response to the global user model
        $rootScope.user = response;
        $rootScope.user.adminPermission = response.roles.indexOf("admin") > -1;
        vm.authentication.user = $rootScope.user;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
        // And redirect to the previous or home page
        if($state.current.name == 'authentication.signin' || $state.current.name == 'authentication.signup'){
          $state.go('user.manageBooking', { 'userId': $rootScope.user.userId });
        }else{
          $state.go($state.current.name || 'homepage', $state.previous.params);
        }
        $scope.SuccessSignOutFlag = true;
      }
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      if(response.Error){
        $scope.loginErrorFlag = true;
        $scope.loginErrorMessage = response.Error.ErrorMessage;
      } else{
        // If successful we assign the response to the global user model
        $rootScope.adminPermission = response.roles.indexOf("admin") > -1;
        if($rootScope.adminPermission){
          $cookieStore.put('admin', true);
        }else{
          $cookieStore.put('admin', false);
        }
        response.validAuth = true;
        vm.authentication.user = response;
        $rootScope.user = vm.authentication.user;
        var state = {
          userId: $rootScope.user.userId
        };

        var params = {
            headers: { "params": JSON.stringify(state) }
        };
        $scope.SuccessSignInFlag = true;
        Notification.info({ message: 'Welcome ' + response.firstName });
        // And redirect to the previous or home page
        if($state.current.name == 'authentication.signin' || $state.current.name == 'authentication.signup'){
          if(response.roles[0] == "admin"){
            $state.go('cms.dashboard');
          }
          else{
            $state.go('user.manageBooking', { 'userId': $rootScope.user.userId });
          }
        }else{
          $state.go($state.current.name || 'homepage', $state.previous.params);
        }
        $http.get('/api/getWalletDetails', params).success(function(res) {
          $rootScope.user.currency = res.currency;
          $rootScope.user.current_balance = res.current_balance;
          $rootScope.user.destinations = res.destinations;
          $rootScope.email_subscriptions = res.email_subscriptions;
          $rootScope.user.last_credit_amount = res.last_credit_amount;
          $rootScope.user.last_used_amount = res.last_used_amount;
        });
      }
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }

    //remove the cookie in browser before Hex login
    $cookieStore.remove('JSESSIONID');
    // to check the desk User is true
    $scope.deskUserValue = "1";
    $scope.deskUser = function(value){
      if(value == "2"){
        $scope.deskUserFlag = true;
      }else{
        $scope.deskUserFlag = false;
      }
    };

    vm.resetPassword = function(user) {
      user.forgotPassword = true; //setting forgetpassword default for true
      $http.get('/api/forgotPassword', { "params": user }).success(function(res) {
        if (res.Result != undefined) {
          $scope.resetMessage = true;
          $scope.resetError = false;
        } else if (res.Error != undefined) {
          $scope.resetError = true;
          $scope.resetMessage = false;
          $scope.resetErrorMeassege = res.Error.ErrorMessage;
        } else {

        }
      });
    };

    $scope.signinTrigger = true;
    $scope.signupTrigger = false;
    $scope.forgetPasswordflag = false;
    vm.gotoSignup = function(){
      $scope.signupTrigger = true;
      $scope.signinTrigger = false;
      $scope.forgetPasswordflag = false;
    };

    $scope.forgetPassword = function(){
      $scope.forgetPasswordflag = true;
      $scope.signupTrigger = false;
      $scope.signinTrigger = false;
    };

    $scope.back = function(){
      $scope.signinTrigger = true;
      $scope.forgetPasswordflag = false;
      $scope.signupTrigger = false;
    };

    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    //google and facebook login
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          var params = {
            headers: {"params": response.access_token}
          };

          if (provider == "facebook") {
            $http.get('/api/getFbLoginDetails', params).success(function (data) {
              if (data.email != undefined && data.email != "") {
                var sendUserData ={
                  email: data.email,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  mobileNo: (data.mobileNo)? data.mobileNo : " ",
                  address : (data.location)? data.location : " ",
                  profileImageURL: (data.picture)? data.picture.data.url:" "
                };
                $http.get('/api/socialSignin', {"params": sendUserData}).success(function (response) {
                  if (response.Error) {
                    $scope.loginErrorFlag = true;
                    $scope.loginErrorMessage = response.Error.ErrorMessage;
                  } else {
                    // If successful we assign the response to the global user model
                    response.adminPermission = response.roles.indexOf("admin") > -1;
                    vm.authentication.user = response;
                    $rootScope.user = vm.authentication.user;
                    Notification.info({message: 'Welcome ' + response.firstName});
                    // And redirect to the previous or home page
                    $state.go($state.current.name || 'homepage', $state.previous.params);
                    $scope.SuccessSignInFlag = true;
                  }
                });
              }
            });
          } else if (provider == "google") {
            $http.get('/api/getGoogleLoginDetails', params).success(function (data) {
              if (data.email != undefined && data.email != "") {
                var sendUserData ={
                  email: data.email,
                  firstName: data.given_name,
                  lastName: data.family_name,
                  mobileNo: (data.mobileNo)? data.mobileNo : " ",
                  address : (data.address)? data.address : " ",
                  profileImageURL: (data.picture)? data.picture:" "
                };
                $http.get('/api/socialSignin', {"params": sendUserData}).success(function (response) {
                  if (response.Error) {
                    $scope.loginErrorFlag = true;
                    $scope.loginErrorMessage = response.Error.ErrorMessage;
                  } else {
                    // If successful we assign the response to the global user model
                    response.adminPermission = response.roles.indexOf("admin") > -1;
                    vm.authentication.user = response;
                    $rootScope.user = vm.authentication.user;
                    Notification.info({message: 'Welcome ' + response.firstName});
                    // And redirect to the previous or home page
                    $state.go($state.current.name || 'homepage', $state.previous.params);
                    $scope.SuccessSignInFlag = true;
                  }
                });
              }


            });
          }

        });
    }

  }
}());
