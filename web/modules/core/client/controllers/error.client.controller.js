(function () {
  'use strict';

  angular
    .module('core')
    .controller('ErrorController', ErrorController);

  ErrorController.$inject = ['$scope','message', '$uibModalInstance'];

  function ErrorController($scope, message, $uibModalInstance) {
    $scope.message = message;
    if(message.success!= false){
      $scope.SucceMessage = true;
    } else{
      $scope.errorMessage = true;
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());

