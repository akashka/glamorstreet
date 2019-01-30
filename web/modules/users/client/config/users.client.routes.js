(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'CLIENT'];

  function routeConfig($stateProvider, CLIENT) {
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.user', {
        url: '/user',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/settings/edit-user.client.view.html',
        controller: 'EdituserController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/settings/change-user-picture.client.view.html',
        controller: 'ChangeuserPictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        reloadOnSearch: false,
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      })
      .state('user', {
        url: '/user/:userId',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/user.client.view.html',
        controller: 'userController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          Users: function (UsersPage) {
            return UsersPage.get();
          }
        }
      })
      .state('user.profile', {
        url: '/profile/:userId',
        controllerAs: 'vm',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/profile.client.view.html',
        controller: 'UserDetailsController',
        resolve: {
          Users: function (UsersPage) {
            return UsersPage.get();
          }
        }
      })
      .state('user.favouriteHotels', {
        url: '/favouriteHotels/:userId',
        controllerAs: 'vm',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/favourite-hotels.client.view.html',
        controller: 'favouriteHotelController'
      })
      .state('user.changePassword', {
        url: '/changePassword/:userId',
        controllerAs: 'vm',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/change-password.client.view.html',
        controller: 'changePasswordController'
      })
      .state('user.referAFriend', {
        url: '/referAFriend/:userId',
        controllerAs: 'vm',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/refer-friend.client.view.html',
        controller: 'referAFriendController'
      })
      .state('user.wallet', {
        url: '/wallet/:userId',
        controllerAs: 'vm',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/admin/wallet.client.view.html',
        controller: 'walletController'
      });

  }
}());
