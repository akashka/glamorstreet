(function() {
    'use strict';

    angular
        .module('cms.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

  function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('cms', {
                url: '/admin',
                templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/cms.client.view.html',
                controller: 'cmsController',
                controllerAs: 'vm',
                data: {
                  roles: ['admin'],
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Content Management System'
                  }
                }
            })
            .state('cms.dashboard', {
              url: '/dashboard',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/dashboard.client.view.html',
              controller: 'dashboardCmsController',
              controllerAs: 'vm'
            })
            .state('cms.collections', {
              url: '/collections',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/collections.client.view.html',
              controller: 'collectionsController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.collections);
                }],
                propertyTypes: ['$http', function($http){
                  return $http.get('/api/getPropertytype').success(function(res) {
                    return res.PropertyList;
                  });
                }],
                selectedCollections: ['SelectedCollections', function (SelectedCollections) {
                  return SelectedCollections.get();
                }]
              }
            })
            .state('cms.dealsCms', {
              url: '/deals',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/deals.client.view.html',
              controller: 'dealsController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.deals);
                }],
                dealsData: function (Deals) {
                  return Deals.get();
                },
                myDeals: function ($http) {
                  return $http.get('/api/deals');
                },
                hotelsList: function (HotelsServices) {
                    // Get the checkin and checkin dates. Set to get the packages for next 50 days.
                    var n = 1; //number of days to add (cutoff days).
                    var today = new Date();
                    var params = {
                      checkin:  moment().add(1, 'd').format('MM/DD/YYYY'),
                      checkout: moment().add(2, 'd').format('MM/DD/YYYY'),
                      rooms: 1,
                      adults: 2
                    };
                  return HotelsServices.get(params);
                }
              }
            })
            .state('cms.blog', {
              url: '/blog',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/blog.client.view.html',
              controller: 'blogController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.blogs);
                }],
                blogsData: function (Blogs) {
                  return Blogs.get();
                },
                selectedBlogs: function (SelectedBlogs) {
                  return [];
                }
              }
            })
            .state('cms.locations', {
              url: '/locations',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/locations.client.view.html',
              controller: 'locationsController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.locations);
                }],
                allCities: ['$http', function($http){
                  return $http.get('/api/getLocations').success(function(loc) {
                    return loc;
                  });
                }],
                selectedLocations: ['SelectedLocations', function (SelectedLocations) {
                  return SelectedLocations.get();
                }]
              }
            })
            .state('cms.packags', {
              url: '/packags',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/packags.client.view.html',
              controller: 'cmsPackagsController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.packags);
                }],
                allPackags: ['$http', function($http){
                  return $http.get('/api/getPackags').success(function(pack) {
                    return pack;
                  });
                }],
                selectedPackags: ['SelectedPackags', function (SelectedPackags) {
                  return SelectedPackags.get();
                }]
              }
            })
            .state('cms.hotels', {
              url: '/hotels',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/hotels.client.view.html',
              controller: 'hotelsCmsController',
              controllerAs: 'vm',
              resolve: {
                hotelsData: function (Hotels) {
                  return Hotels.get();
                }
              }
            })
            .state('cms.staticPages', {
              url: '/static-pages',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/static-pages.client.view.html',
              controller: 'cmsStaticPagesController',
              controllerAs: 'vm',
              resolve: {
                css: function ($http) {
                  return $http.get('/api/css');
                }
              }
            })
            .state('cms.currencies', {
              url: '/currencies',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/currencies.client.view.html',
              controller: 'currenciesController',
              controllerAs: 'vm',
              resolve: {
                  heading: ['Heading', 'HEADING', function(Heading, HEADING){
                    return Heading.get(HEADING.currencies);
                   }]
              }
            })
            .state('cms.destinations', {
                url: '/destinations',
                templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/destinations.client.view.html',
                controller: 'destinationsCmsController',
                controllerAs: 'vm',
                resolve: {
                  heading: ['Heading', 'HEADING', function(Heading, HEADING){
                    return Heading.get(HEADING.destinations);
                  }],
                  allCities: ['$http', function($http){
                    return $http.get('/api/getLocations').success(function(loc) {
                      return loc;
                    });
                  }],
                  selectedLocations: ['SelectedLocations', function (SelectedLocations) {
                    return SelectedLocations.get();
                  }]
                }
            })
            .state('cms.metatags', {
              url: '/metatags',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/metatags.client.view.html',
              controller: 'metatagsController',
              controllerAs: 'vm',
              resolve: {
                  heading: ['Heading', 'HEADING', function(Heading, HEADING){
                    return Heading.get(HEADING.metatags);
                   }]
              }
            })
            .state('cms.promotion', {
              url: '/promotion',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/promotions.client.view.html',
              controller: 'promotionsController',
              controllerAs: 'vm',
              resolve: {
                heading: ['Heading', 'HEADING', function(Heading, HEADING){
                  return Heading.get(HEADING.promotions);
                }]
              }
            })
            .state('cms.editor', {
              url: '/editor',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/editor.client.view.html',
              controller: 'editorController',
              controllerAs: 'vm',
              resolve: {
                css: function ($http) {
                  return $http.get('/api/css');
                }
              }
            })
            .state('cms.users', {
              url: '/users',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/users.client.view.html',
              controller: 'cmsUsersDataController',
              controllerAs: 'vm',
                resolve: {
                  Users: function (UsersPage) {
                    return UsersPage.get();
                  }
                }
            })
            .state('cms.orderDetails', {
              url: '/orderDetails',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/orderDetails.client.view.html',
              controller: 'cmsOrderDetailsDataController',
              controllerAs: 'vm'
            })
            .state('cms.maintenance', {
              url: '/maintenance',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/maintenance.client.view.html',
              controller: 'cmsMaintenanceDataController',
              controllerAs: 'vm'
            })
            .state('cms.newsletter', {
              url: '/newsletter',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/newsletter.client.view.html',
              controller: 'cmsNewsletterController',
              controllerAs: 'vm'
            })
            .state('cms.hotelDetails', {
              url: '/hotelDetails',
              templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/hotelDetails.client.view.html',
              controller: 'cmsHotelDetailsController',
              controllerAs: 'vm'
            });
    }
}());

