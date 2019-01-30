(function() {
    'use strict';

    angular
        .module('booking')
        .controller('bookingErrorController', bookingErrorController);

    bookingErrorController.$inject = ['$scope', 'Authentication', '$rootScope', '$stateParams', 'GoogleAdWordsService', '$timeout', 'BookingServices', 'OrderDetails'];

    function bookingErrorController($scope, Authentication, $rootScope, $stateParams, GoogleAdWordsService, $timeout, BookingServices, OrderDetails) {
      $rootScope.dataReceived = false;

          $timeout(function() {
            window.scrollTo(0, 130);
          }, 100);

          $scope.orderId = $stateParams.orderId;

            // Enter in local Databse
         OrderDetails.get().success(function (response) { 
                $scope.data = _.find(response, {"refrenceId": $scope.orderId});
                if($scope.data != null && $scope.data != undefined){
                    $scope.data.status = "Error";
                    OrderDetails.put($scope.data, $scope.data._id).success(function (response) { });
                }
         });   

    }
}());