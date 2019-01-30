(function() {
    'use strict';

    angular
        .module('becomePartner')
        .controller('becomePartnerController', becomePartnerController);

    becomePartnerController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'StaticPage'];

    function becomePartnerController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, StaticPage) {
      StaticPage.get().success(function (res) {
        var pages = res;
        if(pages != undefined && pages.length > 0){
          $scope.data = _.find(pages, {'screen': 'Become A Partner'});;
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      window.scrollTo(0, 0);

    }
}());
