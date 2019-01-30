(function() {
    'use strict';

    angular
        .module('homepage')
        .controller('contactController', contactController);

    contactController.$inject = ['$scope', 'Authentication', '$http', 'vcRecaptchaService', 'patterns', 'MetaTagsServices', 'CLIENT'];

    function contactController($scope, Authentication, $http, vcRecaptchaService, patterns, MetaTagsServices, CLIENT) {

        (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";

        $scope.response = null;
        $scope.widgetId = null;
        $scope.model = {
            key: "6LclRhcUAAAAAK87HmdCrgcQZlYmB0aMRjmNkhNg"
        };
        $scope.setResponse = function(response) {
            $scope.response = response;
        };
        $scope.setWidgetId = function(widgetId) {
            $scope.widgetId = widgetId;
        };
        $scope.cbExpiration = function() {
            vcRecaptchaService.reload($scope.widgetId);
            $scope.response = null;
        };

      $scope.contactDetail = {};

      $scope.patterns = patterns;

        $scope.submitContactForm = function() {
            $http.post('/api/contact-form', $scope.contactDetail)
                .then(function(res) {
                    alert("Thanks for contacting us.");
                    $scope.contactDetail = {};
                });
        };

        $scope.submit = function() {
            var valid;
            var response = { captchaResponse: $scope.response };
            /**
             * SERVER SIDE VALIDATION
             * See https://developers.google.com/recaptcha/docs/verify
             */
            $http.post('/api/checkCaptcha', response)
                .then(function(res) {
                    valid = res.statusText == 'OK';
                    if (valid) {
                        console.log('Success');
                    } else {
                        console.log('Failed validation');
                        // In case of a failed validation you need to reload the captcha
                        // because each response can be checked just once
                        vcRecaptchaService.reload($scope.widgetId);
                    }
                });

        };
      //to call meta tags for this page
      MetaTagsServices.metaTagHeader();
    }
}());
