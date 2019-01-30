(function() {
    'use strict';

    angular
        .module('howWeWork')
        .controller('howWeWorkController', howWeWorkController);

    howWeWorkController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices'];

    function howWeWorkController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices) {
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
