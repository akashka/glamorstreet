(function () {
  'use strict';

  angular
    .module('aboutUs')
    .controller('aboutUsController', aboutUsController);

  aboutUsController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'CLIENT', 'StaticPage'];

  function aboutUsController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, CLIENT, StaticPage) {

    StaticPage.get().success(function (res) {
      var pages = res;
      if (pages != undefined && pages.length > 0) {
        $scope.data = _.find(pages, {'screen': 'About Us'});
        ;
      }
    });

    //to call meta tags for this page
    MetaTagsServices.metaTagHeader();
    window.scrollTo(0, 0);

  }
}());
