(function() {
    'use strict';

    angular
        .module('cms')
        .controller('dealsController', dealsController);

    dealsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http',
      'dealsData', 'myDeals', 'toastr', 'heading', 'HEADING', 'HotelsServices', '$uibModal', 'CLIENT', 'Notification','hotelsList'];

    function dealsController($scope, Authentication, $rootScope, $http,
                             dealsData, myDeals, toastr, heading, HEADING, HotelsServices, $uibModal, CLIENT, Notification, hotelsList) {

      $rootScope.page = 'deals';
      $scope.myDeals = myDeals.data;
      $scope.showPanel = false;

      $scope.heading = heading.data ? heading.data : {'type': HEADING.deals};
      $scope.editing = false;

      $scope.hotelDeals = hotelsList.data.Hotel_Details;
      $scope.dataReceived = true;
      $scope.selectedDeals = [];
      _($scope.myDeals).forEach(function (value) {
        $scope.selectedDeals[value.position] = _.find($scope.hotelDeals, ['hotel_id', value.property_id]);
        if($scope.selectedDeals[value.position] != undefined){
          $scope.selectedDeals[value.position].image = value.image;
        }
      });

      $scope.togglePanel = function (currentPanel, editing) {
        $scope.editing = editing;
        $scope.deal = '';

        $scope.showPanel = true;
        $scope.currentPanel = currentPanel;
        if (editing) {
          $scope.editing = editing;
          $scope.deal = $scope.selectedDeals[currentPanel];
        }
      };

      $scope.setItem = function (item) {
        var image = $scope.deal.image;
        $scope.deal = item;
        $scope.deal.image = image;
      };

      $scope.add = function (deal) {
        var dealSelected = {
          property_id: deal.hotel_id,
          property_name: deal.hotel_name,
          image:deal.image,
          position: $scope.currentPanel
        };
        $http.post('/api/deals', dealSelected).success(function (res) {
          $scope.selectedDeals[$scope.currentPanel] = _.find($scope.hotelDeals, ['hotel_id', res.property_id]);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully!' });
          $scope.showPanel = false;
        })
      };

      $scope.update = function (deal) {
        var dealSelected = {
          property_id: deal.hotel_id,
          property_name: deal.hotel_name,
          image: deal.image,
          position: $scope.currentPanel
        };

        $http.put('/api/deals/' + $scope.currentPanel, dealSelected).success(function (res) {
          $scope.selectedDeals[$scope.currentPanel] = _.find($scope.hotelDeals, ['hotel_id', res.property_id]);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully!' });
          $scope.showPanel = false;
        })
      };

      $scope.openImageModal = function(currentPanel){
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
              return $scope.deal.image;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.deal.image = resultImage;
        });
      };

    }
}());
