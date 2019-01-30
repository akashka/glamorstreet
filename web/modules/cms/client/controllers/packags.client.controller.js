(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsPackagsController', cmsPackagsController);

    cmsPackagsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http',
      'Packags', 'toastr', '$uibModal', 'CLIENT', 'PackagsServices', 'HEADING', 'heading', 'selectedPackags'];

    function cmsPackagsController($scope, Authentication, $rootScope, $http,
                                 Packags, toastr, $uibModal, CLIENT, PackagsServices, HEADING, heading, selectedPackags) {

      var days = 50;
      var today = new Date();
      var params = {
        checkin: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        checkout: new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)
      };
      $scope.guest = {
        rooms: 1,
        adults: 2
      };

      PackagsServices.getPackags(params).success(function(res) {
          $scope.allPackags = res.Packages;
          $scope.packags = _.uniqBy($scope.allPackags);
      });

      $scope.rightSectionVisibility = false;
      $scope.currentIndex = 1;
      $scope.selectedPackag = {};
      $scope.myPackags = [];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.packags};

      _(selectedPackags.data).forEach(function (packag) {
        $scope.myPackags[packag.position] = _.find(selectedPackags.data, {'_id': packag._id});
      });

      $scope.addPackag = function(sectionIndex){
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = sectionIndex;
        $scope.editing = false;
      };

      $scope.editPackag = function(packagSectionIndex){
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = packagSectionIndex;
        $scope.selectedPackag.id = $scope.myPackags[packagSectionIndex].id;
        $scope.selectedPackag.image = $scope.myPackags[packagSectionIndex].image;
        $scope.editing = true;
      };

      $scope.savePackag = function () {
        var selectedPackag= {
          package_id: $scope.selectedPackag.id,
          position: $scope.currentIndex,
          description: $scope.selectedPackag.description,
          image: $scope.selectedPackag.image
        };

        Packags.post(selectedPackag).success(function (res) {
          $scope.myPackags[$scope.currentIndex] = res;
          $scope.rightSectionVisibility = false;
          $scope.selectedPackag = {};
          toastr.success('Saved Successfully');
        });
      };

      $scope.updatePackag = function () {
        var selectedPackag = {
          package_id: $scope.selectedPackag.id,
          position: $scope.currentIndex,
          description: $scope.selectedPackag.description,
          image: $scope.selectedPackag.image
        };

        Packags.put(selectedPackag, $scope.myPackags[$scope.currentIndex]._id).success(function (res) {
          $scope.myPackags[$scope.currentIndex] = res;
          $scope.rightSectionVisibility = false;
          $scope.selectedPackag = {};
          toastr.success('Updated Successfully');
        });
      };

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
              return $scope.selectedPackag.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.selectedPackag.image = resultImage;
        });
      };
    }
}());
