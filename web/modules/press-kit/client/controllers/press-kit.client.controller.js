(function() {
    'use strict';

    angular
        .module('pressKit')
        .controller('pressKitController', pressKitController);

    pressKitController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'CLIENT', 'StaticPage'];

    function pressKitController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, CLIENT, StaticPage) {
      StaticPage.get().success(function (res) {
        var pages = res;
        if(pages != undefined && pages.length > 0){
          $scope.data = _.find(pages, {'screen': 'Press Kit'});;
        }
      });

      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
      window.scrollTo(0, 0);

    }
}());
