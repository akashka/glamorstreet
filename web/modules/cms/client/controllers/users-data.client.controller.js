(function() {
    'use strict';

    angular
        .module('cms')
        .controller('cmsUsersDataController', cmsUsersDataController);

    cmsUsersDataController.$inject = ['$scope', 'Authentication',  'UsersPage', '$rootScope', '$http', 'Notification', '$uibModal', 'CLIENT', 'Users', '$location', '$window'];

    function cmsUsersDataController($scope, Authentication, UsersPage, $rootScope, $http, Notification, $uibModal, CLIENT, Users, $location, $window) {
      $rootScope.page = "users";
      $scope.rightSectionVisibilty = false;
      $scope.dataLoader = false;
      $scope.displayBooking = false;

      $scope.users = Users.data;
      $scope.edituser = function(user_id){
        $scope.rightSectionVisibilty = true;
        $scope.dataLoader = false;
        $scope.selectedUser = _.find($scope.users, ['userId', user_id]);
      };

      $scope.openImageModal = function(){
        var $ctrl = this;
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/models/imageUploadModal/imageUploadModal.html',
          size: 'lg',
          controller: "ImageUploadController",
          resolve: {
            'image': function(){
              return $scope.selectedUser.profileImageURL;
            }
          }
        });

        modalInstance.result.then(function (resultImage) {
          $scope.selectedUser.profileImageURL = resultImage;
        });
      };

      $scope.cmsExportToCsvCtrl = function() {
        if($scope.users != null && $scope.users != undefined && $scope.users.length > 0){
          var csvRows = [];
          csvRows.push('DISPLAY NAME, EMAIL, FIRST NAME, LAST NAME, MOBILE NO, PROFILE IMAGE URL, ROLES, USERID, USERNAME');
          for(var i = 0; i < $scope.users.length; i++){
            var str = $scope.users[i].displayName + ',' + $scope.users[i].email + ',' + $scope.users[i].firstName + ','
              + $scope.users[i].lastName + ',' + $scope.users[i].mobileNo + ',' + $scope.users[i].profileImageURL + ','
              + $scope.users[i].roles + ',' + $scope.users[i].userId + ',' + $scope.users[i].username;
            csvRows.push(str);
          }
          var data = csvRows.join('\r\n');
          var csvGenerator = new CsvGenerator(data, 'users.csv');
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
      }

      // Function to update user to the database
      $scope.updateUser = function(){
        $scope.dataupdated = true;
        var user_id = $scope.selectedUser._id;
        delete $scope.selectedUser._id;
        UsersPage.put($scope.selectedUser, user_id).success(function (res) {
         if(res){
           Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully' });
           $scope.rightSectionVisibilty = false;
           $scope.dataupdated = false;
           for(var i = 0; i < $scope.users.length; i++){
             if($scope.users[i].userId === res.userId) $scope.users[i] = res;
           }
           $scope.selectedUser = res;
         }else{
           Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> ops, Something went wrong. Try Again!!' });
           $scope.dataupdated = false;
         }
        });
      };

      //Function to redirect to booking History
      $scope.displayBookingHistory = function(user_id){
        $scope.dataLoader = true;
        $scope.displayBooking = true;
        var para = {userId: user_id};
        var params = {
          headers: { "params": JSON.stringify(para) }
        };
        $http.get('/api/manageBook', params).success(function(res) {
          $scope.dataLoader = false;
          $scope.bookDeatils = res.Bookings;
        });
      };

      $scope.goBack = function(){
        $scope.dataLoader = true;
        $scope.displayBooking = false;
        $scope.rightSectionVisibilty = false;
        $scope.users = Users.data;
        $scope.dataLoader = false;
      };

      $scope.bookExportToCsvCtrl = function(){
        if($scope.bookDeatils != null && $scope.bookDeatils != undefined && $scope.bookDeatils.length > 0){
          var csvRows = [];
          csvRows.push('Booking Date, Booking Id, CheckIn, CheckOut, Currency, Hotel Name, No. of Rooms, Guest, Reference Id, Room Name, Status, Total Amount');
          for(var i = 0; i < $scope.bookDeatils.length; i++){
            var str = $scope.bookDeatils[i].booking_date + ',' + $scope.bookDeatils[i].booking_id + ',' + $scope.bookDeatils[i].check_in
                     + ',' + $scope.bookDeatils[i].check_out + ',' + $scope.bookDeatils[i].currency + ',' +
                    $scope.bookDeatils[i].hotel_name + ',' + $scope.bookDeatils[i].no_of_rooms + ',' + $scope.bookDeatils[i].primary_guest
                     + ',' + $scope.bookDeatils[i].reference_id + ',' + $scope.bookDeatils[i].room_name + ',' +
                    $scope.bookDeatils[i].status + ',' + parseFloat($scope.bookDeatils[i].total_amount).toFixed(2);
            csvRows.push(str);
          }
          var data = csvRows.join('\r\n');
          var csvGenerator = new CsvGenerator(data, 'booking.csv');
          csvGenerator.download(true);
        }
      };

    }
}());
