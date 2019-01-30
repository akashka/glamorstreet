(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsNewsletterController', cmsNewsletterController);

    cmsNewsletterController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'Newsletter'];

    function cmsNewsletterController($scope, Authentication, $rootScope, $http, Notification, $uibModal, CLIENT, Newsletter) {
      $rootScope.page = "Newsletter";
      $scope.dataLoader = false;

      Newsletter.get().success(function (response) { 
        $scope.newsletterList = response;      
      });

      $scope.cmsExportToCsvCtrl = function() {
        if($scope.newsletterList != null && $scope.newsletterList != undefined && $scope.newsletterList.length > 0){
          var csvRows = [];
          csvRows.push('Email Id');
          for(var i = 0; i < $scope.newsletterList.length; i++){
            var str = $scope.newsletterList[i].emailId;
            csvRows.push(str);
          }
          var data = csvRows.join('\r\n');
          var csvGenerator = new CsvGenerator(data, 'newsletterDetails.csv');
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
