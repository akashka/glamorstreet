(function() {
        'use strict';

        angular
            .module('core')
            .controller('HeaderController', HeaderController);

        HeaderController.$inject = ['$scope', '$state', 'Authentication', '$uibModal', '$log', '$document', '$rootScope', '$stateParams', '$http',
            '$cookieStore', '$cookies', 'CLIENT', 'HotelsServices'
        ];

        function HeaderController($scope, $state, Authentication, $uibModal, $log, $document, $rootScope, $stateParams, $http,
            $cookieStore, $cookies, CLIENT, HotelsServices) {
            $scope.bannerMessage = '';
            var currencyMultipyNUmber = 1.03;
            var $ctrl = this;
            $ctrl.authentication = Authentication;
            $scope.header = {
                "logo": {
                    "alt": "header logo",
                    "src": "/views/staydilly/modules/core/client/images/logo.png"
                },
                "topnavlink": [{
                        "title": "How we work",
                        "url": "howWeWork"
                    },
                    {
                        "title": "Deals",
                        "url": "deals"
                    }
                ]

            };
          $scope.checkin = moment().add(1, 'd').format('MM-DD-YYYY');
            $scope.checkout = moment().add(2, 'd').format('MM-DD-YYYY');

            $rootScope.isAdmin = false;
            $scope.$watch(function () { return $rootScope.user }, function (obj) {
              if (obj != null) {
                if($rootScope.user.roles.indexOf("admin") >= 0) {$rootScope.isAdmin = true;}
                // Set default currency
                if($rootScope.user.currency != undefined && $rootScope.user.currency != null && $rootScope.user.currency != "" && CLIENT.name != "staydilly")
                  $scope.onCurrencyChange($rootScope.user.currency);
                }
            }, true);

          // login widget popUp

          $ctrl.animationsEnabled = true;

          $http.get('/api/getHotels').success(function(res) {
              $scope.uniqueCurrency = _.uniq(_.map(_.flatten(res.Hotel_Details), 'currency'));
          });

          // Currency Converter
          var currencyConverter = function(newCurrency){
              $rootScope.currencyMultiplier = {
                "THB": 0.1311602,
                "USD": 4.5716550,
                "IDR": 0.0003421248,
                "SGD": 3.253152,
                "MYR": 1
              };
              $rootScope.currencyFlag = false;
              var j = 0;
              for(var i = 0; i < $scope.uniqueCurrency.length; i++){
                var params = {
                  "oldCurrency": $scope.uniqueCurrency[i],
                  "newCurrency": newCurrency
                };
                HotelsServices.currencyRate(params).success(function(res){
                  $rootScope.currencyMultiplier[res.base] = (res.rates[newCurrency] != undefined)? res.rates[newCurrency]*$scope.multiplier : 1;
                  j++;
                  if(j === $scope.uniqueCurrency.length){
                    $rootScope.currency = newCurrency;
                    $rootScope.currencyFlag = true;
                  }
                });
              }
          };
          $scope.multiplier = (CLIENT.name == 'staydilly')? currencyMultipyNUmber : 1;
          $scope.uniqueCurrency = (CLIENT.name == 'staydilly') ? ["THB","MYR", "IDR", "USD", "SGD"] : ["INR", "USD"];
          $rootScope.shiftDecimal = {"THB": 2, "MYR": 2, "IDR": 0, "USD": 2, "AUD": 2, "EUR": 2, "SGD": 2, "MVR": 2};
          $scope.onCurrencyChange = function(newCurrency){
              $scope.currency = newCurrency;
            $cookieStore.put('Currency', newCurrency);
              if($scope.uniqueCurrency != undefined && $scope.uniqueCurrency.length > 0){
                currencyConverter(newCurrency);
              }
              else{
                $http.get('/api/getHotels').success(function(res) {
                    $scope.uniqueCurrency = _.uniq(_.map(_.flatten(res.Hotel_Details), 'currency'));
                    currencyConverter(newCurrency);
                });
              }
          };

          $scope.currency = "Currency";
          if (CLIENT.name == "staydilly") $cookieStore.put('Currency', "MYR");
          var nCurrency = $cookieStore.get('Currency');
          if(nCurrency!= undefined){$scope.onCurrencyChange(nCurrency);}

          //login popup
          //staydilly
          if(CLIENT.name == 'staydilly'){
            $scope.login = function(size, parentSelector) {
              var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.loginModel ' + parentSelector)) : undefined;
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/staydilly/modules/users/client/views/authentication/authentication-popup.client.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm',
                size: size,
                appendTo: parentElem
              });

              modalInstance.result.then(function(selectedItem) {
                $ctrl.selected = selectedItem;
              }, function() {
                // $log.info('Modal dismissed at: ' + new Date());
              });
            };
          }

        }
    }());
