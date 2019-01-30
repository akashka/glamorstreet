(function() {
    'use strict';

    angular
        .module('termsConditions')
        .controller('termsConditionsController', termsConditionsController);

    termsConditionsController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns','MetaTagsServices', 'CLIENT', 'StaticPage'];

    function termsConditionsController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, CLIENT, StaticPage) {
      StaticPage.get().success(function (res) {
        var pages = res;
        if(pages != undefined && pages.length > 0){
          $scope.data = _.find(pages, {'screen': 'Terms And Conditions'});;
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      window.scrollTo(0, 0);

    }
}());
