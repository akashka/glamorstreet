(function() {
    'use strict';

    angular
        .module('booking')
        .controller('bookingDetailsController', bookingDetailsController);

    bookingDetailsController.$inject = ['$scope', 'Authentication', '$rootScope',
      '$http', '$stateParams', '$timeout', '$location', '$state'];

    function bookingDetailsController($scope, Authentication, $rootScope,
                                  $http, $stateParams, $timeout, $location, $state) {

      var params = {
        headers: { "params": JSON.stringify($stateParams) }
      };

      $rootScope.urlPath = $location.path();

      $http.get('/api/getBookingDetails', params).success(function(res) {
        $scope.bookingDetails = res;
        var today = new Date();
        var dd = today.getDate() + 2;
        var mm = today.getMonth() + 1; //January is 0!
        dd =((dd+"").length == 1)? ("0" + dd): dd;
        mm =((mm+"").length == 1)? ("0" + mm): mm;
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        if (today <= $scope.bookingDetails.checkInDate) {
          $scope.setModifyflag = true;
        } else {
          $scope.setModifyflag = false;
        }

        var ciDate = stringToDate($scope.bookingDetails.checkInDate, "dd/MM/yyyy", "/");
        var coDate = stringToDate($scope.bookingDetails.checkOutDate, "dd/MM/yyyy", "/");
        $scope.bookingDetails.checkInDay = findDay(ciDate);
        $scope.bookingDetails.checkInMonth = findMonth(ciDate);
        $scope.bookingDetails.checkInYear = findYear(ciDate);
        $scope.bookingDetails.checkOutDay = findDay(coDate);
        $scope.bookingDetails.checkOutMonth = findMonth(coDate);
        $scope.bookingDetails.checkOutYear = findYear(coDate);
        $scope.bookingDetails.cost = Math.round((($scope.bookingDetails.totalAmount).toFixed(2) - ($scope.bookingDetails.serviceTax).toFixed(2) -
          ($scope.bookingDetails.appliedPromoCode).toFixed(2)) * 100 / 100);
      });

      function stringToDate(_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
      }

      function stringToDate2(_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split("/");
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        var formatedDate = month + '-' + dateItems[dayIndex] + "-" + dateItems[yearIndex];
        return formatedDate;
      }

      var findDay = function(inputDate) {
        return (inputDate.getDate());
      };

      var findMonth = function(inputDate) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (monthNames[inputDate.getMonth()]);
      };

      var findYear = function(inputDate) {
        return (inputDate.getFullYear());
      };

      $scope.cancelConfirm = function(val) {

        $scope.refId = val;

        $scope.opts = {
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          templateUrl: 'cancelConfirm.html',
          controller: cancelConfirmCtrl,
          resolve: {} // empty storage
        };


        $scope.opts.resolve.item = function() {
          return angular.copy({ refId: $scope.refId }); // pass name to Dialog
        }

        var modalInstance = $uibModal.open($scope.opts);

        modalInstance.result.then(function() {

          //on ok button press
        }, function() {
          //on cancel button press

        });
      };

      $scope.modify = function() {
        // to get search Id
        var getsearchId = {
          checkIn: $scope.bookingDetails.checkInDate,
          checkOut: $scope.bookingDetails.checkOutDate,
          checkInDate: stringToDate2($scope.bookingDetails.checkInDate, "dd-MM-yyyy", "-"),
          checkOutDate: stringToDate2($scope.bookingDetails.checkOutDate, "dd-MM-yyyy", "-"),
          searchId: $scope.bookingDetails.searchId,
          hotelId: $scope.bookingDetails.hotelId,
          rooms: $scope.bookingDetails.noOfRooms,
          adults: $scope.bookingDetails.adults,
          referenceId: $scope.bookingDetails.refrenceId
        };

        if (getsearchId.searchId == 0) {
          var params = {
            headers: { "params": JSON.stringify(getsearchId) }
          };

          $http.get('/api/getBookedHoteldetail', params).success(function(res) {
            getsearchId.searchId = res.search_id;
            var result = {
              url: getsearchId.hotelId,
              searchId: getsearchId.searchId,
              productId: getsearchId.hotelId,
              checkin: getsearchId.checkInDate,
              checkout: getsearchId.checkOutDate,
              rooms: getsearchId.rooms,
              adults: getsearchId.adults,
              referenceId: getsearchId.referenceId
            };
            $state.go('view', result);

          });
        } else {
          var result = {
            url: getsearchId.hotelId,
            searchId: getsearchId.searchId,
            productId: getsearchId.hotelId,
            checkin: getsearchId.checkInDate,
            checkout: getsearchId.checkOutDate,
            rooms: getsearchId.rooms,
            adults: getsearchId.adults,
            referenceId: getsearchId.referenceId
          };
          $state.go('view', result);
        }

      };
      // calling API with referenceId


      $rootScope.popupAlert = function() {
        $("#success-alert").alert();
      };
    }
}());
