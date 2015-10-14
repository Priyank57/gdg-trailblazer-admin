var trailblazer = angular.module("trailblazer");

trailblazer.controller('usersController',
["$scope","$http","UrlService","AccessTokenService",
function($scope,$http,UrlService,AccessTokenService){
  $scope.users = [];
  $scope.error = "";
  $scope.loading = false;
  $scope.fetchUsers = function(){
    $scope.users = [];
    $scope.error = "";
    $scope.loading = true;
    $http.get(UrlService.generateUrl('users'))
    .then(
      function(response)
      {
        $scope.users = response.data.data;
        console.log($scope.users);
        $scope.loading = false;
      },
      function(response)
      {
        $scope.error = response.data.statusMessage;
        $scope.loading = false;
      }
    );
  };
  UrlService.addBaseUrlChangeListener($scope.fetchUsers);
  AccessTokenService.addTokenChangeListener($scope.fetchUsers);
  $scope.fetchUsers();
  $("#events_all_perms").change(function(){$scope.toggleAllPerms('events')});
  $("#users_all_perms").change(function(){$scope.toggleAllPerms('users')});
  $scope.smallDate = function(date){
    return moment(date).format('Do MMM YY');
  };
  $scope.fullDate = function(date){
    return moment(date).format('dddd, Do MMM YYYY, h:mm A');
  };
  $scope.managePermissions = function(user)
  {
    $scope.activeUser = user;
    _.each(user.permissions,function(permissions,context){
      $("input[name='permissions."+context+"[]']").prop("checked",false);
      _.each(permissions,function(permission){
        $("input[name='permissions."+context+"[]'][value='"+permission+"']").prop("checked",true);
      });
      if($("#"+context+"_all_perms").prop('checked'))
        $("input[name='permissions."+context+"[]']").prop("checked",true);
    });
    $("#manage_permissions_modal").modal();
  };
  $scope.toggleAllPerms = function(context)
  {
    if($("#"+context+"_all_perms").prop('checked'))
      $("input[name='permissions."+context+"[]']").prop("checked",true);
    else
      $("input[name='permissions."+context+"[]']").prop("checked",false);
  };
  $scope.savePermissions = function(){
    var permissions = {
      users:[],
      events:[],
      self:[]
    };
    _.each(permissions,function(perms,context){
      if($("#"+context+"_all_perms").prop('checked'))
        permissions[context] = ["all"];
      else
        $("input[name='permissions."+context+"[]']:checked").each(function ()
        {
            permissions[context].push($(this).val());
        });
    });
    $http.put(UrlService.generateUrl('users/'+$scope.activeUser._id),{permissions:permissions})
    .then(
      function(response)
      {
        alert(response.data.statusMessage);
        $("#manage_permissions_modal").modal('hide');
        $scope.fetchUsers();
      },
      function(response)
      {
        alert(response.data.statusMessage);
        $("#manage_permissions_modal").modal('hide');
      }
    );
  };
}]);
