var trailblazer = angular.module("trailblazer");

trailblazer.service('AccessTokenService',["$cookies",function($cookies){
  var AccessTokenService = {
    tokenChangeListeners : [],
    getToken : function(){
      return $cookies.get("accessToken");
    },
    updateToken : function(token){
      $cookies.put("accessToken",token);
      this.notifyTokenChange();
    },
    notifyTokenChange : function(){
      for(var i = 0; i < this.tokenChangeListeners.length; i++)
        this.tokenChangeListeners[i](this.getToken());
    },
    addTokenChangeListener : function(callback){
      this.tokenChangeListeners.push(callback);
    }
  }
  return AccessTokenService;
}]);
