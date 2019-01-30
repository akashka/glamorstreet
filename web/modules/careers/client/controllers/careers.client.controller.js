(function() {
    'use strict';

    angular
        .module('careers')
        .controller('careersController', careersController);

    careersController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices'];

    function careersController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices) {
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
