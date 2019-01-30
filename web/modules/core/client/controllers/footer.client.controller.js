(function() {
  'use strict';

  angular
    .module('core')
    .controller('footerController', footerController);

  footerController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', '$rootScope', 'Newsletter', '$uibModal', 'CLIENT'];

  function footerController($scope, $state, Authentication, $stateParams, $rootScope, Newsletter, $uibModal, CLIENT) {

    var maxDate = new Date(2020, 5, 22);

    $scope.clear = function() {
      $scope.startDate = null;
    };

    var n = 1; //number of days to add (cutoff days).
    var today = new Date();
    var sd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
    var ed = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (n + 1));

    $rootScope.startDate = $stateParams.checkin ? new Date(strToDate($stateParams.checkin)) : sd;
    $rootScope.endDate = $stateParams.checkout ? new Date(strToDate($stateParams.checkout)) : ed;
    $rootScope.guest = {
      rooms: $stateParams.rooms ? $stateParams.rooms : 1,
      adults: $stateParams.adults ? $stateParams.adults : 2
    };

    // Function to send the newsletter
    $scope.newsletter = {};
    $scope.isDuplicate = false;
    $scope.submitNewsletter = function(){
      Newsletter.get().success(function (response) {
        var newsletter = _.find(response, { 'emailId': $scope.newsletter.emailId });
        $scope.isDuplicate = (newsletter != undefined && newsletter != null) ? true : false;
        if(!$scope.isDuplicate){
          $scope.newsletter.signup_date = new Date();
          Newsletter.post($scope.newsletter).success(function (response) {
            // Call popup
            $scope.openImageModal = function(reciveMessage){
              var $ctrl = this;
              var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title-bottom',
                ariaDescribedBy: 'modal-body-bottom',
                templateUrl: '/views/' + CLIENT.name + '/modules/core/client/views/modals/ErrorSuccessModel.client.html',
                size: 'sm',
                controller: "ErrorController",
                resolve: {
                  'message': function(){
                    return reciveMessage;
                  }
                }
              });
            };
            if(response._id != undefined && response._id != null){
              $scope.SuccErrmessage = {
                "success": true,
                "message":"Your are Successfully Registered to our News Letter"
              };
              $scope.openImageModal($scope.SuccErrmessage);
            }
          });
        }
      });

    }


  }
}());
