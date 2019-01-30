(function() {
  'use strict';
angular
  .module('cms')
  .controller('ImageUploadController', ImageUploadController);

ImageUploadController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'toastr',
  '$timeout', '$uibModalInstance', 'image'];

function ImageUploadController($scope, Authentication, $rootScope, $http, toastr,
 $timeout, $uibModalInstance, image ) {


  $scope.myImage = image;
  $scope.myCroppedImage='';
  $scope.cropType="rectangle";
  $scope.setArea=function(value){
    $scope.cropType=value;
  };
  function handleFileSelect(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.myImage=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  }

  $timeout(function(){
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
  }, 3000);

  $scope.selectFile = function(){
    angular.element(document.querySelector('#fileInput')).click();
  };

  $scope.saveImage = function(){
    $uibModalInstance.close($scope.myCroppedImage);
  };

  $scope.saveOriginalImage = function(){
    $uibModalInstance.close($scope.myImage);
  };
  }
}());
