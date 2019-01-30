(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsHotelDetailsController', cmsHotelDetailsController);

    cmsHotelDetailsController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'HotelsServices'];

    function cmsHotelDetailsController($scope, Authentication, $rootScope, $http, Notification, $uibModal, CLIENT, HotelsServices) {
      $rootScope.page = "Hotel Details";
      $scope.dataLoader = true;
      $scope.hotelDetails = [];
      var count = 0;

      var currencyId = _.map((_.uniqBy($rootScope.locations, 'country_id')),'country_id');

      if(currencyId != null && currencyId != undefined && currencyId.length > 0){
        for(var i = 0; i < currencyId.length; i++){
            count++;
            var params = {
              country: currencyId[i],
              rooms: 1,
              adults: 2
            };
            HotelsServices.get(params).success(function(res) {
              count--;
              if(res && res.Hotel_Details) $scope.hotelDetails = $scope.hotelDetails.concat(res.Hotel_Details);
              $scope.dataLoader = (count > 0)? true : false;
            });
        }
      }

      $scope.cmsExportToCsvCtrl = function() {
        if($scope.hotelDetails != null && $scope.hotelDetails != undefined && $scope.hotelDetails.length > 0){
          var csvRows = [];
          csvRows.push('Hotel ID, Hotel Name, Address, City, State, Country, Latitude, Longitude, Is Wholesaler, Property Type, Currency');
          for(var i = 0; i < $scope.hotelDetails.length; i++){
            var str = $scope.hotelDetails[i].hotel_id + ',' + $scope.hotelDetails[i].hotel_name + ',' + $scope.hotelDetails[i].address.address_Line.replace(/[\r\,\n]/gm, " ")
            + ',' + $scope.hotelDetails[i].address.city + ',' + $scope.hotelDetails[i].address.state + ',' + $scope.hotelDetails[i].address.country + ',' + $scope.hotelDetails[i].coordinates.latitude
            + ',' + $scope.hotelDetails[i].coordinates.longitude + ',' + $scope.hotelDetails[i].isWholeSaler + ',' + $scope.hotelDetails[i].property_type + ',' + $scope.hotelDetails[i].currency;
            csvRows.push(str);
          }
          var data = csvRows.join('\r\n');
          var csvGenerator = new CsvGenerator(data, 'hotelDetails.csv');
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
