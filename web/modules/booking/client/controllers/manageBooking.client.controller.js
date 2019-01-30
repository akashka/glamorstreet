(function() {
    'use strict';

    angular
        .module('booking')
        .controller('manageBookController', manageBookController);

    manageBookController.$inject = ['$scope', 'Authentication', '$rootScope',
      '$http', '$stateParams','$timeout', '$state'];

    function manageBookController($scope, Authentication, $rootScope,
                                  $http, $stateParams, $timeout, $state) {

      $rootScope.usersPage = "manageBookings";
      $scope.dataReceived = false;
      $scope.pagination = {
        currentPage: 1,
        maxSize: 5,
        itemsPerPage: 10
       };



      $scope.pageChanged = function() {
        $scope.bookDetils = [];
        $scope.totalItems = $scope.bookDeatils.length;
        $scope.pagination.totalItem = 0;

        $scope.startNum = ($scope.pagination.itemsPerPage * ($scope.pagination.currentPage - 1));
        $scope.endNum = ($scope.startNum + $scope.pagination.itemsPerPage) > $scope.pagination.totalItems ? ($scope.totalItems) : ($scope.startNum + $scope.pagination.itemsPerPage);
        $scope.pagination.totalItem = $scope.totalItems;

        for (var i = $scope.startNum; i < $scope.endNum; i++) {
          if($scope.bookDeatils[i] != undefined || $scope.bookDeatils[i] != null ){
            $scope.bookDetils.push($scope.bookDeatils[i]);
          }
        }
      };

      function stringToDate(_date, _format, _delimiter) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = ['sunday', 'monday', 'tuesday', 'wednesday','thursday','friday','saturday'];
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        var responseDate = {
          'dd': formatedDate.getDate(),
          'day':day[formatedDate.getDay()],
          'mm': months[formatedDate.getMonth()],
          'mmm': fullMonths[formatedDate.getMonth()],
          'yy': formatedDate.getFullYear()
        };
        return responseDate;
      }

      var params = {
        headers: { "params": JSON.stringify($stateParams) }
      };

      $http.get('/api/manageBook', params).success(function(res) {
        $scope.bookDeatils = res.Bookings;
        for(var i = 0; i < $scope.bookDeatils.length; i++){
          $scope.bookDeatils[i].CheckIn = $scope.bookDeatils[i].check_in;
          $scope.bookDeatils[i].CheckOut = $scope.bookDeatils[i].check_out;
          // Storing original format before change the values
          var Today = moment(new Date()).format("DD/MM/YYYY");
          var lastDate = moment(moment(Today, "DD/MM/YYYY")).isAfter(moment($scope.bookDeatils[i].CheckOut, "DD/MM/YYYY"));
          if(lastDate){  // checking eligibility for Show Book Again
            $scope.bookDeatils[i].validToRebook = true;
          }else{
            $scope.bookDeatils[i].validToRebook = false;
          }
          $scope.bookDeatils[i].check_in = stringToDate($scope.bookDeatils[i].check_in, 'dd/mm/yyyy', '/');
          $scope.bookDeatils[i].check_out = stringToDate($scope.bookDeatils[i].check_out, 'dd/mm/yyyy', '/');
          $scope.bookDeatils[i].booking_date = $scope.bookDeatils[i].booking_date.substr(0,10);
          $scope.bookDeatils[i].booking_date = stringToDate($scope.bookDeatils[i].booking_date, 'dd/mm/yyyy', '/');
        }
        $scope.allBookDeatils = angular.copy($scope.bookDeatils);
        $scope.chargingLength = (_.filter($scope.allBookDeatils, {status: "Charging"})).length;
        $scope.abortedLength = (_.filter($scope.allBookDeatils, {status: "Aborted"})).length;
        $scope.cancelledLength = (_.filter($scope.allBookDeatils, {status: "Cancelled"})).length;
        $scope.confirmedLength = (_.filter($scope.allBookDeatils, {status: "Confirmed"})).length;
        $scope.chargedLength = (_.filter($scope.allBookDeatils, {status: "Charged"})).length;
        $scope.dataReceived = true;
        $scope.pageChanged();
      });

      $scope.filter = function(type){
        $scope.bookDeatils = (type != "all") ? _.filter($scope.allBookDeatils, {status: type}) : $scope.allBookDeatils;
        $scope.pageChanged();
      };

      //book again function
      $scope.BookAgain = function(data){
          var today = new Date();
          var n =1;
          var checkIn = moment(today, "DD/MM/YYYY").add(n, 'days');
          var checkOut = moment(today, "DD/MM/YYYY").add(n+1, 'days');
          var par = {bookingRefId :data.booking_id};
            var params = {
              headers: { "params": JSON.stringify(par) }
            };
            $http.get('/api/getBookingDetails', params).success(function(res) {
              var getBookDetails = res;
              var result = {
                url: getBookDetails.hotelId,
                searchId: getBookDetails.searchId,
                productId: getBookDetails.hotelId,
                checkin: checkIn.format("MM-DD-YYYY"),
                checkout: checkOut.format("MM-DD-YYYY"),
                rooms: getBookDetails.noOfRooms,
                adults: getBookDetails.adults
              };
              $state.go('view', result);
            });


      }
    }
}());
