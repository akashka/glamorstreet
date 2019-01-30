(function() {
    'use strict';

    // Create the Socket.io wrapper service
    angular
        .module('core')
        .factory('Calculate', Socket);

    Socket.$inject = ['Authentication', '$state', '$timeout'];

    function Socket(Authentication, $state, $timeout) {
        var self = {};

        function fixedDecimal(num) {
            return Number(num.toFixed(13));
        }

        self.calculateAmount = function(finalPrice, guest) {
            return fixedDecimal(finalPrice * Number(guest.rooms));
        };
        self.calculateDiscount = function (actual, discounted) {
          return fixedDecimal(100-((discounted/actual)*100));
        };


        self.getNetExclusive = function(netInclusive, serviceTax, cityTax, other, gst) {
            return fixedDecimal((((netInclusive / (1 + serviceTax)) / (1 + cityTax)) / (1 + other)) / (1 + gst));
        };

        self.getMarkupValue = function(netInclusive, markup) {
            return fixedDecimal(netInclusive * markup);
        };

        self.getSellExclusive = function(netExclusive, markupValue) {
            return fixedDecimal(netExclusive + markupValue);
        };

        self.getDiscount = function(sellExclusive, discount) {
            return fixedDecimal(sellExclusive * discount);
        };

        self.getDiscountedSellExclusive = function(sellExclusive, discount) {
            return fixedDecimal(sellExclusive - (sellExclusive * discount));
        };

        self.getFinalPrice = function(discountedSellExclusive, serviceTax, cityTax, other, gst) {
            return fixedDecimal((((discountedSellExclusive * (1 + serviceTax)) * (1 + cityTax)) * (1 + other)) * (1 + gst));
        };

        self.getFinalTaxes = function(finalPrice, discountedSellExclusive) {
            return fixedDecimal(finalPrice - discountedSellExclusive);
        };

        self.getFinalTaxBreakup = function(tax, discountedSellExclusive, markupValue) {
            return fixedDecimal(((discountedSellExclusive * (1 + tax)) - discountedSellExclusive) + ((markupValue * (1 + tax)) - markupValue));
        };
        self.getdiscountpercent = function(sellExclusive, fix_rate) {
            return fixedDecimal(-((sellExclusive / fix_rate) - 1) * 100);

        };

        return self;
    }
}());
