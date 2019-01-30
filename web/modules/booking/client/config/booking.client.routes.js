(function() {
    'use strict';

    angular
        .module('booking.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', 'CLIENT'];

    function routeConfig($stateProvider, CLIENT) {
        $stateProvider
            .state('booking', {
                url: '/booking?searchId?productId?location?checkin?checkout?rooms?adults?ratePlanId?roomId?price?promo',
                templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/booking.client.view.html',
                controller: 'bookingController',
                controllerAs: 'vm',
                data: {
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Confirm Booking'
                  }
                }
            })
            .state('packageBooking', {
              url: '/packageBooking?searchId?productId?location?checkin?checkout?rooms?adults?ratePlanId?roomId?price?promo',
              templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/packageBooking.client.view.html',
              controller: 'packageBookingController',
              controllerAs: 'vm',
              data: {
                meta: {
                  'title': CLIENT.capitalizeName + ' | Confirm Booking'
                }
              }
            })
            .state('success', {
                url: '/success?orderId?checkOut?checkin?rname?adult?amt?gname?night?&curr?&noOfRooms?&hname',
                templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/success.client.view.html',
                controller: 'confirmController',
                controllerAs: 'vm',
                data: {
                  meta: {
                    'title': CLIENT.capitalizeName + ' | Booking Success'
                  }
                }
              })
            .state('error', {
              url: '/error?orderId',
              templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/error.client.view.html',
              controller: 'bookingErrorController',
              controllerAs: 'vm',
              data: {
                meta: {
                  'title': CLIENT.capitalizeName + ' | Booking Failed'
                }
              }
            })
            .state('user.manageBooking', {
                url: '/manageBooking/:userId',
                templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/manageBooking.client.view.html',
                controller: 'manageBookController',
                controllerAs: 'vm'
              })
            .state('user.bookingDetails', {
                url: '/bookingDetails/:bookingRefId',
                templateUrl: '/views/' + CLIENT.name + '/modules/booking/client/views/bookingDetails.client.view.html',
                controller: 'bookingDetailsController',
                controllerAs: 'vm'
              });
    }
}());
