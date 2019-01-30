(function () {
  'use strict';

  angular
    .module('homepage')
    .controller('HomePageController', HomePageController);

  HomePageController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Calculate', '$window', 'CLIENT', 'HotelsServices', '$timeout', 'Promos'];

  function HomePageController($scope, Authentication, $rootScope, $http, Calculate, $window, CLIENT, HotelsServices, $timeout, Promos) {
    var netExclusive, markup, sellExclusive, discountedSellExclusive, finalPrice, finalTaxes, discount, Baor_rate,
        fix_rate, Show_discount;
    $scope.widgetText          = 'Book a room';
    $rootScope.dataReceived    = true;
    $rootScope.IEOlderVersions = false;


    // Function to get the screen to lower level, after the screen is loaded based on the timeout.
      $timeout(function () {
      (CLIENT.name == "staydilly") ? window.scrollTo(0, 470) : "";
      (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
      }, 1000);

    // detecting the IE browser to disable the Slider
    if (/MSIE 10/i.test(navigator.userAgent)) {
      // This is internet explorer 10
      $rootScope.IEOlderVersions = true;
    }

    if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
      // This is internet explorer 9 or 11
      $rootScope.IEOlderVersions = true;
    }
    
    Promos.get().success(function (res) {
      $scope.promos = res;
    });
    // default check in and check Out for homepage
    $scope.checkin = moment().add(1, 'd').format('MM-DD-YYYY');
    $scope.checkout = moment().add(2, 'd').format('MM-DD-YYYY');


    function getPercentage(deal) {
      if (deal.discount_type == 'Percentage') {
        return deal.value;
      } else {
        return Math.round((deal.value * 100) / deal.price);
      }
    }

    function calculateAll(hotel) {
      hotel.price.showDiscount = Calculate.calculateDiscount(hotel.price.actual, hotel.price.discounted);
    }

    var dealsCalculation = function () {
      var today  = new Date();
      var params = {
        adults: "2", rooms: "1",
        //     checkin: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        //     checkout: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
      };
      if (CLIENT.name == "staydilly") {
        HotelsServices.get(params).success(function (res) {
          params.checkin  = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          params.checkout = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
          $scope.searchid = res.search_id;
          _($scope.hoteldeal).forEach(function (val) {
            var hoteldel = _.find(res.Hotel_Details, {'hotel_id': val.property_id});
            if (hoteldel) {
              calculateAll(hoteldel);
              val.address   = hoteldel.address.city;
              val.currency  = hoteldel.currency;
              val.price     = hoteldel.price;
              val.startDate = params.checkin;
              val.endDate   = params.checkout;
              $scope.hoteldeal.push(val);
            }
          });
          $scope.DealsDataRecived = true;
          //for large hotel
          $scope.large_hotel      = _.find($scope.hoteldeal, {'position': 1});
        });
      }
    };

    var hoteldeal = [];
    //getting selected deals from the database
    $http.get('/api/deals').success(function (res) {
      $scope.hoteldeal   = res;
      $scope.large_hotel = _.find($scope.hoteldeal, {'position': 1});
      dealsCalculation();
    });

    $http.get('/api/getPropertytype').success(function (res) {
      var propertyTypes = res.PropertyList;
      _($scope.collections).forEach(function (val) {
        var col = _.find(propertyTypes, {'id': val.id});
        if (col) {
          val.name = col.name;
        }
      });
    });

    //bind collections to homepage
    $http.get('/api/selectedCollections').success(function (res) {
      $scope.collections = res;
    });
    //bind locations to homepage
    $http.get('/api/selectedLocations').success(function (res) {
      $scope.Showlocations = res;
    });

    $http.get('/api/blogs').success(function (res) {
      $scope.blogsChenk1 = [];
      $scope.blogsChenk2 = [];
      for (var i = 0; i < 2; i++) $scope.blogsChenk1.push(res[i]);
      for (var i = 2; i < 4; i++) $scope.blogsChenk2.push(res[i]);
    });

    $scope.showblogs = [5];


    $http.get('/api/getLocations').success(function (loc) {
      var states = loc;
      _($scope.states).forEach(function (val) {

        val.citiesInState = _.groupBy(loc, ['state_id', val.id]);

      });

      var dividedLocations = _.uniq(_.map(loc.locations, "state_id"));
      for (var i = 0; i < dividedLocations.length; i++) {
        var dl       = _.find(loc.locations, {'state_id': dividedLocations[i]});
        var newState = {
          city: "",
          city_id: -1,
          country: dl.country,
          country_id: dl.country_id,
          lattitude: dl.lattitude,
          longitude: dl.longitude,
          state: dl.state,
          state_id: dl.state_id,
        };
        loc.locations.unshift(newState);
      }
    });

    $scope.sections = {
      deals: {
        icon: '/views/staydilly/modules/core/client/images/home/deals.png',
        header: 'Amazing Travel Deals',
        description: 'Don’t want to skimp on luxury when you’re travelling? We don’t believe you have to! Staydilly offers the best hotel deals at unbeatable prices. Browse through our deals and book yourself a Staydilly getaway today!'
      },
      collections: {
        icon: '/views/staydilly/modules/core/client/images/home/collections.png',
        header: 'Hotels by Collection',
        description: 'Whether it’s a business, leisure or family getaway you’re in the mood for we have something for everyone. Browse our hotel collections and book yourself a Staydilly getaway today!'
      },
      cities: {
        icon: '/views/staydilly/modules/core/client/images/home/cities.png',
        header: 'Discover Cities to Visit',
        description: 'The bright lights are beckoning! Experience some of Asia’s beautiful cities at the height of luxury with Staydilly. Book yourself a Staydilly getaway today!'
      },
      blog: {
        icon: '/views/staydilly/modules/core/client/images/home/blog.png',
        header: 'Travel Tales',
        description: 'Read through these tales to kick-start your Staydilly getaway. With the best hotel deals in a variety of cities, you’ll be spoilt for choice. What will your story be? Book yourself a Staydilly getaway today!'
      }
    };

    document.addEventListener('touchstart', function () {
    }, true);

    // Carousel
    $scope.myInterval   = 3000;
    $scope.noWrapSlides = false;
    $scope.active       = 0;
  }
}());
