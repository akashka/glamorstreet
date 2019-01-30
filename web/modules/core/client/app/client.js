(function (app) {
  'use strict';

  app.registerModule('config');

  angular
    .module('config')
    .constant('CLIENT', {
      'name': 'traveler.mv',
      'capitalizeName': 'Traveller',
      'googleClientId': '114481391148-tflajf2s6fam6huqfi3qqu703cadnu58.apps.googleusercontent.com',
      'facebookId': '250099538742120'
    })
  	.run(['ngMeta', function(ngMeta) {
    	ngMeta.init();
  	}]);

}(ApplicationConfiguration));
