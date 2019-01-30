(function () {
  'use strict';

  angular
    .module('users')
    .controller('favouriteHotelController', favouriteHotelController);

  favouriteHotelController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication',
    'Notification', '$rootScope', '$timeout', '$stateParams', 'FavouriteHotels', 'HotelsServices'];

  function favouriteHotelController($scope, $state, $http, $window, Authentication, Notification, $rootScope, $timeout, $stateParams, FavouriteHotels, HotelsServices) {
      $rootScope.usersPage = "favouriteHotel";
      $scope.dataReceived = false;

      FavouriteHotels.get($stateParams.userId).success(function (res) {
        var getFavouriteHotel = res[0]; //getting hotels from the database
        var n=1; // cutoff dates
        var today = new Date();
        $scope.params ={
          'checkin':  moment((new Date(today.getFullYear(), today.getMonth(), today.getDate() + n))).format("MM-DD-YYYY"),
            'checkout': moment((new Date(today.getFullYear(), today.getMonth(), today.getDate() + (n+1)))).format("MM-DD-YYYY")
        };
        HotelsServices.get( $scope.params).success(function(res) {
          var hotels = res.Hotel_Details; // getting hotels from the BE
          $scope.searchId = res.search_id; //copy searchId
          $scope.favouriteHotel =[];  // variable store the results
          for(var i=0; i<=getFavouriteHotel.hotel_id.length; i++){
            $scope.favouriteHotel[i] = _.find(hotels, {'hotel_id': getFavouriteHotel.hotel_id[i]}); // finding the each hotel in hotels
          }
          $scope.favouriteHotel = _.without($scope.favouriteHotel, undefined);
          $scope.dataReceived = true;
        });

        // Function to remove favourite hotel from the list of user's favourite hotel
        $scope.removeFavouriteHotel = function(hotelId){
          _.remove(getFavouriteHotel.hotel_id, function (hotel) {
            return hotel === hotelId;
          });
          delete getFavouriteHotel._id;
          FavouriteHotels.put(getFavouriteHotel, getFavouriteHotel.user_id).success(function (res) {
            $scope.getFavouriteHotel = res;
            _.remove($scope.favouriteHotel, function (hotel) {
              return hotel.hotel_id === hotelId;
            });
          });
        };


      });
    }
}());
