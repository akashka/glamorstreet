(function () {
  'use strict';
  angular
    .module('hotels')
    .controller('hotelsController', hotelsController);

  hotelsController.$inject = ['$scope', 'Authentication', '$rootScope', 'HotelsServices',
    '$stateParams', '$window', '$http', '$filter', '$uibModal', '$timeout', 'Calculate', '$location',
    'CLIENT', 'ngMeta', 'SearchLogger', 'FavouriteHotels'
  ];

  function hotelsController($scope, Authentication, $rootScope, HotelsServices, $stateParams,
                            $window, $http, $filter, $uibModal,
                            $timeout, Calculate, $location, CLIENT, ngMeta, SearchLogger, FavouriteHotels) {

    $timeout(function () {
      (CLIENT.name == "staydilly") ? window.scrollTo(0, 120) : "";
      (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";
    }, 1000);

    // Display the number of items in a page (Pagination)
    $scope.itemsPerPage  = (CLIENT.name == "traveler.mv") ? 10 : 50;
    // Display the number of page opptions in a pagination widget
    $scope.maxSize       = (CLIENT.name == "traveler.mv") ? 5 : 3;
    $scope.virtualcities = [9313, 9326];

    $scope.totalItems     = 0;
    $scope.currentPage    = 1;
    $scope.priceRange     = 0;
    $scope.currencies     = [];
    $scope.propertyTypes  = [];
    $scope.facilities     = [];
    $scope.roomFacilities = [];
    $scope.isState        = ($stateParams.location == undefined && $stateParams.stateId != undefined) ? true : false;
    $scope.pageChanged    = function () {
      $scope.hotels     = [];
      if($scope.view == 'grid'){
        var count = 0;
        for (var i= 0; i < $scope.allHotels.length; i++){
          count = count + $scope.allHotels[i].length;
        }
        $scope.totalItems = count;
      }else{
        $scope.totalItems = $scope.allHotels.length;
      }
      $scope.totalItem  = 0;

      if ($scope.view == 'grid') {
        var itemsPer     = $scope.itemsPerPage / 2;
        $scope.startNum  = (itemsPer * ($scope.currentPage - 1));
        $scope.endNum    = ($scope.startNum + itemsPer) > $scope.totalItems ? ($scope.totalItems) : ($scope.startNum + itemsPer);
        $scope.totalItem = $scope.totalItems;
      } else {
        $scope.startNum  = ($scope.itemsPerPage * ($scope.currentPage - 1));
        $scope.endNum    = ($scope.startNum + $scope.itemsPerPage) > $scope.totalItems ? ($scope.totalItems) : ($scope.startNum + $scope.itemsPerPage);
        $scope.totalItem = $scope.totalItems;
      }

      for (var i = $scope.startNum; i < $scope.endNum; i++) {
        $scope.hotels.push($scope.allHotels[i]);
      }
    };
  
    $scope.checkin  = $stateParams.checkin;
    $scope.checkout = $stateParams.checkout;

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

    $scope.$watch(function () {
      return $rootScope.currency
    }, function (obj) {
      if (obj != null) {
        var filteredHotels = $filter('orderBy')($scope.allHotels, 'price.discounted');
        $scope.minPrice    = 0;
        $scope.maxPrice    = 0;
        if ($rootScope.currency != undefined) {
          _(filteredHotels).forEach(function (hotel) {
            if ($scope.minPrice > (hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency])) {
              $scope.minPrice = hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency];
            }
            ;
            if ($scope.maxPrice < (hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency])) {
              $scope.maxPrice = hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency];
            }
          });
        } else {
          $scope.minPrice = Math.min.apply(Math, filteredHotels.map(function (o) {
            return o.price.discounted;
          }));
          $scope.maxPrice = Math.max.apply(Math, filteredHotels.map(function (o) {
            return o.price.discounted;
          }));
        }
        $scope.slider = {
          min: Number($scope.minPrice.toFixed(2)) - 1,
          max: Number($scope.maxPrice.toFixed(2)) + 1,
          options: {
            floor: Number($scope.minPrice.toFixed(2)) - 1,
            ceil: Number($scope.maxPrice.toFixed(2)) + 1
          }
        };
      }
    }, true);

    $rootScope.dataReceived = false;

    function calculateAll(hotel, guests) {
      if (guests.nights > 1) {
        hotel.price.discounted = (hotel.price.discounted/guests.nights);
        hotel.price.actual = (hotel.price.actual/guests.nights);
      }
      hotel.price.showDiscount = Calculate.calculateDiscount(hotel.price.actual, hotel.price.discounted);
    }

    // covert string to title case
    function titleCase(str) {
      return str.toLowerCase().split(' ').map(function (val) {
        return val.replace(val[0], val[0].toUpperCase());
      }).join(' ');
    }

    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
      }
      return newArr;
    };

    // for hotels to display
    HotelsServices.get($stateParams).success(function (res) {

      // Remove hotels from virtual cities
      if (res.Hotel_Details != undefined && res.Hotel_Details.length > 0) {
        for (var c = 0; c < $scope.virtualcities.length; c++) {
          _.remove(res.Hotel_Details, function (currentObject) {
            return currentObject.address.cityId == $scope.virtualcities[c];
          });
        }
      }
      var body = {
        searchId: res.search_id,
        hotel_numbers: (res.Hotel_Details != undefined) ? res.Hotel_Details.length : 0,
        searchDateTime: new Date(),
        adults: $stateParams.adults,
        checkin: $stateParams.checkin,
        checkout: $stateParams.checkout,
        country: $stateParams.country,
        deal: $stateParams.deal,
        location: $stateParams.location,
        promo: $stateParams.promo,
        propertyType: $stateParams.propertyType,
        rooms: $stateParams.rooms,
        stateId: $stateParams.stateId
      };
      SearchLogger.post(body).success(function (response) {
      });

      var listHotels, gridHotels;

      if (res) {
        $rootScope.dataReceived = true;
        $scope.searchId         = res.search_id;
      }

      if (res.Hotel_Details) {
        var hotels = res.Hotel_Details;
        var params = {
          headers: {
            "params": ((_.map(hotels, 'hotel_id')).join())
          }
        };

        $scope.hotelReviews = [];
        $http.get('/api/reviews', params).success(function (res) {
          $scope.hotelReviews = res;
        });

        for (var i = 0; i < hotels.length; i++) {
          hotels[i].isAvailable = false;
          if (hotels[i].price != undefined && hotels[i].price != null && hotels[i].inventory >0) {
            if (hotels[i].price.discounted > 0) hotels[i].isAvailable = true;
          }
        }

        $scope.addSelected = function (names) {
          var data = [];
          _(names).forEach(function (name) {
            data.push({
              'name': name,
              'selected': false
            });
          });
          return data;
        };

//  filter hotel based on price
        var filteredHotels = $filter('orderBy')(hotels, 'price.discounted');
//  find max and min cost from the hotels Filter
        $scope.minPrice    = Math.min.apply(Math, filteredHotels.map(function (o) {
          return o.price.discounted;
        }));
        $scope.maxPrice    = Math.max.apply(Math, filteredHotels.map(function (o) {
          return o.price.discounted;
        }));

// rate slider filter
        $scope.slider = {
          min: Number($scope.minPrice.toFixed(2)) - 1,
          max: Number($scope.maxPrice.toFixed(2)) + 1,
          options: {
            floor: Number($scope.minPrice.toFixed(2)) - 1,
            ceil: Number($scope.maxPrice.toFixed(2)) + 1
          }
        };

// name wise filter
        var cityNames        = _.map((_.uniqBy(filteredHotels, 'address.city')), 'address.city');
        $scope.cityNames     = $scope.addSelected(cityNames);
        var currencyNames    = _.map((_.uniqBy(filteredHotels, 'currency')), 'currency');
        $scope.currencies    = $scope.addSelected(currencyNames);
        var propertyNames    = _.map((_.uniqBy(filteredHotels, 'property_type')), 'property_type');
        $scope.propertyTypes = $scope.addSelected(propertyNames);
        var amenityNames     = [];
        _(filteredHotels).forEach(function (hotel) {
          for (var k = 0; k < hotel.amenities.length; k++) {
            if (amenityNames.indexOf(hotel.amenities[k]) === -1) amenityNames.push(hotel.amenities[k]);
          }
        });
        $scope.roomFacilities = $scope.addSelected(amenityNames);

        var names         = ['Sitting Area', 'Room Service', 'Elevator', ' Outdoor Pool', 'Gymnasium', 'Business Center',
          'Restaurant', 'Wi-Fi', 'Spa', '24-Hour Front Desk', 'Designated Smoking Area', 'Fitness Centre'
        ];
        $scope.facilities = $scope.addSelected(names);

        _(filteredHotels).forEach(function (hotel) {
          if (hotel.price != undefined && hotel.price != null)
            calculateAll(hotel, $scope.guest)
        });
        listHotels         = filteredHotels;
        gridHotels         = chunk(filteredHotels, 2);
        $scope.totalHotels = hotels.length;
      } else {
        $scope.noHotels = true;
      }

      var filteredHotels = $filter('orderBy')(hotels, 'price.discounted');
      $scope.minPrice    = 0;
      $scope.maxPrice    = 0;
      if ($rootScope.currency != undefined) {
        _(filteredHotels).forEach(function (hotel) {
          if ($scope.minPrice > (hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency])) {
            $scope.minPrice = hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency];
          }
          ;
          if ($scope.maxPrice < (hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency])) {
            $scope.maxPrice = hotel.price.discounted * $rootScope.currencyMultiplier[hotel.currency];
          }
        });
      } else {
        $scope.minPrice = Math.min.apply(Math, filteredHotels.map(function (o) {
          return o.price.discounted;
        }));
        $scope.maxPrice = Math.max.apply(Math, filteredHotels.map(function (o) {
          return o.price.discounted;
        }));
      }

      $scope.slider = {
        min: Number($scope.minPrice.toFixed(2)) - 1,
        max: Number($scope.maxPrice.toFixed(2)) + 1,
        options: {
          floor: Number($scope.minPrice.toFixed(2)) - 1,
          ceil: Number($scope.maxPrice.toFixed(2)) + 1
        }
      };

      // assigning variables to send as
      // params in navigation
      $scope.location = $stateParams.location;
      $scope.checkin  = $stateParams.checkin;
      $scope.checkout = $stateParams.checkout;
      $scope.promo    = $stateParams.promo;
      var nights      = $scope.guest.nights;
      $scope.guest    = {
        rooms: $stateParams.rooms ? $stateParams.rooms : 1,
        adults: $stateParams.adults ? $stateParams.adults : 2,
        nights: nights ? nights : 1
      };

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

      $scope.changeSort = function (sort, flag) {
        if ($scope.view == 'list') {
          arrayOfHotels = angular.copy($scope.allHotels);
        } else {
          var arrayOfHotels = [];
          for (var i = 0; i < $scope.allHotels.length; i++) {
            if ($scope.allHotels[i][0] != undefined) arrayOfHotels.push($scope.allHotels[i][0]);
            if ($scope.allHotels[i][1] != undefined) arrayOfHotels.push($scope.allHotels[i][1]);
          }
        }

        if (sort == 'price') {
          arrayOfHotels.sort(function (a, b) {
            return a.price.discounted - b.price.discounted
          })
        } else if (sort == 'discount') {
          arrayOfHotels.sort(function (a, b) {
            return a.price.showDiscount - b.price.showDiscount
          });
          arrayOfHotels.reverse();
        } else if (sort == 'recommended') {
          arrayOfHotels.sort(function (a, b) {
            return a.preferedPosition - b.preferedPosition
          })
        } else if (sort == 'name') {
          arrayOfHotels.sort(function (a, b) {
            if (a.hotel_name < b.hotel_name) //sort string ascending
              return -1;
            if (a.hotel_name > b.hotel_name)
              return 1;
            return 0;
          })
        }

// Reverse the array if flag = true
        if (flag == true) {
          arrayOfHotels.reverse();
        }

        gridHotels = _.chunk(arrayOfHotels, 2);
        listHotels = arrayOfHotels;
        $scope.changeView($scope.view, false);
      };

      $scope.changeView = function (view, flag) {
        $scope.view = view;
        if (view == 'grid') {
          $scope.nearHotels = angular.copy($scope.gridNearHotels);
          $scope.allHotels  = gridHotels;
          // $scope.hotels     = gridHotels;
        } else {
          $scope.allHotels  = listHotels;
          // $scope.hotels     = listHotels;
          $scope.nearHotels = angular.copy($scope.listNearHotels);
        }
        $scope.hotelsList = [];
        $scope.hotelsList = angular.copy($scope.allHotels);
        $scope.pageChanged();

        if (flag) $scope.onFilterChange();
      };
      $scope.changeView('list', false);
      $scope.changeSlide          = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      };
      // Carousel
      $scope.myInterval           = 5000;
      $scope.noWrapSlides         = false;
      $scope.active               = 0;
      $scope.onPriceChange        = function () {
        var sortedHotels = [];
        if ($scope.view == 'list' && $rootScope.currency != undefined) {
          for (var h = 0; h < $scope.allHotels.length; h++) {
            if (($scope.allHotels[h].price.discounted * $rootScope.currencyMultiplier[$scope.allHotels[h].currency]) < $scope.slider.min ||
              ($scope.allHotels[h].price.discounted * $rootScope.currencyMultiplier[$scope.allHotels[h].currency]) > $scope.slider.max) {
              $scope.allHotels.splice(h, 1);
              h--;
            }
          }
        } else if ($scope.view == 'list' && $rootScope.currency == undefined) {
          for (var h = 0; h < $scope.allHotels.length; h++) {
            if ($scope.allHotels[h].price.discounted < $scope.slider.min || $scope.allHotels[h].price.discounted > $scope.slider.max) {
              $scope.allHotels.splice(h, 1);
              h--;
            }
          }
        } else if ($scope.view != 'list' && $rootScope.currency != undefined) {
          for (var h = 0; h < $scope.allHotels.length; h++) {
            for (var ch = 0; ch < $scope.allHotels[h].length; ch++) {
              if (($scope.allHotels[h][ch].price.discounted * $rootScope.currencyMultiplier[$scope.allHotels[h][ch].currency]) < $scope.slider.min ||
                ($scope.allHotels[h][ch].price.discounted * $rootScope.currencyMultiplier[$scope.allHotels[h][ch].currency]) > $scope.slider.max) {
                $scope.allHotels[h].splice(ch, 1);
                ch--;
              }
            }
            if ($scope.allHotels[h].length <= 0) {
              $scope.allHotels.splice(h, 1);
              h--;
            }
          }
        } else if ($scope.view != 'list' && $rootScope.currency == undefined) {
          for (var h = 0; h < $scope.allHotels.length; h++) {
            for (var ch = 0; ch < $scope.allHotels[h].length; ch++) {
              if ($scope.allHotels[h][ch].price.discounted < $scope.slider.min || $scope.allHotels[h][ch].price.discounted > $scope.slider.max) {
                $scope.allHotels[h].splice(ch, 1);
                ch--;
              }
            }
            if ($scope.allHotels[h].length <= 0) {
              $scope.allHotels.splice(h, 1);
              h--;
            }
          }
        }
      };
      $scope.onPropertyTypeChange = function () {
        var toDo = false;
        for (var j = 0; j < $scope.propertyTypes.length; j++) {
          if ($scope.propertyTypes[j].selected) {
            toDo = true;
            break;
          }
        }
        if (toDo) {
          for (var i = 0; i < $scope.allHotels.length; i++) {
            var isFound = true;
            if ($scope.view == 'list') {
              for (var j = 0; j < $scope.propertyTypes.length; j++) {
                if (!$scope.propertyTypes[j].selected && $scope.propertyTypes[j].name == $scope.allHotels[i].property_type) {
                  isFound = false;
                }
              }
              if (!isFound) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            } else {
              for (var ch = 0; ch < $scope.allHotels[i].length; ch++) {
                isFound = true;
                for (var j = 0; j < $scope.propertyTypes.length; j++) {
                  if ($scope.propertyTypes[j].selected && $scope.propertyTypes[j].name === $scope.allHotels[i][ch].property_type) {
                    isFound = false;
                  }
                }
                if (isFound) {
                  $scope.allHotels[i].splice(ch, 1);
                  ch--;
                }
              }
              if ($scope.allHotels[i].length <= 0) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            }
          }
        }
      };
      $scope.onHotelSearch        = function () {
        if ($scope.searchedHotel != "" && $scope.searchedHotel != undefined) {
          for (var i = 0; i < $scope.allHotels.length; i++) {
            if ($scope.view == 'list') {
              if ($scope.allHotels[i].hotel_name.indexOf(titleCase($scope.searchedHotel)) === -1) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            } else {
              for (var ch = 0; ch < $scope.allHotels[i].length; ch++) {
                if ($scope.allHotels[i][ch].hotel_name.indexOf(titleCase($scope.searchedHotel)) === -1) {
                  $scope.allHotels[i].splice(ch, 1);
                  ch--;
                }
              }
              if ($scope.allHotels[i].length <= 0) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            }
          }
        }
      };

      $scope.onRoomFacilityChange = function () {
        var toDo = false;
        for (var j = 0; j < $scope.roomFacilities.length; j++) {
          if ($scope.roomFacilities[j].selected) {
            toDo = true;
            break;
          }
        }
        if (toDo) {
          for (var i = 0; i < $scope.allHotels.length; i++) {
            var isFound = false;
            if ($scope.view == 'list') {
              for (var j = 0; j < $scope.roomFacilities.length; j++) {
                if ($scope.allHotels[i].rooms != undefined && $scope.allHotels[i].rooms.length > 0) {
                  for (var m = 0; m < $scope.allHotels[i].rooms.length; m++) {
                    if ($scope.roomFacilities[j].selected && $scope.allHotels[i].rooms[m].amenities.indexOf(amenityNames[j]) != -1) {
                      isFound = true;
                    }
                  }
                }
              }
              if (!isFound) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            } else {
              for (var ch = 0; ch < $scope.allHotels[i].length; ch++) {
                for (var j = 0; j < $scope.roomFacilities.length; j++) {
                  for (var m = 0; m < $scope.allHotels[i][ch].rooms.length; m++) {
                    if ($scope.roomFacilities[j].selected && $scope.allHotels[i][ch].rooms[m].amenities.indexOf(amenityNames[j]) != -1) {
                      isFound = true;
                    }
                  }
                }
                if (!isFound) {
                  $scope.allHotels[i].splice(ch, 1);
                  ch--;
                }
              }
              if ($scope.allHotels[i].length <= 0) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            }
          }
        }
      };
      $scope.onFacilityChange     = function () {
        var toDo = false;
        for (var j = 0; j < $scope.facilities.length; j++) {
          if ($scope.facilities[j].selected) {
            toDo = true;
            break;
          }
        }

        if (toDo) {
          for (var i = 0; i < $scope.allHotels.length; i++) {
            var isFound = false;
            if ($scope.view == 'list') {
              for (var j = 0; j < $scope.facilities.length; j++) {
                if ($scope.facilities[j].selected && $scope.allHotels[i].amenities.indexOf(names[j]) != -1) {
                  isFound = true;
                }
              }
              if (!isFound) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            } else {
              for (var ch = 0; ch < $scope.allHotels[i].length; ch++) {
                for (var j = 0; j < $scope.facilities.length; j++) {
                  if ($scope.facilities[j].selected && $scope.allHotels[i][ch].amenities.indexOf(names[j]) != -1) {
                    isFound = true;
                  }
                }
                if (!isFound) {
                  $scope.allHotels[i].splice(ch, 1);
                  ch--;
                }
              }
              if ($scope.allHotels[i].length <= 0) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            }
          }
        }
      };

      $scope.onCityChange = function () {
        var toDo = false;
        for (var j = 0; j < $scope.cityNames.length; j++) {
          if ($scope.cityNames[j].selected) {
            toDo = true;
            break;
          }
        }

        if (toDo) {
          for (var i = 0; i < $scope.allHotels.length; i++) {
            var isFound = true;
            if ($scope.view == 'list') {
              for (var j = 0; j < $scope.cityNames.length; j++) {
                if (!$scope.cityNames[j].selected && $scope.cityNames[j].name == $scope.allHotels[i].address.city) {
                  isFound = false;
                }
              }
              if (!isFound) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            } else {
              for (var ch = 0; ch < $scope.allHotels[i].length; ch++) {
                isFound = true;
                for (var j = 0; j < $scope.cityNames.length; j++) {
                  if ($scope.cityNames[j].selected && $scope.cityNames[j].name === $scope.allHotels[i][ch].address.city) {
                    isFound = false;
                  }
                }
                if (isFound) {
                  $scope.allHotels[i].splice(ch, 1);
                  ch--;
                }
              }
              if ($scope.allHotels[i].length <= 0) {
                $scope.allHotels.splice(i, 1);
                i--;
              }
            }
          }
        }
      }

      $scope.mergeArray = function () {
        var tempListing = [];
        for (var i = 0; i < $scope.allHotels.length; i++) {
          if ($scope.allHotels[i].length === 1) {
            tempListing.push($scope.allHotels[i]);
            $scope.allHotels.splice(i, 1);
            i--;
          }
        }
        for (var i = 0; i < tempListing.length;
             (i = i + 2)) {
          if (tempListing[i + 1] != undefined) tempListing[i].push(tempListing[i + 1][0]);
          $scope.allHotels.push(tempListing[i]);
        }
      };

      $scope.onFilterChange = function () {
        $scope.allHotels = angular.copy($scope.hotelsList);
        $scope.onPriceChange();
        $scope.onHotelSearch();
        $scope.onPropertyTypeChange();
        $scope.onRoomFacilityChange();
        $scope.onFacilityChange();
        if ($scope.isState) $scope.onCityChange();
        if ($scope.view == 'grid') $scope.mergeArray();
        if ($scope.allHotels.length > 0) $scope.pageChanged();
      };

      $scope.$watch(function () {
        return $scope.slider.min
      }, function (obj) {
        if (obj != null) {
          $scope.onFilterChange();
        }
      }, true);

      $scope.$watch(function () {
        return $scope.slider.max
      }, function (obj) {
        if (obj != null) {
          $scope.onFilterChange();
        }
      }, true);
    });


    // Get nearby locations hotels
    $http.get('/api/getLocations').success(function (res) {
      $scope.loca = res.locations;
      if ($stateParams.location != undefined) {
        var location = parseInt($stateParams.location);
        var location = _.find($scope.loca, {
          'city_id': location
        });
        var stateId  = location.state_id;
        var params   = {
          adults: $stateParams.adults,
          checkin: $stateParams.checkin,
          checkout: $stateParams.checkout,
          country: $stateParams.country,
          deal: $stateParams.deal,
          location: undefined,
          promo: $stateParams.promo,
          propertyType: $stateParams.propertyType,
          rooms: $stateParams.rooms,
          stateId: stateId
        }

        //  finding near by Hotels
        HotelsServices.get(params).success(function (res) {
          $scope.nearHotels = res.Hotel_Details;
          for (var i = 0; i < $scope.nearHotels.length; i++) {
            if ($scope.nearHotels[i].address.cityId === $stateParams.location) {
              $scope.nearHotels.splice(i, 1);
              i--;
            }
          }
          if (res.Hotel_Details) {
            var hotels = res.Hotel_Details;
            var params = {
              headers: {
                "params": ((_.map($scope.nearHotels, 'hotel_id')).join())
              }
            };

            $http.get('/api/reviews', params).success(function (res) {
              for (var i = 0; i < res.length; i++) {
                $scope.hotelReviews.push(res[i]);
              }
              ;
            });

            for (var i = 0; i < hotels.length; i++) {
              hotels[i].isAvailable = false;
              if (hotels[i].price != undefined && hotels[i].price != null && hotels[i].inventory>0) {
                if (hotels[i].price.discounted > 0) hotels[i].isAvailable = true;
              }
            }
            _(hotels).forEach(function (hotel) {
              if (hotel.price != undefined && hotel.price != null)
                calculateAll(hotel, $scope.guest)
            });

            $scope.listNearHotels = hotels;
            $scope.gridNearHotels = _.chunk(hotels, 2);
          }
        });
      }
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

    $scope.openMapModal = function ($event, hotel) {
      $event.preventDefault();
      $event.stopPropagation();
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/staydilly/modules/users/client/views/modals/maps.client.html',
        controller: 'mapsController',
        controllerAs: '$ctrl',
        resolve: {
          hotel: function () {
            return hotel;
          }
        }
      });
    };
  }
}());
