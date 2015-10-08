var trailblazer = angular.module("trailblazer");

trailblazer.controller('newEventController',
["$scope","$http","UrlService",
function($scope,$http,UrlService){
  $scope.errors = [];

  $scope.resetNewEvent = function(){
    $scope.newEvent = {
      questions:[]
    };
  };

  $scope.resetNewEvent();

  $scope.createNewEvent = function(){
    $scope.errors = [];
    $scope.error = "";
    var event = $scope.newEvent;
    event.start_time = $("#newEvent_start_time").val();
    event.end_time = $("#newEvent_end_time").val();
    $http.post(UrlService.generateUrl('events'),event)
    .then(
      function(response)
      {
        location.reload();
      },
      function(response)
      {
        $scope.error = response.data.statusMessage;
        _.each(response.data.errors,function(err){
          $scope.errors[err.field] = err.message;
        });
      }
    );
  };

  $scope.range = function(number)
  {
    return _.range(number+1);
  };
}]);
