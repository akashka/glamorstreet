(function() {
    'use strict';

    angular
        .module('cms')
        .controller('locationsController', locationsController);

    locationsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http',
      'allCities', 'selectedLocations', 'Locations', 'toastr', 'HEADING', 'heading', '$uibModal', 'CLIENT', 'Notification'];

    function locationsController($scope, Authentication, $rootScope, $http,
                                 allCities, selectedLocations, Locations, toastr, HEADING, heading, $uibModal, CLIENT, Notification) {

      $rootScope.page = 'locations';
      $scope.allCities = allCities.data.locations;
      $scope.locations = _.uniqBy($scope.allCities, 'state_id');

      $scope.rightSectionVisibility = false;
      $scope.currentIndex = 1;
      $scope.selectedLocation = {};
      $scope.myLocations = [];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.locations};

      _(selectedLocations.data).forEach(function (location) {
        $scope.myLocations[location.position] = _.find(selectedLocations.data, {'state_id': location.location_id});
      });

      $scope.addLocation = function(sectionIndex){
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = sectionIndex;
        $scope.editing = false;
      };

      $scope.editLocation = function(locationSectionIndex, locationId){
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = locationSectionIndex;
        $scope.selectedLocation.id = $scope.myLocations[locationSectionIndex].state_id;
        $scope.selectedLocation.image = $scope.myLocations[locationSectionIndex].image;
        $scope.selectedLocation._id = locationId;
        $scope.editing = true;
      };

      $scope.saveLocation = function () {
        $scope.duplicateflag = false;
        for (var LocationIndex = 1; LocationIndex < $scope.myLocations.length; LocationIndex++) { //checking for duplication
          if ($scope.myLocations[LocationIndex] != undefined && $scope.myLocations[LocationIndex] != null &&
                    $scope.myLocations[LocationIndex].location_id == $scope.selectedLocation.id) {
            $scope.duplicateflag = true;
          }
        }
        if (!$scope.duplicateflag) {
          var selectedLocation= {
            location_id: $scope.selectedLocation.id,
            position: $scope.currentIndex,
            description: $scope.selectedLocation.description,
            image: $scope.selectedLocation.image
          };
          Locations.post(selectedLocation).success(function (res) {
            $scope.myLocations[$scope.currentIndex] = res;
            var stateName = _.find($scope.allCities, {'state_id': $scope.myLocations[$scope.currentIndex].location_id});
            $scope.myLocations[$scope.currentIndex].state = stateName.state;
            $scope.rightSectionVisibility = false;
            $scope.selectedLocation = {};
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully!'});
          });
        }
      };

      $scope.updateLocation = function () {
        $scope.duplicateflag = false;
        for (var LocationIndex = 1; LocationIndex < $scope.myLocations.length; LocationIndex++) { //checking for duplication
          if ($scope.myLocations[LocationIndex] != undefined && $scope.myLocations[LocationIndex] != null
            && $scope.myLocations[LocationIndex].location_id == $scope.selectedLocation.id &&
            $scope.myLocations[LocationIndex]._id != $scope.selectedLocation._id) {
            $scope.duplicateflag = true;
          }
        }
        if (!$scope.duplicateflag) {
          var selectedLocation = {
            location_id: $scope.selectedLocation.id,
            position: $scope.currentIndex,
            description: $scope.selectedLocation.description,
            image: $scope.selectedLocation.image
          };
          Locations.put(selectedLocation, $scope.myLocations[$scope.currentIndex]._id).success(function (res) {
            $scope.myLocations[$scope.currentIndex] = res;
            var stateName = _.find($scope.allCities, {'state_id': $scope.myLocations[$scope.currentIndex].location_id});
            $scope.myLocations[$scope.currentIndex].state = stateName.state;
            $scope.rightSectionVisibility = false;
            $scope.selectedLocation = {};
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully!'});
          });
        }
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
              return $scope.selectedLocation.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.selectedLocation.image = resultImage;
        });
      };
    }
}());
