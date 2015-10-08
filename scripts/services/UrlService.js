var trailblazer = angular.module("trailblazer");

trailblazer.service('UrlService',["$cookies",function($cookies){
  var UrlService = {
    baseUrlChangeListeners : [],
    getBaseUrl : function(){
      return $cookies.get("baseUrl");
    },
    updateBaseUrl : function(baseUrl){
      $cookies.put('baseUrl',baseUrl);
      this.notifyBaseUrlChange();
    },
    notifyBaseUrlChange : function(){
      for(var i = 0; i < this.baseUrlChangeListeners.length; i++)
        this.baseUrlChangeListeners[i](this.getBaseUrl());
    },
    addBaseUrlChangeListener : function(callback){
      this.baseUrlChangeListeners.push(callback);
    },
    generateUrl : function(path){
      var slash = "";
      if(this.getBaseUrl())
      {
        if(this.getBaseUrl().slice(-1) != "/")
          slash = "/";
        return this.getBaseUrl()+slash+path;
      }
      return path;
    }
  }
  return UrlService;
}]);
