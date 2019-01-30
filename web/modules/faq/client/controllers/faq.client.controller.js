(function() {
    'use strict';

    angular
        .module('faq')
        .controller('faqController', faqController);

    faqController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices'];

    function faqController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices) {
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();

    }
}());
