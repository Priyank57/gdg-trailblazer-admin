var trailblazer = angular.module("trailblazer");

trailblazer.controller("accessTokenController",
["$scope","$http","$cookies","UrlService","AccessTokenService",
function($scope,$http,$cookies,UrlService,AccessTokenService){
  $scope.accessToken = AccessTokenService.getToken();
  AccessTokenService.addTokenChangeListener(function(){
    $scope.accessToken = AccessTokenService.getToken();
  });
  $scope.hasError = false;
  $scope.success = "";
  $scope.error = "";
  $scope.changeAccessToken = function(){
    AccessTokenService.updateToken($scope.accessToken);
  }
  $scope.fetchAccessToken = function()
  {
    $scope.accessToken = AccessTokenService.getToken();
    $scope.hasError = false;
    $scope.success = "";
    $scope.error = "";
    $scope.loading = true;
    $http.post(UrlService.generateUrl('users/authenticate'),
    {email:$scope.email,password:$scope.password})
    .then(
    function(response){
      AccessTokenService.updateToken(response.data.data.access_token);
      $scope.hasError = false;
      $scope.success = "Succesfully authenticated, access token set.";
      $scope.loading = false;
    },
    function(response){
      $scope.hasError = true;
      $scope.error = response.data.statusMessage;
      $scope.loading = false;
    }
  );
  }
}]);
