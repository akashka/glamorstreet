  (function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsOrderDetailsDataController', cmsOrderDetailsDataController);

    cmsOrderDetailsDataController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'OrderDetails'];

    function cmsOrderDetailsDataController($scope, Authentication, $rootScope, $http, Notification, $uibModal, CLIENT, OrderDetails) {
      $rootScope.page = "Orders";
      $scope.dataLoader = false;

      OrderDetails.get().success(function (response) { 
        $scope.orders = response;      
        _($scope.orders).forEach(function(order){
          order.curr = getCurrency(order.currency);
        });  
      });

      var getCurrency = function(currencyCode){
             if (currencyCode == 24) return "AUD";
        else if (currencyCode == 3) return "EUR";
        else if (currencyCode == 14) return "IDR";
        else if (currencyCode == 18) return "MYR";
        else if (currencyCode == 7) return "SGD";
        else if (currencyCode == 5) return "THB";
        else if (currencyCode == 2) return "USD";
        else if (currencyCode == 25) return "MVR";
        else if (currencyCode == 1) return "INR";
      };

      $scope.cmsExportToCsvCtrl = function() {
        if($scope.orders != null && $scope.orders != undefined && $scope.orders.length > 0){
          var csvRows = [];
          csvRows.push('Reference ID, Search ID, Source, Status, Check In, CheckOut, Rooms, Pax, Name, Mobile, Email Id, Conversion rate, discounts, Sub Total, Service Tax, Total Amount, Promo Code');
          for(var i = 0; i < $scope.orders.length; i++){
            var str = $scope.orders[i].refrenceId + ',' + $scope.orders[i].searchId + ',' + $scope.orders[i].source + ',' + $scope.orders[i].status
                + ',' + $scope.orders[i].checkInDate + ',' + $scope.orders[i].checkOutDate + ',' + $scope.orders[i].noOfRooms
                + ',' + $scope.orders[i].totalPax + ',' + $scope.orders[i].firstName + $scope.orders[i].lastName + ',' + $scope.orders[i].mobileNo
                + ',' + $scope.orders[i].emailId + ',' + parseFloat($scope.orders[i].conversionRate).toFixed(2) + " " + $scope.orders[i].curr
                + ',' + parseFloat($scope.orders[i].discounts).toFixed(2) + " " + $scope.orders[i].curr + ',' + parseFloat($scope.orders[i].subTotal).toFixed(2) + " " + $scope.orders[i].curr
                + ',' + parseFloat($scope.orders[i].serviceTax).toFixed(2) + " " + $scope.orders[i].curr + ',' + parseFloat($scope.orders[i].totalAmount).toFixed(2) + " " + $scope.orders[i].curr
                + ',' + $scope.orders[i].promocode;
            csvRows.push(str);
          }
          var data = csvRows.join('\r\n');
          var csvGenerator = new CsvGenerator(data, 'orderDetails.csv');
          csvGenerator.download(true);
        }
      };

      function CsvGenerator(dataArray, fileName, separator, addQuotes) {
        this.dataArray = dataArray;
        this.fileName = fileName;
        this.separator = separator || ',';
        this.addQuotes = !!addQuotes;

        if (this.addQuotes) {
          this.separator = '"' + this.separator + '"';
        }

        this.getDownloadLink = function () {
          var separator = this.separator;
          var addQuotes = this.addQuotes;

          var type = 'data:text/csv;charset=utf-8';
          var data = this.dataArray;

          if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
          } else {
            data = encodeURIComponent(data);
          }

          return this.downloadLink = this.downloadLink || type + ',' + data;
        };

        this.getLinkElement = function (linkText) {
          var downloadLink = this.getDownloadLink();
          return this.linkElement = this.linkElement || $('<a>' + (linkText || '') + '</a>', {
              href: downloadLink,
              download: this.fileName
            });
        };

        // call with removeAfterDownload = true if you want the link to be removed after downloading
        this.download = function (removeAfterDownload) {
          this.getLinkElement().css('display', 'none').appendTo('body');
          this.getLinkElement()[0].click();
          if (removeAfterDownload) {
            this.getLinkElement().remove();
          }
        };
      };

    }
}());
