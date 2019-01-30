(function() {
    'use strict';

    angular
        .module('hotels')
        .controller('locationHotelsCtrl', locationHotelsCtrl);

  locationHotelsCtrl.$inject = ['$scope', 'Authentication', '$rootScope', 'HotelsServices',
    '$stateParams', '$window', '$http', '$filter', '$uibModal', '$timeout', 'CLIENT', 'FavouriteHotels'];

    function locationHotelsCtrl($scope, Authentication, $rootScope, HotelsServices,
    $stateParams, $window, $http, $filter, $uibModal, $timeout, CLIENT, FavouriteHotels) {
      var params = {};
      $http.get('/api/getLocations').success(function (res) {
        $scope.locationList = res.locations;
        if ($stateParams.city != '' && $stateParams.city != null && $stateParams.city != undefined) {
          $stateParams.city = ($stateParams.city).replace(/\-/g, ' ');
          for (var i = 0; i < $scope.locationList.length; i++) {
            if (($scope.locationList[i].city).toLowerCase() == ($stateParams.city).toLowerCase()) {
              params = {"location": $scope.locationList[i].city_id};
              break;
            }
          }
        } else if ($stateParams.stateId != '' && $stateParams.stateId != null && $stateParams.stateId != undefined) {
          $stateParams.stateId = ($stateParams.stateId).replace(/\-/g, ' ');
          for (var i = 0; i < $scope.locationList.length; i++) {
            if (($scope.locationList[i].state).toLowerCase() == ($stateParams.stateId).toLowerCase()) {
              params = {"stateId": $scope.locationList[i].state_id};
              break;
            }
          }
        } else if ($stateParams.country != '' && $stateParams.country != null && $stateParams.country != undefined) {
          $stateParams.country = ($stateParams.country).replace(/\-/g, ' ');
          for (var i = 0; i < $scope.locationList.length; i++) {
            if (($scope.locationList[i].country).toLowerCase() == ($stateParams.country).toLowerCase()) {
              params = {"country": $scope.locationList[i].country_id};
              break;
            }
          }
        }


        $timeout(function () {
          (CLIENT.name == "staydilly") ? window.scrollTo(0, 50) : "";
          (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
        }, 1000)


        $rootScope.dataReceived = false;
        HotelsServices.Lhotels(params).success(function (res) {

          var listHotels, gridHotels;
          if (res) {
            $rootScope.dataReceived = true;
            $scope.searchId = res.search_id;
          }

          var n = 1; //number of days to add (cutoff days).
          var today = new Date();
          var sd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
          var ed = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (n + 1));

          $rootScope.startDate = $stateParams.checkin ? new Date(strToDate($stateParams.checkin)) : sd;
          $rootScope.endDate = $stateParams.checkout ? new Date(strToDate($stateParams.checkout)) : ed;
          // default checkin and checkout dates

          $scope.checkin = moment().add(1, 'd').format('MM-DD-YYYY');
          $scope.checkout = moment().add(2, 'd').format('MM-DD-YYYY');


          $scope.guest = {
            rooms: 1,
            adults: 2,
            nights: 1
          };

          if (res.Hotel_Details) {
            var hotels = res.Hotel_Details;
            listHotels = hotels;
            gridHotels = chunk(listHotels, 2);
            $scope.totalHotels = hotels.length;
          } else {
            $scope.noHotels = true;
          }

          // assigning variables to send as
          // params in navigation
          $scope.location = $stateParams.location;
          $scope.promo = $stateParams.promo;

          function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
              newArr.push(arr.slice(i, i + size));
            }
            return newArr;
          }

          var amenities = {
            "Clothes Rack / Wardrobe": {
              icon: '6.png',
              text: 'Clothes Rack / Wardrobe'
            },
            "Air Conditioning": {
              icon: '5.png',
              text: 'Air Conditioning'
            },
            "Carpeted": {
              icon: '7.png',
              text: 'Carpeted'
            },
            "Fan": {
              icon: '9.png',
              text: 'Fan'
            },
            "Iron": {
              icon: '12.png',
              text: 'Iron'
            },
            "Safe": {
              icon: '15.png',
              text: 'Safe'
            },
            "Television": {
              icon: '19.png',
              text: 'Television'
            },
            "Bathtub": {
              icon: '25.png',
              text: 'Bathtub'
            },
            "Shower": {
              icon: '26.png',
              text: 'Shower'
            },
            "Hairdryer": {
              icon: '29.png',
              text: 'Hairdryer'
            },
            "DVD Player": {
              icon: '41.png',
              text: 'DVD Player'
            },
            "Satellite Channels": {
              icon: '47.png',
              text: 'Satellite Channels'
            },
            "Telephone": {
              icon: '48.png',
              text: 'Telephone'
            },
            "Dining Area in Room": {
              icon: '61.png',
              text: 'Dining Area in Room'
            },
            "Electric Kettle": {
              icon: '65.png',
              text: 'Electric Kettle'
            },
            "Minibar": {
              icon: '68.png',
              text: 'Minibar'
            },
            "Kitchenette": {
              icon: 'Kitchenette.png',
              text: 'Kitchenette'
            },
            "Microwave": {
              icon: '71.png',
              text: 'Microwave'
            },
            "Refrigerator": {
              icon: '72.png',
              text: 'Refrigerator'
            },
            "Tea/Coffee Maker": {
              icon: '73.png',
              text: 'Tea/Coffee Maker'
            },
            "Coffee Machine / Espresso Machine": {
              icon: '.png',
              text: 'Coffee Machine / Espresso Machine'
            },
            "Room Service": {
              icon: '76.png',
              text: 'Room Service'
            },
            "Breakfast in the Room": {
              icon: '77.png',
              text: 'Breakfast in the Room'
            },
            "Designated Smoking Area": {
              icon: '84.png',
              text: 'Designated Smoking Area'
            },
            "Swimming Pool": {
              icon: '85.png',
              text: 'Swimming Pool'
            },
            "Gymnasium": {
              icon: '86.png',
              text: 'Gymnasium'
            },
            "Concierge Services": {
              icon: '88.png',
              text: 'Concierge Services'
            },
            "ATM On Site": {
              icon: '94.png',
              text: 'ATM On Site'
            },
            "Kid's Club": {
              icon: '114.png',
              text: "Kid's Club"
            },
            "Restaurant": {
              icon: '115.png',
              text: 'Restaurant'
            },
            "Bar": {
              icon: '117.png',
              text: 'Bar'
            },
            "BBQ Facilities": {
              icon: '121.png',
              text: 'BBQ Facilities'
            },
            "Beachfront": {
              icon: '128.png',
              text: 'Beachfront'
            },
            "Spa": {
              icon: '129.png',
              text: 'Spa'
            },
            "Disable Friendly": {
              icon: '144.png',
              text: 'Disable Friendly'
            },


            "Wifi": {
              icon: 'icon_set_1_icon-7',
              text: 'Free Wifi'
            },
            "Wi-Fi (Complimentary)": {
              icon: 'wifi.png',
              text: 'Free Wifi'
            },
            "bed": {
              icon: 'icon_set_2_icon-115',
              text: '1 Double or 2 Single Beds'
            },
            // "breakfast": {
            //     icon: 'icon_set_3_restaurant-6',
            //     text: 'Free breakfast'
            // },
            "room": {
              icon: 'icon_set_1_icon-64',
              text: '1 Double or 2 Single Rooms'
            },
            "AC": {
              icon: 'icon-air',
              text: 'Ac'
            },
            'Tea Maker': {
              icon: 'icon_set_3_restaurant-8',
              text: 'Tea/Coffee Maker'
            },
            "Phone": {
              icon: 'icon_set_1_icon-90',
              text: 'Phone'
            }
          };

          var stars = ['rating.gif', 'rating.gif', 'rating.gif', 'rating.gif', 'rating.gif'];

          $scope.amIcon = function (am) {
            return amenities[am] ? amenities[am].icon : '';
          };

          $scope.amText = function (am) {
            return amenities[am] ? amenities[am].text : '';
          };

          $scope.getStars = function (number) {
            var index = Math.round(number) - 1;
            return stars[index];
          };

          $scope.changeView = function (view) {
            $scope.view = view;
            if (view == 'grid') {
              $scope.hotels = gridHotels;
            } else {
              $scope.hotels = listHotels;
            }
          };

          $scope.changeView('list');
          $scope.changeSlide = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
          };
          // Carousel
          $scope.myInterval = 5000;
          $scope.noWrapSlides = false;
          $scope.active = 0;


          $http.get('/api/getLocations').success(function (res) {

            $scope.loca = res.locations;

          });

          // Function to get the Favourite hotels, if the user is logged in
          if($rootScope.user != undefined && $rootScope.user != null){
            FavouriteHotels.get($rootScope.user.userId).success(function (res) {
              $scope.favouriteHotel = res[0];
            });
          }

          // Function to check if the hotel is an favourite hotel list of the logged in user
          $scope.checkFavourite = function(hotel_id){
            if($scope.favouriteHotel != undefined && $scope.favouriteHotel != null){
              var temp = $scope.favouriteHotel.hotel_id.indexOf(hotel_id);
              return ((temp > -1) ? true : false);
            }
          };

          // Function to add favourite hotel to the already existing database
          $scope.addFavouriteHotel = function($event,hotel_id){
            $event.preventDefault();
            $event.stopPropagation();
            if($scope.favouriteHotel == [] || $scope.favouriteHotel == undefined || $scope.favouriteHotel == null){
              $scope.saveFavouriteHotel(hotel_id);
            }
            else{
              var favouriteHotel = $scope.favouriteHotel;
              favouriteHotel.hotel_id.push(hotel_id);
              delete $scope.favouriteHotel._id;
              FavouriteHotels.put(favouriteHotel, favouriteHotel.user_id).success(function (res) {
                $scope.favouriteHotel = res;
              });
            }
          };

          // Function to remove favourite hotel from the list of user's favourite hotel
          $scope.removeFavouriteHotel = function($event,hotel_id){
            $event.preventDefault();
            $event.stopPropagation();
            var favouriteHotel = $scope.favouriteHotel;
            _.remove(favouriteHotel.hotel_id, function (hotel) {
              return hotel === hotel_id;
            });
            delete $scope.favouriteHotel._id;
            FavouriteHotels.put(favouriteHotel, favouriteHotel.user_id).success(function (res) {
              $scope.favouriteHotel = res;
            });
          };

          // If the user is setting any hotel in database for first time, set the data in database with selected hotel
          $scope.saveFavouriteHotel = function(hotel_id){
            var favouriteHotel = {
              user_id: $rootScope.user.userId,
              hotel_id: []
            };
            favouriteHotel.hotel_id.push(hotel_id);
            FavouriteHotels.post(favouriteHotel).success(function (res) {
              $scope.favouriteHotel = res;
            });
          };


        });


      });
    }
    }());
