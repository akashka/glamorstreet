(function() {
  'use strict';

  angular
    .module('packags')
    .controller('viewPackagController', viewPackagController);

  viewPackagController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'HotelsServices', 'PackagsServices', '$stateParams', '$state', '$cookieStore', '$timeout', 'Calculate', 'ngMeta', 'CLIENT', 'MetaTagsServices'];

  function viewPackagController($scope, Authentication, $rootScope, $http, HotelsServices, PackagsServices, $stateParams, $state, $cookieStore, $timeout, Calculate, ngMeta, CLIENT, MetaTagsServices) {

    $rootScope.dataReceived = false;
    $scope.packageNotAvalable = false;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    // Get the checkin and checkin dates. Set to get the packages for next 50 days.
    var days = 50;
    var today = new Date();
    var params = {
      checkin: $stateParams.checkin ? $stateParams.checkin : (new Date(today.getFullYear(), today.getMonth(), today.getDate())),
      checkout: $stateParams.checkout ? $stateParams.checkout : (new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)),
      rooms: $stateParams.rooms ? $stateParams.rooms : 1,
      adults: $stateParams.adults ? $stateParams.adults : 2,
      ratePlanId: $stateParams.ratePlanId ? $stateParams.ratePlanId : '',
      roomId: $stateParams.roomId ? $stateParams.roomId : '',
      package: $stateParams.package ? $stateParams.package : ''
    };
    $scope.packageID = $stateParams.package_id;
    $scope.checkin = params.checkin;
    $scope.checkout = params.checkout;

    if ($stateParams.package_id != null && $stateParams.package_id != undefined)
      params.packageId = $stateParams.package_id;

    $scope.guest = {
      rooms: $stateParams.rooms ? $stateParams.rooms : 1,
      adults: $stateParams.adults ? $stateParams.adults : 2
    };

    $timeout(function() {
      (CLIENT.name == "staydilly") ? window.scrollTo(0, 320): "";
    }, 1000);

    HotelsServices.get(params).success(function(res) {
      if (res) $scope.searchId = res.search_id;
    });

    PackagsServices.getPackags(params).success(function(res) {
      if (res) $scope.dataReceived = true;
      if(!res.Packages) $scope.packageNotAvalable = true;
      if (res.Packages) {
        $scope.packag = _.find(res.Packages, { 'package_id': Number($stateParams.package_id) });
        if (!$scope.packag) $scope.packageNotAvalable = true;
        $scope.checkin = $stateParams.checkin ? $stateParams.checkin : (new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
        $scope.checkout = $stateParams.checkout ? $stateParams.checkout : (new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 2));

        //meta tags Starts
        ngMeta.setTitle($scope.packag.package_name);
        ngMeta.setTag('description', $scope.packag.description);
        ngMeta.setTag('keywords', "");
        //meta tags Ends
      } else { $scope.noPackag = true; }

    });
  }
}());
