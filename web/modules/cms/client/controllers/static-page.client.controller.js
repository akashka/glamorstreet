  (function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsStaticPagesController', cmsStaticPagesController);

    cmsStaticPagesController.$inject = ['$scope', 'Authentication',  'StaticPage', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT'];

    function cmsStaticPagesController($scope, Authentication, StaticPage, $rootScope, $http, Notification, $uibModal, CLIENT) {
      $rootScope.page = "staticPages";

      $scope.data = null;

      StaticPage.get().success(function (res) {
        $scope.pages = res;
        $scope.changeScreen($scope.pages[0].screen, 0);
      });

      // Function to save the data. (Checks whether data is too be saved or updated)
      $scope.save = function(){
        var data = _.find($scope.pages, {'screen': $scope.data.screen});
        if (data == null || data == undefined) createPage();
        else updatePage();
      };

      // Function to create and add the content on server
      function createPage() {
        var selectedpage= {
          description: $scope.data.description,
          screen: $scope.data.screen,
          image: $scope.data.image,
          displayimage: $scope.data.displayimage,
          image_heading: $scope.data.image_heading
        };
        StaticPage.post(selectedpage, selectedpage.screen).success(function (res) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully' });
          Notification.success('Saved Successfully');
        });
      };

      // Function to update the content on the server
      function updatePage() {
        var selectedpage = {
          description: $scope.data.description,
          screen:$scope.data.screen,
          image: $scope.data.image,
          displayimage: $scope.data.displayimage,
          image_heading: $scope.data.image_heading
        };

        StaticPage.put(selectedpage, $scope.oldScreen).success(function (res) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully' });
        });
      };

      // Function to change the screen
      $scope.changeScreen = function(screenName, index){
        $scope.activeBtn = index;
        $scope.data = _.find($scope.pages, {'screen': screenName});
        $scope.oldScreen = screenName;
      };

      // Function to add new Page
      $scope.addNewPage = function(){
        $scope.data = {
          screen: "New Screen",
          description: "",
          image: null,
          displayimage: false,
          image_heading: ""
        };
      };

      // Function to upload image
      $scope.openImageModal = function(){
        var $ctrl = this;
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/models/imageUploadModal/imageUploadModal.html',
          size: 'lg',
          controller: "ImageUploadController",
          resolve: {
            'image': function(){
              return $scope.data.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.data.image = resultImage;
        });
      };

    }
}());
