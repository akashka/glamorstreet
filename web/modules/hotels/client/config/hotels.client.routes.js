(function() {
    'use strict';

    angular
        .module('hotels.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('list', {
                url: '/hotels?location?stateId?country?checkin?checkout?rooms?adults?deal?propertyType?promo',
                templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/hotels.client.view.html',
                controller: 'hotelsController',
                controllerAs: 'vm'
            })
            .state('deals', {
              url: '/deals?location?stateId?country?checkin?checkout?rooms?adults?deal?propertyType?promo',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/hotels.client.view.html',
              controller: 'hotelsController',
              controllerAs: 'vm',
              data: {
                meta: {
                  'title': CLIENT.capitalizeName + ' | Deals'
                }
              }
            })
            .state('hotels', {
              url: '/hotels?location?stateId?country?checkin?checkout?rooms?adults?deal?propertyType?promo',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/hotels.client.view.html',
              controller: 'hotelsController',
              controllerAs: 'vm'
            })
            .state('view', {
                url: '/hotel/:url?searchId?productId?location?checkin?checkout?rooms?adults?promo?referenceId',
                templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/ViewHotel.client.view.html',
                controller: 'viewHotelController',
                controllerAs: 'vm'
              })
            .state('countryList', {
              url: '/Hotels/:country',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/LocationHotels.client.view.html',
              controller: 'locationHotelsCtrl'
            })
            .state('stateList', {
              url: '/Hotels/:country/:stateId',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/LocationHotels.client.view.html',
              controller: 'locationHotelsCtrl'
            })
            .state('cityDisplay', {
              url: '/Hotels/:country/:stateId/:city',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/LocationHotels.client.view.html',
              controller: 'locationHotelsCtrl'
            })
            .state('virtualTechSauceCity', {
              url: '/techsauce',
              templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/virtualCityHotels.client.view.html',
              controller: 'virtualCityHotelsCtrl'
            })
            .state('virtualBreakBulkCity', {
               url: '/breakbulk',
               templateUrl: '/views/' + CLIENT.name + '/modules/hotels/client/views/breakbulk.client.view.html',
              controller: 'virtualCityHotelsCtrl'
            })
    }
}());
