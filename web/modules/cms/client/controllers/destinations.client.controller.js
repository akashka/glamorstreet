(function() {
    'use strict';

    angular
        .module('cms')
        .controller('destinationsCmsController', destinationsCmsController);

    destinationsCmsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'toastr', 'heading', 'HEADING', 'CLIENT',
                              'Destinations', '$uibModal', 'allCities', 'selectedLocations', 'Notification'];

    function destinationsCmsController($scope, Authentication, $rootScope, $http, toastr, heading, HEADING, CLIENT,
                              Destinations, $uibModal, allCities, selectedLocations, Notification) {

      $rootScope.page = 'destinations';
      $scope.allCities = allCities.data.locations;
      if(CLIENT.name == 'staydilly'){
        $scope.allCities = _.map(_.uniqBy($scope.allCities, 'state_id'));
      }
      $scope.destinations = [];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.destinations};
      $scope.rightSectionVisibility = false;
      $scope.destinationSuccessfulUpdate = false;
      $scope.editing = false;
      $scope.count = 0;

      // Carousel
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      Destinations.get().success(function (res) {
          $scope.destinations = res;
      });

      $scope.editImage = function(index){
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
              return $scope.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.destination.images[index] = resultImage;
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
              return $scope.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.destination.images.push(resultImage);
        });
      };

      $scope.openMapImageModal = function(){
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
              return $scope.destination.map;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.destination.map = resultImage;
        });
      };

      $scope.editDestination = function(city){
        $scope.rightSectionVisibility = true;
        $scope.editing = true;
        $scope.dest = {
          city: city.city,
          city_id: city.city_id,
          state: city.state,
          address: city.country,
          images: [],
          description: "",
          map: null,
          distance_from: null
        };
        $scope.destination = {map : null};
        var dest = _.find($scope.destinations, ['city', city.city]);
        $scope.destination = (dest != undefined) ? dest: $scope.dest;
      };

      $scope.updateDestination = function () {
        $scope.destinationSuccessfulUpdate = true;
        if(_.find($scope.destinations, ['city', $scope.destination.city]) != undefined){
            var destinationId = $scope.destination._id;
          delete $scope.destination._id;
          Destinations.put($scope.destination, destinationId).success(function (res) {
            $scope.destination = res;
            for(var i = 0; i < $scope.destinations.length; i++){
              if($scope.destinations[i].city_id == res.city_id)
              $scope.destinations[i] = res;
              break;
            }
            $scope.rightSectionVisibility = false;
            $scope.destinationSuccessfulUpdate = false;
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully' });
          })
        }
        else{
          $scope.saveDestination();
        }
      };

      $scope.saveDestination = function () {
        // $scope.destination.distance_from = $scope.distance_from;
        Destinations.post($scope.destination).success(function (res) {
          $scope.destination = res;
          $scope.destinations.push(res);
          $scope.destinationSuccessfulUpdate = true;
          $scope.rightSectionVisibility = false;
          $scope.destinationSuccessfulUpdate = false;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully' });
        })
      };
    }
}());
