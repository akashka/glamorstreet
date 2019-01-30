(function () {
  'use strict';

  angular
    .module('users')
    .controller('walletController', walletController);

  walletController.$inject = ['$scope', '$state', '$window', 'Authentication', '$rootScope', 'Notification',
    '$stateParams', '$http', 'patterns', '$timeout','CLIENT'];

  function walletController($scope, $state, $window, Authentication, $rootScope, Notification,
                            $stateParams, $http, patterns, $timeout, CLIENT ) {
    $scope.dataReceived = false;
    $timeout(function() {
      (CLIENT.name === 'staydilly') ? window.scrollTo(0, 130) : "";
    }, 100);

    var params = {
      headers: { "params": JSON.stringify($stateParams) }
    };

    $scope.format = 'dd MMM yyyy';
    $scope.popup1 = { opened: false };
    $scope.popup2 = { opened: false };
    $scope.transactionTypes = [];
    $scope.transactionTypes.push({type: 'Both'});
    $scope.transactionTypes.push({type: 'Credit'});
    $scope.transactionTypes.push({type: 'Debit'});

    $http.get('/api/getWalletDetails', params).success(function(res) {
      $scope.lastUsedAmount = res.last_used_amount;
      $scope.lastCreditAmount = res.last_credit_amount;
      $scope.curentBalance = res.current_balance;
      $scope.currency = res.currency;
      $scope.supplierId = res.supplierId;
      $scope.userId = res.user_id;
      $scope.walletDetails = (res.walletLog != undefined) ? res.walletLog : [];
      $scope.tempWalletDetails = $scope.walletDetails; // This is the temporary wallet with complete list used for filtering purpose
      $scope.currentPage = 1;
      $scope.dataReceived = true;
      // Options for checking and changing the dates filters.
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };

      $scope.onTypeChange = function(transactionType){
        $scope.walletDetails = filterTypes(transactionType);
        $scope.currentPage = 1;
      };

      var filterTypes = function(transactionType){
        var walletDetails = [];
        if(transactionType.toUpperCase() === 'BOTH'){
          walletDetails = $scope.tempWalletDetails;
        }
        else{
          for(var i = 0; i < $scope.tempWalletDetails.length; i++){
            if($scope.tempWalletDetails[i].type.toUpperCase() === transactionType.toUpperCase()){
              walletDetails.push($scope.tempWalletDetails[i]);
            }
          }
        }
        return walletDetails;
      }

      function stringToDate(_date,_format,_delimiter)
      {
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
      }

      var filterDates = function(setDate, flag, list){
        var tempWalletDetails = [];
        for(var i = 0; i < list.length; i++){
          var dt = (list[i].transaction_date).split(" ");
          var wDate = stringToDate(dt[0],"dd/MM/yyyy","/");
          if((wDate >= setDate && flag === 1) || (wDate < setDate && flag === 2)) {
            tempWalletDetails.push(list[i]);
          }
        }
        return tempWalletDetails;
      };

      var checkDate = function(startDate, endDate){
        if(startDate != undefined && endDate != undefined){
          if(startDate > endDate){
            endDate = moment(startDate).add(1, 'days');
          }
        }
        return endDate;
      };

      $scope.setMinMaxDate = function(startDate, endDate){
        endDate = checkDate(startDate, endDate);
        if(startDate != undefined){
          $scope.walletDetails = filterDates(startDate, 1, $scope.tempWalletDetails);
        }
        else{
          $scope.walletDetails = $scope.tempWalletDetails;
        }
        if(endDate != undefined){
          var eDate = new Date(moment(endDate).add(1, 'd'));
          $scope.walletDetails = filterDates(eDate, 2, $scope.walletDetails);
        }
        $scope.currentPage = 1;
      };

    });

    $scope.showModal = function(val) {

      $scope.name = val;
      $scope.opts = {
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        templateUrl: 'modalContent.html',
        controller: ModalWalletCtrl,
        resolve: {} // empty storage
      };


      $scope.opts.resolve.item = function() {
        return angular.copy({ name: $scope.name }); // pass name to Dialog
      };

      var modalInstance = $uibModal.open($scope.opts);

      modalInstance.result.then(function() {

        //on ok button press
      }, function() {
        //on cancel button press

      });
    };

    $scope.txn_amount = 0;
    $scope.addWallet = function(){
      var par = {
        userId: $scope.userId,
        supplierId: $scope.supplierId,
        txnAmt: $scope.txn_amount
      };
      var param = {
        headers: { "params": JSON.stringify(par) }
      };
      $http.get('/api/addWalletAmount', param).success(function(res) {
        $rootScope.dataReceived = true;
        // window.location.href = res.pgURL;
        if (res.orderid) {
          $scope.refreshed = true;
          $scope.confirmed = "Confirmed";
          $scope.options = {
            "mpsmerchantid": (res.mcode != null && res.mcode != undefined) ? res.mcode : "staydilly",
            "mpsamount": $scope.txn_amount,
            "mpsorderid": res.orderid,
            "mpsbill_name": res.bill_name,
            "mpsbill_email": res.bill_email,
            "mpsbill_mobile": res.bill_mobile,
            "mpsbill_desc": "Add  amount to Wallet request",
            "mpscurrency": res.currency,
            "mpsvcode": res.vcode,
            "mpsreturnurl": res.returnurl,
            "mpscancelurl": window.location.protocol + '//' + window.location.host + '/error?orderId=' + res.orderid,
            "startReq": true,
            "status": true
          };
          $scope.showModal($scope.options);
        } else if (res.vccProcessRequest == "true") {
          $scope.vccconfirmed = (res.vccProcessRequest == "true");
          $state.go('vcc', { 'reference_id': res.reference_id });
          $scope.showModal($scope.options);
        } else {
          $state.go('error');
          // alert("Something went wrong. Please try again");
        }
      });
    };

    $rootScope.popupAlert = function() {
      $("#success-alert").alert();
    };

    if (window.location.href.indexOf("&success=false") > -1) {
      $rootScope.popupAlert();
      $rootScope.popupAlertFailSet = true;
      $rootScope.alretMeassege = "Payment failed! Please try again!"
      $timeout(function() {
        $rootScope.popupAlertFailSet = false;
      }, 3000);
    }
    else if (window.location.href.indexOf("&success=true") > -1) {
      $rootScope.popupAlert();
      $rootScope.popupAlertPassSet = true;
      $rootScope.alretMeassege = "Success!! Payment received."
      $timeout(function() {
        $rootScope.popupAlertPassSet = false;
      }, 3000);
    }
  }
}());
