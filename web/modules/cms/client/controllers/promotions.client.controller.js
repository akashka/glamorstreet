(function() {
    'use strict';

    angular
        .module('cms')
        .controller('promotionsController', promotionsController);

    promotionsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Promos', 'toastr', 'HEADING', 'heading', '$uibModal', 'CLIENT'];

    function promotionsController($scope, Authentication, $rootScope, $http, Promos, toastr, HEADING, heading, $uibModal, CLIENT) {

      Promos.get().success(function (res) {
        $scope.promos = res;
      });
      
      $rootScope.page = 'promotion';
      $scope.rightSectionVisibility = false;
      $scope.heading = heading.data ? heading.data : {'type': HEADING.promotions};
      $scope.promot = {};

      $scope.addPromo = function(){
        $scope.rightSectionVisibility = true;
        $scope.promot = {
           _id: null,
           position: ($scope.promos.length + 1),
           default: "",
           large: "",
           medium: "",
           small: "",
           portrait: ""
        };
        $scope.editing = false;
      };

      $scope.editPromo = function(_id){
        $scope.rightSectionVisibility = true;
        $scope.promot = _.find($scope.promos, ['_id', _id]);
        $scope.editing = true;
      };

      $scope.savePromo = function () {
        Promos.post($scope.promot).success(function (res) {
          $scope.promos.push(res);
          $scope.rightSectionVisibility = false;
          $scope.promot = {};
          toastr.success('Saved Successfully');
        });
      };

      $scope.updatePromo = function () {
        Promos.put($scope.promot, $scope.promot._id).success(function (res) {
          for(var i = 0; i < $scope.promos.length; i++){
            if($scope.promos[i]._id === res._id){
              $scope.promos[i] = res;
              break;
            }
          }
          $scope.rightSectionVisibility = false;
          $scope.promot = {};
          toastr.success('Updated Successfully');
        });
      };

      $scope.openImageModal = function(imageType){
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
              return $scope.promot[imageType];
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.promot[imageType] = resultImage;
        });
      };

    }
}());
