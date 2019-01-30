(function () {
  'use strict';

  angular
    .module('hotels')
    .controller('mapsController', mapsController);

  mapsController.$inject = ['$scope', '$state', 'Authentication', '$uibModal', '$log', '$uibModalInstance', '$document', 'hotel', '$timeout'];

  function mapsController($scope, $state, Authentication, $uibModal, $log, $uibModalInstance, $document, hotel, $timeout ) {
    var $ctrl = this;
    $scope.hotel = hotel;

    // google maps start
    var cities = {
      hotel: hotel.hotel_name,
      desc: '',
      lat: JSON.parse(hotel.coordinates.latitude),
      long: JSON.parse(hotel.coordinates.longitude)
    };

    //Angular App Module and Controller
    var mapOptions = {
      center: new google.maps.LatLng(cities.lat, cities.long),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var infoWindow;



    var createMarker = function(info) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(info.lat, info.long),
        title: info.hotel
      });
      marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        infoWindow.open($scope.map, marker);
      });
      $scope.markers.push(marker);
    }
    $timeout(function() {
      $scope.map = new google.maps.Map(document.getElementById('map-popup'), mapOptions);
      $scope.markers = [];
      infoWindow = new google.maps.InfoWindow();
      createMarker(cities);
    }, 1000);

    $scope.openInfoWindow = function(e, selectedMarker) {
      e.preventDefault();
      google.maps.event.trigger(selectedMarker, 'click');
    };
    $ctrl.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

  }
}());
