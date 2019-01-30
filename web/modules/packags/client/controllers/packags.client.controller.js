(function() {
    'use strict';

    angular
        .module('packags')
        .controller('packagsController', packagsController);

    packagsController.$inject = ['$scope', 'Authentication', '$rootScope', 'PackagsServices', '$stateParams', '$window', '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location', 'CLIENT', 'ngMeta', 'MetaTagsServices'];

    function packagsController($scope, Authentication, $rootScope, PackagsServices, $stateParams, $window, $http, $filter, $uibModal, $timeout, Calculate,$location, CLIENT, ngMeta, MetaTagsServices) {

      $timeout(function() {
        (CLIENT.name == "staydilly") ? window.scrollTo(0, 120) : "";
         (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 1000);

      // Display the number of items in a page (Pagination)
      $scope.itemsPerPage = (CLIENT.name == "traveler.mv") ? 10 : 50;
      $scope.maxSize = 3;
      $scope.totalItems = 0;
      $scope.currentPage = 1;
      $scope.noPackagsTrave = false;

      // Get the checkin and checkin dates. Set to get the packages for next 50 days.
      var days = 10;
      var today = new Date();
      var params = {
        checkin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        checkout: new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)
      };
      $scope.guest = {
        rooms: $stateParams.rooms ? $stateParams.rooms : 1,
        adults: $stateParams.adults ? $stateParams.adults : 2
      };

      $rootScope.dataReceived = false;

      PackagsServices.getPackags(params).success(function(res) {
        $rootScope.dataReceived = res ? true : false;
        if (res.Packages) {
          var packags = res.Packages;
          // checkout should be difference of 4 days.
          for (var i=0; i<packags.length; i++){
            packags[i].checkin = moment().add(1, 'd').format('MM-DD-YYYY');
            packags[i].checkout = moment(packags[i].checkin).add(packags[i].no_of_days, 'd').format('MM-DD-YYYY');
          }
          $scope.minPrice = Math.min.apply(Math, packags.map(function(o) { return o.price; }));
          $scope.maxPrice = Math.max.apply(Math, packags.map(function(o) { return o.price; }));
          $scope.slider = {
            min: Number($scope.minPrice.toFixed(2)) - 1,
            max: Number($scope.maxPrice.toFixed(2)) + 1,
            options: {
              floor: Number($scope.minPrice.toFixed(2)) - 1,
              ceil: Number($scope.maxPrice.toFixed(2)) + 1
            }
          };

          //checking for amex packages for traveller.mv
          $scope.allPackags=[];
          $scope.packagsList=[];
          var amexPackages = [19735,19736,19731,19586,19732,19730,19733,19734];
          if (location.pathname == '/amex') {
            var packagesAmex=[];
            _(amexPackages).forEach(function(val) {
              packagesAmex.push(_.find(packags, { 'package_id': val }));
            });
            var packagesAmexCopy=[];
            for(var i=0; i<packagesAmex.length; i++){
              if(packagesAmex[i] != undefined){
                packagesAmexCopy.push(packagesAmex[i]);
              }
            }
            $scope.allPackags = packagesAmexCopy;
            $scope.packagsList = packagesAmexCopy;
            $scope.totalPackags = packagesAmexCopy.length;
          } else {
            $scope.allPackags=packags;
            if (amexPackages) {
              for (var i = 0; i < amexPackages.length; i++) {
                _.remove($scope.allPackags, function(currentObject) {
                    return currentObject.package_id === amexPackages[i];
                });
              }
            }
            $scope.packagsList = $scope.allPackags;
            $scope.totalPackags = $scope.allPackags.length;
          }
          if($scope.allPackags!=""){
            $scope.noPackagsTrave = false;
          }else {
            $scope.noPackagsTrave = true;
          }
          $scope.pageChanged();
          //meta tags Starts
          ngMeta.setTitle("Packages for " + CLIENT.capitalizeName);
          ngMeta.setTag('description', "Enjoy the best package from " + CLIENT.capitalizeName);
          ngMeta.setTag('keywords', "");
          //meta tags Ends
          //to call meta tags for this page
        } else {
          $scope.noPackagsTrave = true;
        }
      });

      $scope.pageChanged = function() {
        $scope.packags = [];
        $scope.totalItems = $scope.allPackags.length;
        $scope.startNum = ($scope.itemsPerPage * ($scope.currentPage - 1));
        $scope.endNum = ($scope.startNum + $scope.itemsPerPage) > $scope.totalItems ? ($scope.totalItems) : ($scope.startNum + $scope.itemsPerPage);
        $scope.totalItem = $scope.totalItems;
        for (var i = $scope.startNum; i < $scope.endNum; i++) {
          $scope.packags.push($scope.allPackags[i]);
        }
      };

      $scope.onFilterChange = function() {
        $scope.allPackags = angular.copy($scope.packagsList);
        $scope.onPriceChange();
        $scope.pageChanged();
      };

      $scope.onPriceChange = function() {
          for (var h = 0; h < $scope.allPackags.length; h++) {
            if (Number($scope.allPackags[h].price) < $scope.slider.min || Number($scope.allPackags[h].price) > $scope.slider.max) {
              $scope.allPackags.splice(h, 1);
              h--;
            }
          }
      };

      $scope.changeSort = function(sort, flag){
        if(sort == 'price'){
          $scope.allPackags.sort(function(a, b){
            return a.price-b.price
          })
        }
        else if (sort == 'name'){
          $scope.allPackags.sort(function(a, b){
            if (a.package_name < b.package_name) //sort string ascending
                return -1;
            if (a.package_name > b.package_name)
                return 1;
            return 0;
          })
        }
        else{
          $scope.allPackags.sort(function(a, b){
            return a.hotel_id-b.hotel_id
          })
        }
        // Reverse the array if flag = true
        if(flag == true) $scope.allPackags.reverse();
        $scope.pageChanged();
      };

      $scope.changeSlide = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
      };

      // Carousel
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      $scope.$watch(function () { return $scope.slider.min }, function (obj) {
        if (obj != null) {
          $scope.onFilterChange();
        }
      }, true);

      $scope.$watch(function () { return $scope.slider.max }, function (obj) {
        if (obj != null) {
          $scope.onFilterChange();
        }
      }, true);

      MetaTagsServices.metaTagHeader();
    }
}());
