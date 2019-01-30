(function() {
    'use strict';

    angular
        .module('help')
        .controller('helpController', helpController);

    helpController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices','CLIENT'];

    function helpController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices,CLIENT) {
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";

    }
}());
