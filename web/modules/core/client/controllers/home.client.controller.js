(function() {
  'use strict';

  angular
    .module('core')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', '$state', 'ngMeta', 'CLIENT','$timeout', 'Maintenance', '$location', 'Metatag'];

  function MainController($scope, Authentication, $rootScope, $http, $state, ngMeta, CLIENT, $timeout, Maintenance, $location, Metatag) {

    // Metatags for all pages.
    Metatag.get().success(function (res) {
      $rootScope.cmsMetatags = res;
    });

    var changeMetaTags = function(stateName){

      var findResult = _.find($rootScope.cmsMetatags, ['screen', stateName]);
      if(findResult!=undefined){
        ngMeta.setTitle(findResult.title);
        ngMeta.setTag('description', findResult.description);
        ngMeta.setTag('keywords', findResult.keywords);
      }else {
        ngMeta.setTitle("title");
        ngMeta.setTag('description', "");
        ngMeta.setTag('keywords', "");
      }
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      //change the footer and header for cms
      var isInCmsState = $state.includes("cms.**");
      if(isInCmsState){
        $rootScope.cmsLayout = true;
      }else{
        $rootScope.cmsLayout = false;
      }

      $rootScope.virtualUrl = false;
      var url = ["/techsauce", "/breakbulk"];
      for(var v = 0; v < url.length; v++){
        if(url[v] == $location.url()){
          $rootScope.virtualUrl = true;
          break;
        }
      }

      // checking states for metaTags
      if($state.current.name){
        changeMetaTags($state.current.name);
      }
    });

    $rootScope.hotelsMetaTags = function() {
      if ($rootScope.locationcity) {
        ngMeta.setTitle($rootScope.locationcity + ", " + $rootScope.locationcountry + " Hotel Deals" + ' | ' + CLIENT.capitalizeName);
        ngMeta.setTag('description', 'Hotel deals in ' + $rootScope.locationcity + ", " + $rootScope.locationstate +"." + " Book your discounted hotels in " + $rootScope.locationstate + " today.");
        ngMeta.setTag('keywords', 'Discounted hotels in ' + $rootScope.locationcity + ", " + $rootScope.locationstate +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");
      } else if ($rootScope.locationstate) {
        ngMeta.setTitle($rootScope.locationstate  + ", " + $rootScope.locationstatecountry + " Hotel Deals" + ' | ' + CLIENT.capitalizeName);
        ngMeta.setTag('keywords', 'Discounted hotels in ' + $rootScope.locationstate +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings" );
        ngMeta.setTag('description', 'Hotel deals in ' + $rootScope.locationstate +"." + " Book your discounted hotels in " + $rootScope.locationstate + " today.");
      } else if ($rootScope.locationCountry) {
        ngMeta.setTitle($rootScope.locationCountry + " Hotel Deals" + ' | ' + CLIENT.capitalizeName);
        ngMeta.setTag('description', 'Hotels deals in ' + $rootScope.locationcountry  +"." + " Book your discounted hotels in " + $rootScope.locationstate + " today.");
        ngMeta.setTag('keywords', 'Discounted Hotels in ' + $rootScope.locationcountry +"." + " Lodging, accommodation, discount hotel, online booking, online reservation, hotels, special offer, specials, weekend break, deals, budget, cheap, savings");
      }
    };

    //manipulating the preloaded in cms using the root scope

    $rootScope.preLoaderCmsFlag = false;
    $rootScope
      .$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.preLoaderCmsFlag = true;
          $("#ui-view").html("");
          $("#preLoaderCms").removeClass("hidden");
        });

    $rootScope
      .$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.preLoaderCmsFlag = false;
          $("#preLoaderCms").addClass("hidden");
        });


  }
}());
