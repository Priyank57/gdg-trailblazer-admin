var trailblazer = angular.module("trailblazer");

trailblazer.controller("baseUrlController",
["$scope","UrlService",
function($scope,UrlService){
  $scope.baseUrlChange = function(){
    UrlService.updateBaseUrl($scope.baseUrl);
  };

  $scope.baseUrl = UrlService.getBaseUrl();
}]);
