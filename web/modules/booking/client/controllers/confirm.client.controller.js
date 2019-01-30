(function() {
    'use strict';

        angular
            .module('booking')
            .controller('confirmController', contactController);

        contactController.$inject = ['$scope', 'Authentication', '$rootScope', '$stateParams', 'GoogleAdWordsService', '$timeout', 'BookingServices', 'OrderDetails', 'CLIENT', '$sce'];

        function contactController($scope, Authentication, $rootScope, $stateParams, GoogleAdWordsService, $timeout, BookingServices, OrderDetails, CLIENT, $sce) {
          $rootScope.dataReceived = false;
          $timeout(function() {
            window.scrollTo(0, 130);
          }, 100);

        BookingServices.getOrderDetails($stateParams).success(function(res) {
            $rootScope.dataReceived = true;
            $scope.orderId = res.refrenceId;
            $scope.emailId = res.emailId;
            $scope.rooms = res.roomType;
            $scope.appliedPromoCode = res.appliedPromoCode;
            $scope.checkout = res.checkOutDate;
            $scope.night = $scope.nights = res.noOfnights;
            $scope.amt = res.totalAmount;
            $scope.hotelId = res.hotelId;
            $scope.serviceTax = res.serviceTax;
            $scope.status = res.status;
            $scope.checkin = res.checkInDate;
            $scope.promocode = res.promocode;
            $scope.noRooms = res.noOfRooms;
            $scope.hotelContactNo = res.hotelContactNo;
            $scope.image_URL = res.image_URL;
            $scope.name = res.firstName + " " + res.lastName;
            $scope.hoteladdress = res.hoteladdress;
            $scope.mobileNo = res.mobileNo;
            $scope.hotelName = res.hotelName;
            $scope.dealName = res.DealName;
            $scope.specialRequest = res.specialRequest;
            $scope.adult = res.adults;
            $scope.curr = res.currency;

            // Enter in local Database
             OrderDetails.get().success(function (response) { 
                    $scope.data = _.find(response, {"refrenceId": $stateParams.orderId});
                    if($scope.data != null && $scope.data != undefined){
                        $scope.data.status = "Confirmed";
                        $scope.data.hotelName = $scope.hotelName;
                        OrderDetails.put($scope.data, $scope.data._id).success(function (response) { });
                    }
             });   

             function getNights(checkin, checkout) {
                var ci = moment(new Date(checkin));
                var co = moment(new Date(checkout));
                return co.diff(ci, 'days');
              }

              $scope.ecommerce = {
                id: $stateParams.orderId,
                revenue: $scope.amt,
                currency: $scope.curr,
                name: $scope.hotelName,
                category: $scope.rooms,
                price: $scope.amt,
                quantity: ($scope.noRooms * getNights($scope.checkin, $scope.checkout)),
              };

            // google track code call
            if(CLIENT.name == 'staydilly'){
                GoogleAdWordsService.sendRegisterCustomerConversion($scope.curr, $scope.amt, $scope.ecommerce);
                var involveAsia = "https://tracking.shopstylers.com/aff_l?offer_id=1310&adv_sub=" + $stateParams.orderId 
                + "&amount=" + $scope.amt + "&adv_sub2=" + $scope.curr + "&adv_sub3=" + $scope.emailId;
                $scope.player = $sce.trustAsHtml('<iframe src=\"' + involveAsia + '\" scrolling="no" frameborder="0" style="width:1px; height:1px;"></iframe>');
            }

        });

        $scope.printDiv = function(div) {
            var docHead = document.head.outerHTML;
            var printContents = "<img id=\"logo\" src=\"views/staydilly/modules/core/client/images/top-banner-doc.jpg\" style=\"width: 100%; padding-bottom:20px;\" alt=\"\">";
            printContents += document.getElementById(div).outerHTML;
            var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";

            var newWin = window.open("", "_blank", winAttr);
            var writeDoc = newWin.document;
            writeDoc.open();
            writeDoc.write('<!doctype html><html>' + docHead + '<body onLoad="window.print()">' + printContents + '</body></html>');
            writeDoc.close();
            newWin.focus();
        };

    }
}());
