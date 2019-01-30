(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsMaintenanceDataController', cmsMaintenanceDataController);

    cmsMaintenanceDataController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'Maintenance', '$location', '$window'];

    function cmsMaintenanceDataController($scope, Authentication, $rootScope, $http, Notification, $uibModal, CLIENT, Maintenance, $location, $window) {
      $rootScope.page = "Maintenance";
      $scope.dataLoader = false;
      $scope.maintenance = {};
      Maintenance.get().success(function (response) {
        $scope.maintenance = (response.length > 0)? response[0] : {};
      });

      // Function to update maintenance to the database
      $scope.updateMaintenance = function(){
        var _id = $scope.maintenance._id;
        delete $scope.maintenance._id;
        if(_id != undefined && _id != null){
          Maintenance.put($scope.maintenance, _id).success(function (res) {
           if(res){
             Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully' });
             $scope.dataLoader = true;
             $scope.maintenance = res;
             $location.path( "/" );
             $window.location.reload();
           }else{
             Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong. Try Again!!' });
             $scope.dataLoader = true;
             $location.path( "/" );
             $window.location.reload();
           }
          });
        }
      };

    }
}());
