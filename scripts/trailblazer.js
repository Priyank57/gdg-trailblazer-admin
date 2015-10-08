angular.module("trailblazer",["ngCookies"]);

angular.module("trailblazer").run(["$http","AccessTokenService",function($http,AccessTokenService) {
  $http.defaults.headers.common.Authorization = 'Bearer ' + AccessTokenService.getToken();
  AccessTokenService.addTokenChangeListener(function(){
      $http.defaults.headers.common.Authorization = 'Bearer ' + AccessTokenService.getToken();
  });
}]);
