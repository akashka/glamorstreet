(function() {
    'use strict';

    // Create the Socket.io wrapper service
    angular
        .module('core')
        .factory('MetaTagsServices', Socket);

    Socket.$inject = ['Authentication', '$state', '$window', '$timeout', '$rootScope'];

    function Socket(Authentication, $state, $window, $timeout, $rootScope) {
        return{
          metaTagHeader : function(){
            $('meta[name=title]').remove();
            $('meta[name=description]').remove();
            $('meta[name=keywords]').remove();
            $('head title').remove();
            $timeout(function(){
              $("head").prepend('<meta name="keywords" content="'+ $rootScope.ngMeta.keywords +'"/>');
              $("head").prepend('<meta name="description" content="'+ $rootScope.ngMeta.description +'"/>');
              $("head").prepend('<meta name="title" content="'+ $rootScope.ngMeta.title +'"/>');
              $("head").prepend('<title>'+$rootScope.ngMeta.title+'</title>');
            }, 3000);
          }
        }
    }
}());
