(function() {
    'use strict';

    // Create the Socket.io wrapper service
    angular
        .module('core')
        .factory('GoogleAdWordsService', Socket);

    Socket.$inject = ['Authentication', '$state', '$window'];

    function Socket(Authentication, $state, $window) {
      var googleTrackconversion = function(conversion_label, amount) {

        // Calling the Google API
        if (conversion_label == 'MYR') {
          $window.google_trackConversion({
            google_conversion_id: 867785869,
            google_conversion_language: "en",
            google_conversion_format: "3",
            google_conversion_color: "ffffff",
            google_conversion_label: "jRADCP6S9WsQjbnlnQM",
            google_conversion_value: amount,
            google_conversion_currency: "MYR",
            google_remarketing_only: false
          });
        } else if (conversion_label == 'THB') {
          $window.google_trackConversion({
            google_conversion_id: 867896792,
            google_conversion_language: "en",
            google_conversion_format: "3",
            google_conversion_color: "ffffff",
            google_conversion_label: "VwtfCKT5jWwQ2JvsnQM",
            google_conversion_value: amount,
            google_conversion_currency: "THB",
            google_remarketing_only: false
          });
        } else if (conversion_label == 'IDR') {
          $window.google_trackConversion({
            google_conversion_id: 867880203,
            google_conversion_language: "en",
            google_conversion_format: "3",
            google_conversion_color: "ffffff",
            google_conversion_label: "-XweCOm3iWwQi5rrnQM",
            google_conversion_value: amount,
            google_conversion_currency: "IDR",
            google_remarketing_only: false
          });
        }
      };

      var eCommerceTransaction = function(ecommerce){
        ga('ecommerce:addTransaction', {
            'id': ecommerce.id,
            'revenue': ecommerce.revenue,
            'currency': ecommerce.currency
          });

          ga('ecommerce:addItem', {
            'id': ecommerce.id,
            'name': ecommerce.name,
            'category': ecommerce.category,
            'price': ecommerce.price,
            'quantity': ecommerce.quantity,
            'currency': ecommerce.currency
          });

          ga('ecommerce:send');
      };

      return {
        sendRegisterCustomerConversion: function(currency, amount, ecommerce) {

          fbq('track', 'Purchase', {
            value: amount,
            currency: currency
          });

          if (currency == 'MYR') {
            googleTrackconversion('MYR', amount);
            googleTrackconversion('THB', 0);
            googleTrackconversion('IDR', 0);
          } else if (currency == 'THB') {
            googleTrackconversion('MYR', 0);
            googleTrackconversion('THB', amount);
            googleTrackconversion('IDR', 0);
          } else if (currency == 'IDR') {
            googleTrackconversion('MYR', 0);
            googleTrackconversion('THB', 0);
            googleTrackconversion('IDR', amount);
          } else {
            googleTrackconversion('MYR', 0);
            googleTrackconversion('THB', 0);
            googleTrackconversion('IDR', 0);
          }

          eCommerceTransaction(ecommerce);

        }
      }
    }
}());
