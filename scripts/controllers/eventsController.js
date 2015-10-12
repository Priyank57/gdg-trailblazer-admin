var trailblazer = angular.module("trailblazer");

trailblazer.controller('eventsController',
["$scope","$http","UrlService","AccessTokenService",
function($scope,$http,UrlService,AccessTokenService){
  $scope.events = [];
  $scope.hasError = false;
  $scope.error = "";
  $scope.editErrors = [];
  $scope.editError = "";
  $scope.range = function(number)
  {
    return _.range(number+1);
  };
  $scope.smallDate = function(date){
    return moment(date).format('Do MMM YY h:mm A');
  };
  $scope.fullDate = function(date){
    return moment(date).format('dddd, Do MMM YYYY, h:mm A');
  };
  $scope.getParticipants = function(event,state)
  {
    if(event)
      return _.where(event.participants,{participation_state:state});
  };
  $scope.findQuestion = function(event,q_id)
  {
    return _.findWhere(event.questions,{_id:q_id.toString()});
  };
  $scope.acceptParticipant = function(event_id,user_id)
  {
    $scope.manageParticipantsLoading = true;
    $http.post(UrlService.generateUrl('events/'+event_id+'/accept_participation?_id='+user_id))
    .then(
      function(){
        $scope.fetchEvents(function(){
          $scope.activeEvent = _.findWhere($scope.events,{_id:event_id});
          $scope.manageParticipantsLoading = false;
        });
      },
      function(response){
        alert(response.data.statusMessage);
        $scope.manageParticipantsLoading = false;
      }
    );
  }
  $scope.fetchEvents = function(cb){
    $http.get(UrlService.generateUrl('events'),{})
    .then(
      function(response)
      {
        $scope.events = response.data.data;
        $scope.hasError = false;
        if(cb) cb();
      },
      function(response)
      {
        $scope.error = response.data.statusMessage;
        $scope.hasError = true;
      });
    };
  $scope.fetchEvents();
  UrlService.addBaseUrlChangeListener($scope.fetchEvents);
  AccessTokenService.addTokenChangeListener($scope.fetchEvents);
  $scope.eventDetails = function(event){
    $scope.activeEvent = event;
    if(event.location)
    {
      window.eventLocationMarker.setPosition({lat:event.location.latitude,lng:event.location.longitude});
      $("#event_details_map").show();
    }
    else
    {
      $("#event_details_map").hide();
    }
    $("#event_details_modal").modal();
  };
  $scope.manageParticipants = function(event)
  {
    $scope.activeEvent = event;
    $("#manage_participants_modal").modal();
  };
  $scope.editEvent = function(event)
  {
    $scope.activeEvent = event;
    $("#editEvent_start_time").val(moment(event.start_time).format('MM/DD/YYYY h:mm A'));
    $("#editEvent_end_time").val(moment(event.end_time).format('MM/DD/YYYY h:mm A'));
    var position = {lat:0,lng:0};
    $scope.activeEvent.latitude = $scope.activeEvent.longitude = 0;
    if(event.location)
    {
      position = {lat:event.location.latitude,lng:event.location.longitude};
      $scope.activeEvent.latitude = event.location.latitude;
      $scope.activeEvent.longitude = event.location.longitude;
    }
    window.editEventMarker.setPosition(position);
    $("#edit_event_modal").modal();
  };
  $scope.saveEditEvent = function(event)
  {
    var event = $scope.activeEvent;
    event.start_time = $("#editEvent_start_time").val();
    event.end_time = $("#editEvent_end_time").val();
    var newQuestions = [];
    _.each(event.questions,function(question){
      if( question.question && question.question != "")
        newQuestions.push(question);
    });
    event.questions = newQuestions;
    $http.put(UrlService.generateUrl('events/'+event._id),event)
    .then(
      function(response)
      {
        $scope.fetchEvents();
        $("#edit_event_modal").modal('hide');
      },
      function(response)
      {
        console.log(response);
        $scope.editError = response.data.statusMessage;
        _.each(response.data.errors,function(err){
          $scope.editErrors[err.field] = err.message;
        });
      }
    );};
    $scope.deleteEvent = function(event)
    {
      if(!confirm("Are you sure you want to delete this event?"))
        return 0;
      $http.delete(UrlService.generateUrl('events/'+event._id))
      .then(
        function(response)
        {
          location.reload();
        },
        function(response)
        {
          alert(response.data.statusMessage);
        }
      );
    };
    $scope.cancelEvent = function(event)
    {
      if(!confirm("Are you sure you want to cancel this event?"))
        return 0;
      $http.put(UrlService.generateUrl('events/'+event._id+'/cancel'))
      .then(
        function(response)
        {
          location.reload();
        },
        function(response)
        {
          alert(response.data.statusMessage);
        }
      );
    };
    $scope.revertCancelEvent = function(event)
    {
      if(!confirm("Are you sure you want to revert cancellation of this event?"))
        return 0;
      $http.put(UrlService.generateUrl('events/'+event._id+'/revert_cancel'))
      .then(
        function(response)
        {
          location.reload();
        },
        function(response)
        {
          alert(response.data.statusMessage);
        }
      );
    };
    $scope.restoreEvent = function(event)
    {
      if(!confirm("Are you sure you want to restore this event?"))
        return 0;
      $http.put(UrlService.generateUrl('events/'+event._id+'/restore'))
      .then(
        function(response)
        {
          location.reload();
        },
        function(response)
        {
          alert(response.data.statusMessage);
        }
      );
    };
}]);
