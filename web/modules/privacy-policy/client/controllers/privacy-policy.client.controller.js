(function() {
    'use strict';

    angular
        .module('privacyPolicy')
        .controller('privacyPolicyController', privacyPolicyController);

    privacyPolicyController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'CLIENT', 'StaticPage'];

    function privacyPolicyController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, CLIENT, StaticPage) {
      StaticPage.get().success(function (res) {
        var pages = res;
        if(pages != undefined && pages.length > 0){
          $scope.data = _.find(pages, {'screen': 'Privacy Policy'});;
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      window.scrollTo(0, 0);

    }
}());
