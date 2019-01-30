(function() {
    'use strict';

    angular
        .module('partnerPortal')
        .controller('partnerPortalController', partnerPortalController);

    partnerPortalController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'StaticPage'];

    function partnerPortalController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, StaticPage) {
      StaticPage.get().success(function (res) {
        var pages = res;
        if(pages != undefined && pages.length > 0){
          $scope.data = _.find(pages, {'screen': 'Partners Portal'});;
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      window.scrollTo(0, 0);

    }
}());
