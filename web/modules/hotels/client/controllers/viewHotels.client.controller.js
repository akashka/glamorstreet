(function () {
  'use strict';

  angular
    .module('hotels')
    .controller('viewHotelController', viewHotelController);

  viewHotelController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'HotelsServices', 'AddonsServices',
    '$stateParams', '$state', '$cookieStore', '$timeout', 'Calculate', 'ngMeta', 'CLIENT', '$filter', 'FavouriteHotels'
  ];

  function viewHotelController($scope, Authentication, $rootScope, $http, HotelsServices, AddonsServices, $stateParams,
                               $state, $cookieStore, $timeout, Calculate, ngMeta, CLIENT, $filter, FavouriteHotels) {


    $rootScope.dataReceived = false;

    function JSONize(str) {
      return str
      // wrap keys without quote with valid double quote
        .replace(/([\$\w]+)\s*:/g, function (_, $1) {
          return '"' + $1 + '":'
        })
        // replacing single quote wrapped ones to double quote
        .replace(/'([^']+)'/g, function (_, $1) {
          return '"' + $1 + '"'
        })
    }

    var params = {
      headers: {
        "params": $stateParams.productId
      }
    };

    $scope.left        = [];
    $scope.right       = [];
    $scope.sub_ratings = [];
    $scope.hotelNearBy = [];

    // Function to get the reviews (For Staydilly)
    $http.get('/api/reviews', params).success(function (res) {
      $scope.hotelReviews = (res[0].status == "success") ? res[0] : null;
      if ($scope.hotelReviews != null) {
        // Get list of mentions
        var total_mentions          = $scope.hotelReviews.mentions;
        $scope.hotelReviews.left    = [];
        $scope.hotelReviews.right   = [];
        $scope.hotelReviews.sub_rat = [];
        var k                       = 0;
        for (var key in total_mentions) {
          if (k % 2 === 0) {
            $scope.hotelReviews.left.push({
              'key': key,
              'value': total_mentions[key]
            });
          } else {
            $scope.hotelReviews.right.push({
              'key': key,
              'value': total_mentions[key]
            });
          }
          k++;
        }
        // Get list of sub ratings
        for (var key in $scope.hotelReviews.sub_ratings) {
          $scope.hotelReviews.sub_rat.push({
            'key': key,
            'value': ($scope.hotelReviews.sub_ratings[key] * 10)
          });
        }
      }
    });

    HotelsServices.single($stateParams).success(function (res) {
      var discount;

      $scope.checkin   = $stateParams.checkin;
      $scope.checkout  = $stateParams.checkout;
      $scope.breakfast = "breakfast";

      $scope.guest = {
        rooms: $stateParams.rooms ? $stateParams.rooms : 1,
        adults: $stateParams.adults ? $stateParams.adults : 2,
        nights: getNights($scope.checkin, $scope.checkout)
      };

      function getNights(checkin, checkout) {
        var ci = strToDate(checkin);
        var co = strToDate(checkout);
        return co.diff(ci, 'days');
      }

      function strToDate(dt) {
        var d = dt.split('-');
        return moment([d[2], (Number(d[0]) - 1), d[1]]);
      }

      $timeout(function () {
        (CLIENT.name == "staydilly") ? window.scrollTo(0, 320) : "";
        (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 1000);

      if (res) $rootScope.dataReceived = true;

      function calculateAll(room, guests) {
        room.price.actual       = ((room.price.actual) / guests.nights); // Avg/Night
        room.price.discounted   = ((room.price.discounted) / guests.nights); // Avg/Night
        room.price.showDiscount = Calculate.calculateDiscount(room.price.actual, room.price.discounted);
      }

      //  logics for nearBy hotels
      function calculateAllHotel(hotel, guests) {
        hotel.price.actual = ((hotel.price.actual) / guests.nights);
        hotel.price.discounted = ((hotel.price.discounted) / guests.nights);
        hotel.price.showDiscount = Calculate.calculateDiscount(hotel.price.actual, hotel.price.discounted);
      }

      if (res.Hotel_Details) {
        var hotel        = res.Hotel_Details[0];
        $scope.latitude  = hotel.coordinates.latitude;
        $scope.longitude = hotel.coordinates.longitude;

        // Places of interest
        var places = ['Bus Stand', 'Landmark', 'Railway Station', 'ATM', 'Airport', 'Shopping Mall', 'Petrol Pump', 'School', 'Hospital', 'Libraries'];
        if (hotel.commute != undefined && hotel.commute.length > 0) {
          for (var c = 0; c < hotel.commute.length; c++) {
            var cnt = 0;
            for (var l = hotel.commute[c].length - 4; l >= 0; l--) {
              if (hotel.commute[c][l] === ' ') {
                cnt = hotel.commute[c].length - l;
                break;
              }
            }
            var key   = hotel.commute[c].substring(0, hotel.commute[c].length - cnt);
            var value = hotel.commute[c].substring(hotel.commute[c].length - cnt, hotel.commute[c].length);
            for (var p = 0; p < places.length; p++) {
              if (key.startsWith(places[p])) {
                key = key.replace(places[p], "");
                break;
              }
            }
            hotel.commute[c] = {
              key: key,
              value: value
            }
          }
        }

        $rootScope.titlename    = hotel.hotel_name;
        $rootScope.titlestate   = hotel.address.state;
        $rootScope.titlecountry = hotel.address.country;

        _(hotel.rooms).forEach(function (room) {
          calculateAll(room, $scope.guest)
        });

        $scope.Hotdetail = hotel;

        // Get nearby locations hotels
        var params = {
          adults: $stateParams.adults,
          checkin: $stateParams.checkin,
          checkout: $stateParams.checkout,
          country: hotel.address.countryId,
          rooms: $stateParams.rooms,
          stateId: hotel.address.stateId
        };
        HotelsServices.get(params).success(function (res) {
          $scope.hotelNearBy = res.Hotel_Details;
          if (res.Hotel_Details) {
            var hotels = res.Hotel_Details;
            var params = {
              headers: {
                "params": ((_.map($scope.hotelNearBy, 'hotel_id')).join())
              }
            };

            $scope.neaerHotelReviews = [];
            $http.get('/api/reviews', params).success(function (res) {
              for (var i = 0; i < res.length; i++) {
                $scope.neaerHotelReviews.push(res[i])
              }
              ;
            });

            for (var i = 0; i < hotels.length; i++) {
              hotels[i].isAvailable = false;
              if (hotels[i].price.discounted > 0 && hotels[i].inventory>0 && hotels[i].price != null){
                hotels[i].isAvailable = true;
              }

              var x              = hotels[i].coordinates.latitude - $scope.latitude;
              var y              = hotels[i].coordinates.longitude - $scope.longitude;
              hotels[i].distance = Math.sqrt((x * x) + (y * y));
            }
            _(hotels).forEach(function (hotel) {
              calculateAllHotel(hotel, $scope.guest)
            });
          }

          for (var h = 0; h < $scope.hotelNearBy.length; h++) {
            if ($scope.hotelNearBy[h].hotel_id == $stateParams.productId || $scope.hotelNearBy[h].price.showDiscount <= 0 ||
              !$scope.hotelNearBy[h].isAvailable || $scope.hotelNearBy[h].price.discounted <= 0) {
              $scope.hotelNearBy.splice(h, 1);
              h--;
            }
          }
          $scope.hotelNearBy = $filter('orderBy')($scope.hotelNearBy, 'distance');
          $scope.hotelNearBy = $scope.hotelNearBy.splice(0, 3);
          $scope.hotelNearBy = _.chunk($scope.hotelNearBy, 3);
        });

      } else {
        $scope.noHotels = true;
      }

      //meta tags Starts
      ngMeta.setTitle($scope.Hotdetail.hotel_name + ", Hotel in " + $scope.Hotdetail.address.state + ", " + $scope.Hotdetail.address.country);
      ngMeta.setTag('keywords', "Discounted hotels in " + $scope.Hotdetail.address.city + ", " + $scope.Hotdetail.address.state + ", " + $scope.Hotdetail.address.country + "." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");
      ngMeta.setTag('description', "Huge discount on hotels in " + $scope.Hotdetail.address.city + ", " + $scope.Hotdetail.address.state + ", " + $scope.Hotdetail.address.country + ". " + $scope.Hotdetail.description);
      //meta tags Ends

      // Carousel
      $scope.myInterval   = 5000;
      $scope.noWrapSlides = false;
      $scope.active       = 0;
      // assigning variables to send as
      // params in navigation
      $scope.searchId  = res.search_id;
      $scope.productId = $stateParams.productId;
      $scope.location  = $stateParams.location;
      $scope.checkin   = $stateParams.checkin ? $stateParams.checkin : moment().add(1, 'd').format("MM-DD-YYYY");
      $scope.checkout  = $stateParams.checkout ? $stateParams.checkout : moment().add(2, 'd').format("MM-DD-YYYY");
      $scope.promo     = $stateParams.promo;
      $scope.guest     = {
        rooms: $stateParams.rooms ? $stateParams.rooms : 1,
        adults: $stateParams.adults ? $stateParams.adults : 2,
        nights: getNights($scope.checkin, $scope.checkout)
      };

      // collecting all the room images
      $scope.roomimages = hotel.images;
      $scope.totalRooms = 0;
      _.forEach(hotel.rooms, function (value) {
        $scope.roomimages = _.concat($scope.roomimages, value.images);
        $scope.totalRooms += value.inventory;
      });
      $scope.roomimages = _.uniq($scope.roomimages, false);

      var amenities = {
        "Clothes Rack / Wardrobe": {
          icon: '6.png',
          text: 'Clothes Rack / Wardrobe'
        },
        "Air Conditioning": {
          icon: '5.png',
          text: 'A/C'
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
          icon: 'icon_set_1_icon-7',
          text: 'Free Wifi'
        },
        "bed": {
          icon: 'icon_set_2_icon-115',
          text: '1 Double or 2 Single Beds'
        },
        "breakfast": {
          icon: 'icon_set_3_restaurant-6',
          text: 'Free breakfast'
        },
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

      $scope.amIcon = function (am) {
        return amenities[am] ? amenities[am].icon : '';
      };

      $scope.amText = function (am) {
        return amenities[am] ? amenities[am].text : '';

      };

      var stars       = ['rating.gif', 'rating.gif', 'rating.gif', 'rating.gif', 'rating.gif'];
      $scope.getStars = function (number) {
        var index = Math.round(number) - 1;
        return stars[index];
      };

      var recamenities = {
        wifi: {
          icon: 'icon_set_1_icon-86',
          text: 'Free Wifi'
        }
      };

      $scope.ramIcon = function (am) {
        return recamenities[am] ? recamenities[am].icon : '';
      };

      $scope.ramText = function (am) {
        return recamenities[am] ? recamenities[am].text : '';
      };

      $scope.map  = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8
      };
      var citymap = {

        center: {
          lat: JSON.parse(res.Hotel_Details[0].coordinates.latitude),
          lng: JSON.parse(res.Hotel_Details[0].coordinates.longitude)
        },
        Radius: 1

      };

      initMap(citymap);

      function initMap(citymap) {

        // Create the map.
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: {
            lat: citymap.center.lat,
            lng: citymap.center.lng
          },
          mapTypeId: 'roadmap'
        });

        // Construct the circle for each value in citymap.
        // Note: We scale the area of the circle based on the Radius in km.

        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: citymap.center,
          radius: Math.sqrt(citymap.Radius) * 1000
        });
      }
    });

    // Function to get the Add Ons for hotel (For travellers)
    AddonsServices.policies($stateParams).success(function (res) {
      $rootScope.activities = (res.policies != null && res.policies.length > 0) ? res.policies : [];
    });

    // Function to get the Favourite hotels, if the user is logged in
    if ($rootScope.user != undefined && $rootScope.user != null) {
      FavouriteHotels.get($rootScope.user.userId).success(function (res) {
        $scope.favouriteHotel = res[0];
      });
    }

    // Function to check if the hotel is an favourite hotel list of the logged in user
    $scope.checkFavourite = function (hotel_id) {
      if ($scope.favouriteHotel != undefined && $scope.favouriteHotel != null) {
        var temp = $scope.favouriteHotel.hotel_id.indexOf(hotel_id);
        return ((temp > -1) ? true : false);
      }
    };

    // Function to add favourite hotel to the already existing database
    $scope.addFavouriteHotel = function ($event, hotel_id) {
      $event.preventDefault();
      $event.stopPropagation();
      if ($scope.favouriteHotel == [] || $scope.favouriteHotel == undefined || $scope.favouriteHotel == null) {
        $scope.saveFavouriteHotel(hotel_id);
      } else {
        var favouriteHotel = $scope.favouriteHotel;
        favouriteHotel.hotel_id.push(hotel_id);
        delete $scope.favouriteHotel._id;
        FavouriteHotels.put(favouriteHotel, favouriteHotel.user_id).success(function (res) {
          $scope.favouriteHotel = res;
        });
      }
    };

    // Function to remove favourite hotel from the list of user's favourite hotel
    $scope.removeFavouriteHotel = function ($event, hotel_id) {
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
    $scope.saveFavouriteHotel = function (hotel_id) {
      var favouriteHotel = {
        user_id: $rootScope.user.userId,
        hotel_id: []
      };
      favouriteHotel.hotel_id.push(hotel_id);
      FavouriteHotels.post(favouriteHotel).success(function (res) {
        $scope.favouriteHotel = res;
      });
    };

  }
}());
