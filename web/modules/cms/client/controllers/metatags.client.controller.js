(function() {
    'use strict';

    angular
        .module('cms')
        .controller('metatagsController', metatagsController);

    metatagsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'toastr', 'heading', 'HEADING', 'CLIENT', 'Metatag', '$uibModal', 'Notification'];

    function metatagsController($scope, Authentication, $rootScope, $http, toastr, heading, HEADING, CLIENT, Metatag, $uibModal, Notification) {

      $rootScope.page = 'metatags';
      $scope.metatags = [];
      $scope.screens = ['homepage','aboutUs', 'contact','faq', 'howWeWork', 'careers', 'pressMedia', 'pressKit', 'pressRelease', 'partnerPortal', 'becomePartner', 'privacyPolicy', 'termsConditions','hotelsResorts','destinations', 'deals','booking', 'experiences', 'packages', 'terms-and-conditions', 'help', 'travel-forum', 'techSauce', 'breakbulk'];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.metatags};
      $scope.rightSectionVisibility = false;
      $scope.editing = false;
      $scope.count = 0;

      // on select change
      $scope.setItem = function (item) {
        $scope.metatag.screen = item;
      };

      $scope.addMetatag = function(){
        $scope.metatag = {
          screen: "",
          url: "",
          imageUrl: "",
          keywords: "",
          title: "",
          description: ""
        };
        $scope.editing = false;
        $scope.rightSectionVisibility = true;
      };

      $scope.editMetatag = function(id){
        $scope.rightSectionVisibility = true;
        $scope.editing = true;
        $scope.metatag = _.find($scope.metatags, ['_id', id]);
      };

      Metatag.get().success(function (res) {
          $scope.metatags = res;
      });

      $scope.updateMetatag = function () {
        var metaTagId = $scope.metatag._id;
        delete $scope.metatag._id;
        Metatag.put($scope.metatag, metaTagId).success(function (res) {
          Metatag.get().success(function (res) { //getting newly Updated meta tags.
            $scope.metatags = res;
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully!' });
          $scope.rightSectionVisibility = false;
        })
      };

      $scope.saveMetatag = function () {
        Metatag.post($scope.metatag).success(function (res) {
          Metatag.get().success(function (res) { //getting newly added meta tags
            $scope.metatags = res;
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully!' });
          $scope.rightSectionVisibility = false;
        })
      };
    }
}());
