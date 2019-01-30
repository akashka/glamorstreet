(function() {
  'use strict';

  angular
    .module('booking')
    .controller('packageBookingController', packageBookingController);

  packageBookingController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'HotelsServices', 'patterns',
    '$cookieStore', 'Calculate', '$stateParams', '$timeout', 'CLIENT', 'AddonsServices', 'OrderDetails', 'deviceDetector'];

  function packageBookingController($scope, Authentication, $rootScope, $http, HotelsServices, patterns,
                             $cookieStore, Calculate, $stateParams, $timeout, CLIENT, AddonsServices, OrderDetails, deviceDetector) {

    var sellExclusive = 0;
    var finalPrice = 0;
    var finalTaxes = 0;
    var discount = 0;
    $rootScope.dataReceived = false;
    $scope.patterns = patterns;

    $scope.adjustment = 0;
    $scope.totalAmount = 0;
    $scope.activityTotal = 0;
    $scope.tempActivityTotal =0;

    // Get IP details of the user and save in Mongo
    $http.get('/api/getIpDetails', params).success(function(res) {
      $scope.ipDetails = res;
    });

    // Add Ons services to get the add ons data
    // Params - Search Id and hotel Id
    var params = {
      searchId: ($stateParams.searchId).toString(),
      productId: ($stateParams.productId).toString()
    };
    AddonsServices.policies(params).success(function(res){
      $rootScope.dataReceived = true;
      $scope.policies = res.policies;
      $scope.showBookingForm = ($scope.policies != null && $scope.policies != undefined && $scope.policies.length > 0) ? false : true;

      // Function to calculate the addons
      // By default, the mandatory policies are added to the list and the amount is calculated and added to the grand total
      // Also, the maximum and minimum is calculated based on the Policy type is calculated.
      $scope.addOns = [];
      _($scope.policies).forEach(function(activity){
        activity.adults = 0;
        if(activity.policy_type_name == 'per guest') activity.maximum = $scope.guest.adults;
        else if (activity.policy_type_name == 'per room night') activity.maximum = $scope.guest.rooms * $scope.guest.nights;
        else if (activity.policy_type_name == 'per room') activity.maximum = $scope.guest.rooms;
        else if (activity.policy_type_name == 'per booking') activity.maximum = 1;
        else activity.maximum = $scope.guest.adults * $scope.guest.nights;
        if(activity.mandatory){
          activity.adults = activity.maximum;
          $scope.activityTotal += (Number(activity.maximum) * Number(activity.cost));
          //$scope.totalAmount += $scope.activityTotal;
          $scope.addOns.push({[activity.policy_id] : Number(activity.adults)});
        }
      });
    });

    // Function to get the screen to lower level, after the screen is loaded based on the timeout.
    $timeout(function() {
      (CLIENT.name == "staydilly") ? window.scrollTo(0, 470): "";
    }, 1000);

    (CLIENT.name == "traveler.mv") ? window.scrollTo(0, 0) : "";

    // Function to get the number of Nights
    // Params - Checkin and checkout date (dates)
    // Returns - Difference in checout and checkin (integer)
    function getNights(checkin, checkout) {
      var ci = strToDate(checkin);
      var co = strToDate(checkout);
      return co.diff(ci, 'days');
    };

    // Function to convert date from string format (MM-DD-YYYY) to date format (Day, Date)
    // Params - Date in MM-DD-YYYY format
    // Returns - Date in javascript format
    function strToDate(dt) {
      var d = dt.split('-');
      return moment([d[2], (Number(d[0]) - 1), d[1]]);
    };

    // Function to get back to the previous screen
    // Through window.history
    $scope.goBack = function() {
      window.history.back();
    };

    // Define the guest details from stateparams(guest number, rooms, number of nights is calculated)
    $scope.guest = {
      rooms: $stateParams.rooms ? $stateParams.rooms : 1,
      adults: $stateParams.adults ? $stateParams.adults : 2,
      nights: getNights($stateParams.checkin, $stateParams.checkout)
    };



    // Function to calculate the numnber of adults and price, if the number of adults is decreased for any Add Ons
    // Params - Policy Id (int)
    // Returns - Values arae calculated.
    $scope.spinDown = function(policyId){
      var policy = _.find($scope.policies, {"policy_id": policyId});
      policy.adults--;
      if(policy.adults < 0) policy.adults = 0;

      var isFound = false;
      for(var p = 0; p < $scope.addOns.length; p++){
        if($scope.addOns[p][policyId] != undefined && $scope.addOns[p][policyId] != null && $scope.addOns[p][policyId] >= 0){
          isFound = true;
          $scope.activityTotal -= (Number($scope.addOns[p][policyId]) * Number(policy.cost));
          $scope.addOns[p][policyId] = policy.adults;
          break;
        }
      }
      $scope.activityTotal += (Number(policy.adults) * Number(policy.cost));
      if(!isFound){
        $scope.addOns.push({[policy.policy_id] : policy.adults});
      }
    };

    // Function to calculate the numnber of adults and price, if the number of adults is increased for any Add Ons
    // Params - Policy Id (int)
    // Returns - Values arae calculated.
    $scope.spinUp = function(policyId){
      var policy = _.find($scope.policies, {"policy_id": policyId});
      policy.adults++;
      if(policy.adults > policy.maximum) policy.adults = Number(policy.maximum);

      var isFound = false;
      for(var p = 0; p < $scope.addOns.length; p++){
        if($scope.addOns[p][policyId] != undefined && $scope.addOns[p][policyId] != null && $scope.addOns[p][policyId] >= 0){
          isFound = true;
          $scope.activityTotal -= (Number($scope.addOns[p][policyId]) * Number(policy.cost));
          $scope.addOns[p][policyId] = policy.adults;
          break;
        }
      }
      $scope.activityTotal += (Number(policy.adults) * Number(policy.cost));
      if(!isFound){
        $scope.addOns.push({[policy.policy_id] : policy.adults});
      }
    };

    // Function to go to and for between the display screens i.e. Add Ons screen and customerr details form screen.
    // We are negating the parameter.
    $scope.displayBookingForm = function(){
      $scope.showBookingForm = !$scope.showBookingForm;
    };

    // Function to generate the roooms based on the adults
    // Params - Number of adults, number of rooms and details to send
    // Returns - Object to pass to the back end
    function generateRooms(adults, rooms, details) {
      var output = [];
      if (adults == rooms) {
        for (var i = 0; i < rooms; i++) {
          output.push({
            "numOfChildren": 0,
            "numOfAdults": 1,
            "ratePlanId": details.ratePlanId,
            "amount": details.amount,
            "roomId": details.roomId
          });
        }
      } else if (adults > rooms) {
        var adultRemainder = adults % rooms;
        var adultsIndividual = (adults - adultRemainder) / rooms;
        for (var i = 0; i < rooms; i++) {
          output.push({
            "numOfChildren": 0,
            "numOfAdults": (i === (rooms - 1)) ? (adultsIndividual + adultRemainder) : adultsIndividual,
            "ratePlanId": details.ratePlanId,
            "amount": details.amount,
            "roomId": details.roomId
          });
        }
      }
      return output;
    };

    // Function to calculate whether the discount is there based on the deal or promo
    // Params - Pass deals and promos details
    // Returns calculated percentage based on the value, else 0
    function isDiscount(deal, promo) {
      if (deal && !promo) return (deal / 100);
      else if (deal && promo) return ((deal + promo) / 100);
      else if (!deal && promo) return (promo / 100);
      else if (!deal && !promo) return 0;
    };

    // Function to calculate the room and guest values
    // Params - Room details, Guest details, Promo detailsf
    // Returns - Calculated values (After discount)
    function calculateAll(room, guests, promo) {
      $scope.totalAmount = angular.copy($scope.activityTotal);
      $scope.subTotal = 0;
      $scope.discounts = 0;
      $scope.finalTaxes=0;

      for (var i = 0; i < guests.nights; i++) {
        var multipleRates = room.price;
        var prices = {
          actualRate: multipleRates.actual,
          discount: isDiscount(0, promo)
        };
        $scope.subTotal = $scope.subTotal + prices.actualRate; //for package
      }
      if(promo){
        $scope.discounts = promo;
      }
      $scope.subTotal = Calculate.calculateAmount($scope.subTotal, $scope.guest);
      $scope.totalAmount = $scope.subTotal - $scope.discounts;
      $scope.discounts = $scope.totalAmount - $scope.subTotal;
      if($scope.discounts*-1 > ($scope.subTotal + $scope.finalTax)) {
        $scope.adjustment = $scope.totalAmount;
        $scope.discounts = -1 * $scope.discounts + $scope.totalAmount;
        $scope.totalAmount = 0;
      }
      else{
        $scope.discounts *= -1;
      }
    }

    // if user is logged in auto fill the details.
    // Get the User ID from the Cookies/Session and pass to backend to get the details and load in the form.
    $scope.chLogin = $cookieStore.get('validUser');
    if ($scope.chLogin) {
      var userID = {
        "userId": $cookieStore.get('userId')
      };
      var params = {
        headers: { "params": JSON.stringify(userID) }
      };
      $http.get('/api/getWalletDetails', params).success(function(res) {
        var userDeatails = res;
        $scope.firstName = userDeatails.first_name;
        $scope.lastName = userDeatails.last_name;
        $scope.emailId = userDeatails.email;
        $scope.mobileNo = userDeatails.mobile;
      });
    }

    // This is reset when the user comes in this screen. Values are set when the user enters their details in the form.
    $rootScope.fb = {};
    $scope.payment = {};

    // API call to get the hotel details.
    // Passed data - Rooms, Adults, Hotel ID, Checkin, checkout date
    // Returned - Hotel details with room details.
    HotelsServices.single($stateParams).success(function(res) {
      if (res.Hotel_Details) $rootScope.dataReceived = true;
      $scope.hotel = res.Hotel_Details[0];

      // assigning variables to send as params in navigation
      $scope.searchId = res.search_id;
      $scope.productId = $stateParams.productId;
      $scope.location = $stateParams.location;
      $scope.checkin = $stateParams.checkin;
      $scope.checkout = $stateParams.checkout;
      $scope.displayCheckIn = strToDate($scope.checkin).format('DD MMM YYYY');
      $scope.displayCheckOut = strToDate($scope.checkout).format('DD MMM YYYY');
      var details = {
        ratePlanId: $stateParams.ratePlanId,
        roomId: $stateParams.roomId,
        amount: $stateParams.price
      };

      $scope.room = _.find($scope.hotel.rooms, { "room_id": Number($stateParams.roomId) });
      calculateAll($scope.room, $scope.guest);
      $scope.promoInfo = {
        "hotelId": $scope.productId,
        "checkOutDate": strToDate($scope.checkout).format('DD/MM/YYYY'),
        "checkInDate": strToDate($scope.checkin).format('DD/MM/YYYY'),
        "promoCode": $scope.promo,
        "rooms": [{
          "roomId": $stateParams.roomId,
          "ratePlanId": $stateParams.ratePlanId
        }],
        "totalPrice": Math.round($scope.totalAmount)
      };

      $scope.body = {
        "status": "booking",
        "specialRequest": $scope.spl_requests,
        "searchId": $scope.searchId,
        "checkOutDate": strToDate($scope.checkout).format('DD/MM/YYYY'),
        "hotelId": $scope.productId,
        "totalPax": $scope.guest.adults,
        "isPgRequired": true,
        "address": $scope.address,
        "checkInDate": strToDate($scope.checkin).format('DD/MM/YYYY'),
        "rooms": generateRooms(Number($scope.guest.adults), Number($scope.guest.rooms), details)
      };
    });

    // Function to calculate the percentage
    // Parameters - Discounted value, total value
    // Returns - Discount Percentage
    var calculatePercentage = function(discoountValue, totalValue){
      return (discoountValue * 100 / totalValue);
    };

    // Function to check the promo code. The promo code is passed to the backend and response is displayed based on the response received.
    $scope.checkPromo = function() {
      $scope.promoInfo.promoCode = ($scope.promo).toUpperCase();
      $scope.checkingPromo = true;
      $scope.promoMessage = '';

      $timeout(function() {
        $http.post('/api/validatePromo', $scope.promoInfo).success(function(res) {
          $scope.checkingPromo = false;
          if (res && res.Result) {
            $scope.promoApplied = true;
            if(res.Result["Discount Price"]) {
              var promo = res.Result["Discount Price"];
            }
            calculateAll($scope.room, $scope.guest, promo);
          } else {
            $scope.promoMessage = "Invalid Promo Code, Please check and try again!";
            $scope.promoApplied = false;
            console.log(res.Error.ErrorMessage);
          }
        });
      }, 1000);
    };

    // Function to refresh the button for seamless payment gateway integration, when the user change the payment method in the payment gateway.
    // This is needed to refresh the button parameters.
    $scope.refresh = function() {
      $scope.refreshed = false;
      $timeout(function() {
        $scope.refreshed = true;
      }, 200);
    };

    // Function to get the currency ID, as based on the backend.
    // This currency code is the set one from currency converter.
    // Response is the ID (int)
    var getCurrencyId = function(currencyCode) {
      if (currencyCode == "AUD") return 24;
      else if (currencyCode == "EUR") return 3;
      else if (currencyCode == "IDR") return 14;
      else if (currencyCode == "MYR") return 18;
      else if (currencyCode == "SGD") return 7;
      else if (currencyCode == "THB") return 5;
      else if (currencyCode == "USD") return 2;
      else if (currencyCode == "MVR") return 25;
      else if (currencyCode == "INR") return 1;
    };

    // If the user is logged in, load data in form by default
    if($rootScope.user != null && $rootScope.user != undefined){
      $scope.firstName = $rootScope.user.firstName;
      $scope.lastName = $rootScope.user.lastName;
      $scope.emailId = $rootScope.user.email;
      $scope.mobileNo = $rootScope.user.mobileNo;
    };

    // Function to book the hotel. Once, customer enters details and click on the book button, the details are passedd to the backend.
    // Based on the response, the payment gateway integration in desplayed with those details.
    // User selects the payment and they are redirected to the payment screen.
    $scope.options = {};
    $scope.book = function(isValid) {
      var currency = ($rootScope.currency == undefined) ? $scope.hotel.currency : $rootScope.currency;
      $scope.body.firstName = $scope.firstName;
      $scope.body.lastName = $scope.lastName;
      $scope.body.emailId = $scope.emailId;
      $scope.body.mobileNo = $scope.mobileNo;
      $scope.body.noOfRooms = $scope.guest.rooms;
      $scope.body.currency = getCurrencyId(currency);
      $scope.body.source = "website";
      $scope.body.conversionRate = ($rootScope.currency != undefined) ? $rootScope.currencyMultiplier[$scope.hotel.currency] : 1;
      _($scope.body.rooms).forEach(function(room){
        room.amount = ($rootScope.currency != undefined) ? (room.amount*$rootScope.currencyMultiplier[$scope.hotel.currency]) : room.amount;
      });
      $scope.body.totalAmount = (($rootScope.currency == undefined) ? $scope.totalAmount : ($scope.totalAmount * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.subTotal = (($rootScope.currency == undefined) ? $scope.subTotal : ($scope.subTotal * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.serviceTax = (($rootScope.currency == undefined) ? $scope.finalTax : ($scope.finalTax * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.discounts = (($rootScope.currency == undefined) ? $scope.discount : ($scope.discount * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.promocode = $scope.promoApplied ? $scope.promo : '';
      $scope.body.appliedPromoCode = $scope.body.discounts;
      $scope.body.specialRequest = $scope.spl_requests;
      $scope.body.address = $scope.address;
      $scope.body.rooms[0].addons = $scope.addOns;
      $scope.body.browser = deviceDetector.browser + " - " + deviceDetector.browser_version;
      $scope.body.operatingSystem = deviceDetector.os + " - " + deviceDetector.os_version;
      $scope.body.device = deviceDetector.device + " - Desktop:" + deviceDetector.isDesktop() + " - Mobile:" + deviceDetector.isMobile() + " - Tablet:" + deviceDetector.isTablet();
      $scope.body.ipAddress = $scope.ipDetails.geobytesremoteip;
      $scope.body.ipDetails = $scope.ipDetails.geobytescountry + " - " + $scope.ipDetails.geobytesregion + " - " + $scope.ipDetails.geobytescity +
        " - Lat:" + $scope.ipDetails.geobyteslatitude + " - Long:" + $scope.ipDetails.geobyteslongitude + " - Currency:" + $scope.ipDetails.geobytescurrencycode;
      $scope.body.bookingDateTime = new Date();

      if (isValid) {
        $rootScope.dataReceived = false;

        // Enter in local Databse
        OrderDetails.post($scope.body).success(function (response) {
          $scope.order_vid = response._id;
        });

        $http.post('/api/book', $scope.body).success(function(res) {

          // Enter in local Databse
          $scope.body.refrenceId = res.reference_id;
          $scope.body.status = "Paying";
          OrderDetails.put($scope.body, $scope.order_vid).success(function (response) { });

          $rootScope.dataReceived = true;
          if (res.orderid && res.pgURL != null && res.pgURL != undefined && res.pgURL !="" ) {
            $scope.refreshed = true;
            $scope.confirmed = (res.status == "Confirmed");
            $scope.options = {
              "mpsmerchantid": res.mcode,
              "mpsamount": res.amount,
              "mpsorderid": res.orderid,
              "mpsbill_name": res.bill_name,
              "mpsbill_email": res.bill_email,
              "mpsbill_mobile": res.bill_mobile,
              "mpsbill_desc": "Transaction request",
              "mpscurrency": (($rootScope.currency == undefined) ? res.currency : $rootScope.currency),
              "mpsvcode": res.vcode,
              "mpsreturnurl": res.returnurl,
              "mpscancelurl": window.location.protocol + '//' + window.location.host + '/error?orderId=' + res.orderid,
              "startReq": true,
              "status": true
            };

            $rootScope.fb = {
              email: $scope.body.emailId,
              firstName: $scope.body.firstName,
              lastName: $scope.body.lastName,
              phone: $scope.body.mobileNo
            };

            $scope.payment.option = ($scope.options.mpscurrency == "MYR") ? "credit" : "credit3";
            $scope.refresh();
          }
          else if (res.reference_id && (res.pgURL == null || res.pgURL == undefined && res.pgURL == "")){
            window.location.href = "http://staydilly.com/success?orderId=" + res.reference_id;
          }
          else {
            alert("Something went wrong. Please try again");
          }
        });
      }



    };

    $scope.bookDirect = function(firstName, lastName, emailId, mobileNo, address, spl_requests) {
      var currency = ($rootScope.currency == undefined) ? $scope.hotel.currency : $rootScope.currency;
      $scope.body.firstName = firstName;
      $scope.body.lastName = lastName;
      $scope.body.emailId = emailId;
      $scope.body.mobileNo = mobileNo;
      $scope.body.noOfRooms = $scope.guest.rooms;
      $scope.body.currency = getCurrencyId(currency);
      $scope.body.source = "website";
      $scope.body.conversionRate = ($rootScope.currency != undefined) ? $rootScope.currencyMultiplier[$scope.hotel.currency] : 1;
      _($scope.body.rooms).forEach(function(room){
        room.amount = ($rootScope.currency != undefined) ? (room.amount*$rootScope.currencyMultiplier[$scope.hotel.currency]) : room.amount;
      });
      $scope.body.totalAmount = (($rootScope.currency == undefined) ? $scope.totalAmount : ($scope.totalAmount * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.subTotal = (($rootScope.currency == undefined) ? $scope.subTotal : ($scope.subTotal * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.serviceTax = (($rootScope.currency == undefined) ? $scope.finalTax : ($scope.finalTax * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.discounts = (($rootScope.currency == undefined) ? $scope.discount : ($scope.discount * $scope.currencyMultiplier[$scope.hotel.currency]));
      $scope.body.promocode = $scope.promoApplied ? $scope.promo : '';
      $scope.body.appliedPromoCode = $scope.discount;
      $scope.body.specialRequest = spl_requests;
      $scope.body.address = address;
      $scope.body.addons = $scope.addOns;
      $scope.body.browser = deviceDetector.browser + " - " + deviceDetector.browser_version;
      $scope.body.operatingSystem = deviceDetector.os + " - " + deviceDetector.os_version;
      $scope.body.device = deviceDetector.device + " - Desktop:" + deviceDetector.isDesktop() + " - Mobile:" + deviceDetector.isMobile() + " - Tablet:" + deviceDetector.isTablet();
      $scope.body.ipAddress = $scope.ipDetails.geobytesremoteip;
      $scope.body.ipDetails = $scope.ipDetails.geobytescountry + " - " + $scope.ipDetails.geobytesregion + " - " + $scope.ipDetails.geobytescity +
        " - Lat:" + $scope.ipDetails.geobyteslatitude + " - Long:" + $scope.ipDetails.geobyteslongitude + " - Currency:" + $scope.ipDetails.geobytescurrencycode;
      $scope.body.bookingDateTime = new Date();
      var add = {};
      for(var i = 0; i < $scope.addOns.length; i++){
        var str = Object.keys($scope.addOns[i]);
        add[str] = $scope.addOns[i][Object.keys($scope.addOns[i])[0]];
      }
      $scope.body.rooms[0].addons = add;

      $rootScope.dataReceived = false;

      // Enter in local Databse
      OrderDetails.post($scope.body).success(function (response) {
        $scope.order_vid = response._id;
      });

      $http.post('/api/book', $scope.body).success(function(res) {
        $rootScope.dataReceived = true;

        // Enter in local Databse
        $scope.body.refrenceId = res.reference_id;
        $scope.body.status = "Paying";
        OrderDetails.put($scope.body, $scope.order_vid).success(function (response) { });

        if (res.reference_id) {
          $scope.refreshed = true;
          $scope.confirmed = (res.status == "Confirmed");
          window.location.href = res.pgURL;
        } else {
          alert("Something went wrong. Please try again");
        }
      });
    };

    // On change of currency by the user, call Book function and pass the new data to the backend.
    // This is only if once the data is already passed nd then the currency and amount values are changed.
    $scope.$watch(function () { return $rootScope.currency }, function (obj) {
      if (obj != null && $scope.confirmed) {
        $scope.book(true);
      }
    }, true);

    $scope.$watch(function () { return $scope.activityTotal }, function (obj) {
      if (obj != null) {
        $scope.totalAmount = $scope.totalAmount - $scope.tempActivityTotal + $scope.activityTotal;
        $scope.tempActivityTotal = angular.copy($scope.activityTotal);
      }
    }, true);

  }
}());
