(function() {
    'use strict';

    angular
        .module('hotelsResorts')
        .controller('hotelsResortsController', hotelsResortsController);

    hotelsResortsController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices'];

    function hotelsResortsController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices) {
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
