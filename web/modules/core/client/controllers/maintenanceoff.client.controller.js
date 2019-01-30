(function() {
    'use strict';

    angular
        .module('core')
        .controller('switchOffMaintenanceController', switchOffMaintenanceController);

    switchOffMaintenanceController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'Maintenance', '$location', '$window'];

    function switchOffMaintenanceController($scope, Authentication, $rootScope, $http, Notification, $uibModal, CLIENT, Maintenance, $location, $window) {
      $scope.maintenance = {};
      Maintenance.get().success(function (response) { 
        $scope.maintenance = (response.length > 0)? response[0] : {};      
        if($scope.maintenance.display_maintenance) {
          $scope.maintenance.display_maintenance = false;
          $scope.updateMaintenance();
        }
        else{
          $location.path( "/" );
          $window.location.reload();
        }
      });

      // Function to update maintenance to the database
      $scope.updateMaintenance = function(){
        var _id = $scope.maintenance._id;
        if(_id != undefined && _id != null){
          Maintenance.put($scope.maintenance, _id).success(function (res) {
           if(res){
             Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully' });
             $location.path( "/" );
             $window.location.reload();
           }else{
             Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong. Try Again!!' });
             $location.path( "/" );
             $window.location.reload();
           }
          });
        }
      };

    }
}());
