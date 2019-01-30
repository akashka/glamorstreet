'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function.
 */
module.exports = function configuration() {

  return {
    project: 'traveler.mv',
    projectNameCapitalize: 'Traveler',
    projectSite: 'Traveler.mv',
    apiKey: '213cb204509284ff2aedeca9290b70a6da307eab',
    secretKey: 'traveler.mv',
    channelId: 6,
    url: 'http://staydilly.axisrooms.com/api/be',
    searchApi: '/search',
    locationApi: '/location',
    propertytypeApi: '/propertyType',
    roomApi: '/rooms',
    bookingApi: '/booking',
    dealApi: '/deals',
    promoApi: '/promos',
    addUserApi: '/userRegistration',
    userRegistrationApi:'/userRegistration',
    buyerLoginApi: '/buyerLogin',
    buyerBookingHistoryApi: '/buyerBookingHistory',
    getBookingDetailsApi: '/orderDetails',
    cancelBookingApi: '/cancelAmtRequest',
    walletDetailsApi: '/getWalletDetails',
    addWalletAmountApi: '/addWalletAmount',
    updateUserProfileApi: '/updateProfile',
    updateUserPasswordAPi: '/updatePassword',
    validpromoApi: '/validatePromo',
    referAfriendAPi: '/referFrienedRequest',
    packagSearchApi: '/packages',
    policyApi: '/getPolicies',
    beId: '?bookingEngineId=2104',
    bookingEngineId: 2104,
    email:'sales@traveler.mv'
  };

};


