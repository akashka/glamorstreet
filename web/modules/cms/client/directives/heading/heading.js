(function () {
  'use strict';

  angular
    .module('core', [])
    .directive('heading', CmsHeadingCtrl);

  CmsHeadingCtrl.$inject = ['Heading', 'toastr', 'CLIENT'];

  function CmsHeadingCtrl(Heading, toastr, CLIENT) {
    var directive = {
      restrict: 'AE',
      scope: {
        headingObject: "="
      },
      templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/directives/cms-heading.client.view.html',
      link: link
    };
    return directive;

    function link(scope, element) {
      scope.saveHeading = function () {
        if (scope.headingObject._id) {
          updateHeading();
        } else {
          createHeading();
        }
      };

      function createHeading() {
        Heading.post(scope.headingObject).success(function () {
          toastr.success('Heading Saved Successfully');
        });
      }

      function updateHeading() {
        Heading.put(scope.headingObject, scope.headingObject._id).success(function () {
          toastr.success('Heading Updated Successfully');
        });
      }
    }

  }

}());
