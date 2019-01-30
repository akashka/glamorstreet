(function() {
    'use strict';

    angular
        .module('cms')
        .controller('hotelsCmsController', hotelsCmsController);

    hotelsCmsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'hotelsData'];

    function hotelsCmsController($scope, Authentication, $rootScope, $http, hotelsData) {
      $rootScope.page = 'hotels';
      $scope.hotels = hotelsData.data;
    }
}());
