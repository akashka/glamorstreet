(function () {
  'use strict';

  angular
    .module('cms.services')
    .constant('HEADING',{
      deals: 'DEALS',
      collections: 'COLLECTIONS',
      locations: 'LOCATIONS',
      blogs: 'BLOGS',
      promotions: 'PROMOTIONS',
      packags: 'PACKAGS',
      currencies: 'CURRENCIES',
      hotels: 'HOTELS',
      metatags: 'METATAGS',
      destinations: 'DESTINATIONS'
    })
    .factory('Hotels', Hotels)
    .factory('Deals', Deals)
    .factory('Blogs', Blogs)
    .factory('Collections', Collections)
    .factory('Heading', Heading)
    .factory('SelectedBlogs', SelectedBlogs)
    .factory('SelectedCollections', SelectedCollections)
    .factory('Locations', Locations)
    .factory('SelectedLocations', SelectedLocations)
    .factory('Promos', Promos)
    .factory('StaticPage', StaticPage)
    .factory('UsersPage', UsersPage)
    .factory('Currency', Currency)
    .factory('Metatag', Metatag)
    .factory('Packags', Packags)
    .factory('SelectedPackags', SelectedPackags)
    .factory('Destinations', Destinations)
    .factory('OrderDetails', OrderDetails)
    .factory('Maintenance', Maintenance)
    .factory('SearchLogger', SearchLogger)
    .factory('Newsletter', Newsletter)
    .factory('FavouriteHotels', FavouriteHotels)

  Hotels.$inject = ['$resource', '$log', '$http'];
  function Hotels($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('http://private-5b1ef-staydilly.apiary-mock.com/hotels');
      }
    }
  }
  Deals.$inject = ['$resource', '$log', '$http'];
  function Deals($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/getDeals');
      }
    }
  }
  Blogs.$inject = ['$resource', '$log', '$http'];
  function Blogs($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/blogs');
      },
      post: function(blogSelected){
        return $http.post('/api/selectedBlog', blogSelected);
      },
      put: function(blogSelected, blogId){
        return $http.put('/api/selectedBlog/' + blogId, blogSelected);
      }
    }
  }
  SelectedBlogs.$inject = ['$resource', '$log', '$http'];
  function SelectedBlogs($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/selectedBlogs');
      }
    }
  }
  Collections.$inject = ['$resource', '$log', '$http'];
  function Collections($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/collections');
      },
      post: function(collectionSelected){
        return $http.post('/api/selectedCollection', collectionSelected);
      },
      put: function(collectionSelected, collectionId){
        return $http.put('/api/selectedCollection/' + collectionId, collectionSelected);
      }
    }
  }
  SelectedCollections.$inject = ['$resource', '$log', '$http'];
  function SelectedCollections($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/selectedCollections');
      }
    }
  }
  Locations.$inject = ['$resource', '$log', '$http'];
  function Locations($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/locations');
      },
      post: function(selectedLocation){
        return $http.post('/api/selectedLocation', selectedLocation);
      },
      put: function(selectedLocation, locationId){
        return $http.put('/api/selectedLocation/' + locationId, selectedLocation);
      }
    }
  }
  SelectedLocations.$inject = ['$resource', '$log', '$http'];
  function SelectedLocations($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/selectedLocations');
      }
    }
  }
  Packags.$inject = ['$resource', '$log', '$http'];
  function Packags($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/packags');
      },
      post: function(selectedPackag){
        return $http.post('/api/selectedPackag', selectedPackag);
      },
      put: function(selectedPackag, packagId){
        return $http.put('/api/selectedPackag/' + packagId, selectedPackag);
      }
    }
  }
  SelectedPackags.$inject = ['$resource', '$log', '$http'];
  function SelectedPackags($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/selectedPackags');
      }
    }
  }
  Promos.$inject = ['$resource', '$log', '$http'];
  function Promos($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/Promos');
      },
      post: function(selectedPromo){
        return $http.post('/api/Promos', selectedPromo);
      },
      put: function(selectedPromo, promoId){
        return $http.put('/api/Promos/' + promoId, selectedPromo);
      }
    }
  }
  StaticPage.$inject = ['$resource', '$log', '$http'];
  function StaticPage($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/StaticPages');
      },
      post: function(StaticPages, StaticPageType){
        return $http.post('/api/StaticPages/' + StaticPageType, StaticPages);
      },
      put: function(StaticPages, StaticPageType){
        return $http.put('/api/StaticPages/' + StaticPageType, StaticPages);
      }
    }
  }

  UsersPage.$inject = ['$resource', '$log', '$http'];
  function UsersPage($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/users');
      },
      put: function(userDetails, userDetailsId){
        return $http.put('/api/users/' + userDetailsId, userDetails);
      }
    }
  }


  Currency.$inject = ['$resource', '$log', '$http'];
  function Currency($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/currency');
      },
      post: function(currency){
        return $http.post('/api/currency', currency);
      },
      put: function(currency, currencyId){
        return $http.put('/api/currency/' + currencyId, currency);
      }
    }
  }
  Destinations.$inject = ['$resource', '$log', '$http'];
  function Destinations($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/destinations');
      },
      post: function(destination){
        return $http.post('/api/destinations', destination);
      },
      put: function(destination, destinationId){
        return $http.put('/api/destinations/' + destinationId, destination);
      }
    }
  }
  OrderDetails.$inject = ['$resource', '$log', '$http'];
  function OrderDetails($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/orderDetails');
      },
      post: function(orderDetail){
        return $http.post('/api/orderDetails', orderDetail);
      },
      put: function(orderDetail, _id){
        return $http.put('/api/orderDetails/' + _id, orderDetail);
      }
    }
  }
  Metatag.$inject = ['$resource', '$log', '$http'];
  function Metatag($resource, $log, $http) {
    return {
      get: function () {
        return $http.get('/api/metatag');
      },
      post: function(metatag){
        return $http.post('/api/metatag', metatag);
      },
      put: function(metatag, metatagId){
        return $http.put('/api/metatag/' + metatagId, metatag);
      }
    }
  }
  Heading.$inject = ['$resource', '$log', '$http'];
  function Heading($resource, $log, $http) {
    return {
          get: function (headingName) {
            return $http.get('/api/heading/'+ headingName);
          },
          post: function(heading){
            return $http.post('/api/heading', heading);
          },
          put: function(heading, headingId){
            return $http.put('/api/heading/' + headingId, heading);
          }
        }
  }
  Maintenance.$inject = ['$resource', '$log', '$http'];
  function Maintenance($resource, $log, $http) {
    return {
          get: function (maintenance) {
            return $http.get('/api/maintenance');
          },
          put: function(maintenance, maintenanceId){
            return $http.put('/api/maintenance/' + maintenanceId, maintenance);
          }
        }
  }

  SearchLogger.$inject = ['$resource', '$log', '$http'];
  function SearchLogger($resource, $log, $http) {
    return {
      post: function (searchLogger) {
        return $http.post('/api/searchLogger', searchLogger);
      }
    }
  }
  Newsletter.$inject = ['$resource', '$log', '$http'];
  function Newsletter($resource, $log, $http) {
    return {
          get: function () {
            return $http.get('/api/newsletter');
          },
          post: function(newsletter){
            return $http.put('/api/newsletter', newsletter);
          }
        }
  }
  FavouriteHotels.$inject = ['$resource', '$log', '$http'];
  function FavouriteHotels($resource, $log, $http) {
    return {
      get: function (user_id) {
        return $http.get('/api/favouriteHotels/' + user_id);
      },
      post: function(favouriteHotels){
        return $http.post('/api/favouriteHotels', favouriteHotels);
      },
      put: function(favouriteHotels, user_id){
        return $http.put('/api/favouriteHotels/' + user_id, favouriteHotels);
      }
    }
  }
}());
