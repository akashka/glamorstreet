(function() {
    'use strict';

    angular
        .module('destinations')
        .controller('viewDestinationController', viewDestinationController);

  viewDestinationController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'HotelsServices',
      '$stateParams', '$filter', '$state', '$cookieStore', '$timeout', 'Calculate', 'ngMeta', 'CLIENT', 'Destinations', 'FavouriteHotels', 'MetaTagsServices'
    ];

    function viewDestinationController($scope, Authentication, $rootScope, $http, HotelsServices, $stateParams,
               $filter , $state, $cookieStore, $timeout, Calculate, ngMeta, CLIENT, Destinations, FavouriteHotels, MetaTagsServices) {

      var netExclusive, markup, sellExclusive, discountedSellExclusive, finalPrice, finalTaxes, discount, Baor_rate, fix_rate, Show_discount;
      $scope.dataReceived = false;
      $scope.checkin = moment().add(1, 'd').format('MM-DD-YYYY');
      $scope.checkout = moment().add(2, 'd').format('MM-DD-YYYY');
      var destinationId = $stateParams.destinationId;
      // Carousel
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      $timeout(function() {
        (CLIENT.name == "staydilly") ? window.scrollTo(0, 120) : "";
        (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 500);

      // Pagination
      $scope.pageChanged = function(){
        $scope.destination.hotels = [];
        $scope.startNum = ($scope.itemsPerPage * ($scope.currentPage - 1));
        $scope.endNum = ($scope.startNum + $scope.itemsPerPage) > $scope.totalItem ? ($scope.totalItem) : ($scope.startNum + $scope.itemsPerPage);
        for (var i = $scope.startNum; i < $scope.endNum; i++) {
          $scope.destination.hotels.push($scope.hotels[i]);
        }
      };

      // Carousel
      $scope.changeSlide = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
      };
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

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

      function calculateAll(room, guests) {
        room.sellExclusive = 0;
        room.discountedSellExclusive = 0;
        room.Baor_rate = 0;
        for (var i = 0; i < guests.nights; i++) {

          var taxes = room.taxes;
          var multipleRates = room.avgRates;

          var prices = {
            netInclusive: multipleRates.netRate,
            serviceTax: _.find(taxes, { 'id': 1 }) ? (_.find(taxes, { 'id': 1 }).value / 100) : 0,
            cityTax: _.find(taxes, { 'id': 3 }) ? (_.find(taxes, { 'id': 3 }).value / 100) : 0,
            gst: _.find(taxes, { 'id': 2 }) ? (_.find(taxes, { 'id': 2 }).value / 100) : 0,
            other: _.find(taxes, { 'id': 4 }) ? (_.find(taxes, { 'id': 4 }).value / 100) : 0,
            markup: (multipleRates.markupRate / 100),
            discount: (room.deal.value / 100)

          };

          netExclusive = Calculate.getNetExclusive(prices.netInclusive, prices.serviceTax, prices.cityTax, prices.other, prices.gst);
          markup = Calculate.getMarkupValue(prices.netInclusive, prices.markup);
          sellExclusive = Calculate.getSellExclusive(netExclusive, markup);

          discountedSellExclusive = Calculate.getDiscountedSellExclusive(sellExclusive, prices.discount);
          finalPrice = Calculate.getFinalPrice(discountedSellExclusive, prices.serviceTax, prices.cityTax, prices.other, prices.gst);
          finalTaxes = Calculate.getFinalTaxes(finalPrice, discountedSellExclusive);
          discount = Calculate.getDiscount(sellExclusive, prices.discount);
          room.sellExclusive = sellExclusive;


          // room.sellExclusive += Calculate.calculateAmount(Math.round(sellExclusive), $scope.guest);
          room.discountedSellExclusive += Calculate.calculateAmount(Math.round(discountedSellExclusive), $scope.guest);
          room.discounts = prices.discount;
          room.Rack_rate = multipleRates.rackRate;
          if (room.Baor_rate == '0') {
            room.Baor_rate = room.Rack_rate;
          }
          if (room.Baor_rate >= room.Rack_rate) {
            room.fix_rate = room.Rack_rate;

          } else {
            room.fix_rate = room.Baor_rate;

          }
          room.Show_discount = Calculate.getdiscountpercent(sellExclusive, room.fix_rate);
        }

        // divide the number of nights to maintain avg rate for more nights
        room.sellExclusive = (room.sellExclusive);
        room.Baor_rate = (room.Baor_rate);
      }

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
        // listen for the window resize event & trigger Google Maps to update too
        $(window).resize(function() {
          // (the 'map' here is the result of the created 'var map = ...' above)
          google.maps.event.trigger(map,'resize');
          map.setCenter(new google.maps.LatLng(citymap.center.lat, citymap.center.lng));
        }, 1000);
      }

      // Getting the destination from MongoDB
      Destinations.get().success(function (res) {
          $scope.destination = _.find(res, ['_id', destinationId]);
          $scope.location = $scope.destination.city;
          $scope.totalItem = 0;
          $scope.currentPage = 1;
          $scope.itemsPerPage = (CLIENT.name == 'staydilly') ? 9 : 8;
          if(CLIENT.name == 'staydilly') {
            var citymap = {
              center: {
                lat: JSON.parse($scope.destination.latitude),
                lng: JSON.parse($scope.destination.longitude)
              },
              Radius: 1
            };
            initMap(citymap);
          }

          // Get Location details from Booking engine
          $http.get('/api/getLocations').success(function(loc) {
            $scope.location = _.find(loc.locations, ['city', $scope.location]);
            $scope.destination.city = $scope.location.city;
            $scope.destination.city_id = $scope.location.city_id;
            $scope.destination.country = $scope.location.country;
            $scope.destination.country_id = $scope.location.country_id;
            $scope.destination.lattitude = $scope.location.lattitude;
            $scope.destination.longitude = $scope.location.longitude;
            $scope.destination.state = $scope.location.state;
            $scope.destination.state_id = $scope.location.state_id;
            //meta tags Starts
            ngMeta.setTitle(" Explore Destination " + $scope.destination.state + " ," + $scope.destination.country);
            ngMeta.setTag('keywords', "Discounted hotels in " + $scope.destination.state + ", " + $scope.destination.country +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");
            ngMeta.setTag('description', "Huge discount on hotels in " + $scope.destination.state + ", " + $scope.destination.country + ".");
            //meta tags Ends

            $scope.destination.neighbourhood = [];
            for(var i = 0; i < loc.locations.length; i++){
              if(loc.locations[i].country_id === $scope.destination.country_id &&
                loc.locations[i].state_id != $scope.destination.state_id){
                  $scope.destination.neighbourhood.push(loc.locations[i]);
              }
            }
            $scope.destination.neighbourhood = _.map(_.uniqBy($scope.destination.neighbourhood, 'state_id'));

            var params = {
              rooms: 1,
              adults: 2
            };

            // Get list of all hotels and hotel details at that city / state
            if(CLIENT.name == 'staydilly')
              params.stateId = $scope.location.state_id;
            else
              params.location = $scope.location.city_id;

            $scope.guest.nights = 1;

            HotelsServices.get(params).success(function(res) {
              $scope.dataReceived = true;
              $scope.searchId = res.search_id;
              if (res.Hotel_Details) {
                $scope.hotels = res.Hotel_Details;
                $scope.noHotels = false;
                $scope.totalItem = $scope.totalHotels = $scope.hotels.length;

                // get reviews of the hotels
                var params = {
                  headers: { "params": ((_.map($scope.hotels, 'hotel_id')).join()) }
                };
                $scope.hotelReviews = [];
                $http.get('/api/reviews',params).success(function(res) {
                  $scope.hotelReviews = res;
                });

                // Get inventory of the hotels
                for(var i = 0; i < $scope.hotels.length; i++){
                  $scope.hotels[i].isAvailable = false;
                  if($scope.hotels[i].rooms != undefined && $scope.hotels[i].rooms != null && $scope.hotels[i].rooms.length > 0){
                    for(var j = 0; j < $scope.hotels[i].rooms.length; j++){
                      if($scope.hotels[i].rooms[j].inventory > 0) $scope.hotels[i].isAvailable = true;
                    }
                  }
                }

                // covert string to title case
                // function titleCase(str) { return str.toLowerCase().split(' ').map(function(val) { return val.replace(val[0], val[0].toUpperCase()); }).join(' '); }

                // Calculate price of each rooms and hotels
                _($scope.hotels).forEach(function(room) {
                  if(room.rooms != undefined && room.rooms != null && room.rooms.length > 0)
                    calculateAll(room, $scope.guest)
                });
                // Default order by discount rates
                var filteredHotels = $filter('orderBy')($scope.hotels, 'sellExclusive');

                $scope.pageChanged();
              } else {
                $scope.noHotels = true;
              }
            });

          });
      });
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
    }
}());
