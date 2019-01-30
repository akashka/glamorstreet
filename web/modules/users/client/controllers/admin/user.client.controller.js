(function () {
  'use strict';

  angular
    .module('users')
    .controller('userController', userController);

  userController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', '$http', '$stateParams','$rootScope', '$uibModal', 'CLIENT', 'Users', 'UsersPage'];

  function userController($scope, $state, $window, Authentication, Notification, $http, $stateParams,$rootScope, $uibModal, CLIENT, Users, UsersPage) {
    var vm = this;
    $scope.dataReceived = false;
    $scope.profileImageURL = null; // setting profile image URL to null.

    var params = {
      headers: { "params": JSON.stringify($stateParams) }
    };
    $http.get('/api/getWalletDetails', params).success(function(res) {
      $rootScope.userDeatails = res;
      $scope.selectedUser = _.find(Users.data, ['userId', Number($rootScope.userDeatails.user_id)]);
      $scope.profileImageURL = $scope.selectedUser.profileImageURL; //adding profile image;
      $scope.dataReceived = true;
    });
    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    //updating user profile picture to the database
    $scope.updateUserProfilePicture = function(profileImageURL){
      // Function to update user profile to the database
        $scope.selectedUser = _.find(Users.data, ['userId', Number($rootScope.userDeatails.user_id)]);
        $scope.selectedUser.profileImageURL= $rootScope.userDeatails.profileImageURL = profileImageURL; //adding profile image;
        var user_id = $scope.selectedUser._id;
        delete $scope.selectedUser._id;
        UsersPage.put($scope.selectedUser, user_id).success(function (res) {
          if(res){
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Profile Image Updated Successfully' });
            for(var i=0; i<Users.data.length; i++){
              if(res.userId === Users.data[i].userId){
                Users.data[i] = res;
                break;          // update the view with latest
              }
            }
          }else{
            Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong. Try Again!!' });
          }
        });
    };


    $scope.openImageModal = function(){
      var $ctrl = this;
      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: '/views/' + CLIENT.name + '/modules/users/client/views/imageUploadModal/imageUploadModal.html',
        size: 'lg',
        controller: "ImageUploadController",
        resolve: {
          'image': function(){
            return $scope.profileImageURL;
          }
        }
      });

      modalInstance.result.then(function (resultImage) {
        $scope.profileImageURL = resultImage;
        $scope.updateUserProfilePicture($scope.profileImageURL);
      });
    };
  }
}());
