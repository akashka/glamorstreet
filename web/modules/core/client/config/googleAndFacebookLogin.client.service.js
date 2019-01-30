(function() {
    'use strict';

    // Create the Socket.io wrapper service 
    angular
        .module('core.routes')
        .config(googleFacebook);

        googleFacebook.$inject = ['CLIENT', '$authProvider'];

        function googleFacebook(CLIENT, $authProvider) {
          $authProvider.facebook({
            clientId: CLIENT.googleClientId
          });

          // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
          $authProvider.facebook({
            clientId: CLIENT.facebookId,
            responseType: 'token'
          });

          $authProvider.google({
            clientId: CLIENT.googleClientId,
            responseType: 'token'
          });
        };
}());
