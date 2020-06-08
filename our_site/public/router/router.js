"use strict";

function Router() {
  // Stores all routes
  this.routes = [];
}

Router.prototype.get = function(uri, callback, thisArg) {
  // Check params--------------------------------------------------------
  // Check if empty
  if(!uri || !callback) throw new Error("uri or callback must be given");

  // Check types
  if(typeof uri !== "string") throw new TypeError("typeof uri must be a string");

  // Check callback
  if(typeof callback !== "function") throw new TypeError("typeof callback must be a function");

  thisArg = thisArg instanceof Router ? undefined : thisArg;

  var route = {
    uri: null,
    callback: null,
    thisArg: thisArg,
    parameters: null,
    regExp: null,
    name: null,
    current: false
  };
  uri = (uri.charAt(0) === ("/")) ? uri : "/" + uri;

  // Check is exists
  this.routes.forEach(function(route) {
    if(route.uri === uri) throw new Error("the uri " + route.uri + " already exists");
  });

  route.uri = uri;
  route.callback = callback;
  route.parameters = this.proccessParameters(route.uri);

  this.routes.push(route);
  return this;
};

Router.prototype.where = function(name, regExp) {

  var route = this.routes[this.routes.length - 1]; // the target route
    
  //if paramaters exists for this route
  if (route.parameters.length === 0) throw new Error("No Parameters Found: Could not set paramater regExpression for [" + route.uri + "] because the route has no parameters");
    
  regExp = regExp.replace(/\(/g,"\\(");
  regExp = regExp.replace(/\)/g,"\\)");

  regExp = "(" + regExp + "+)";

  var parameterFound = false;
  route.parameters.forEach(function(parameter) {
    if(parameter[name] !== undefined){
      parameterFound = true;
      parameter[name].regExp = regExp;
    }
  });

  if(!parameterFound) throw new Error("Invalid Parameter: Could not set paramater regExpression for [" + route.uri + "] because the parameter [" + name + "] does not exist");

  return this;
};

Router.prototype.init = function() {
  // for each route in the routes[]
  this.routes.forEach(function(route) {
    this.proccessRegExp(route);
  }, this);

   
  var found = false;

  // var routerObj = {
  //     pathFor: (name, parameter)=>{
  //         return this.pathFor(name, parameter);
  //     },

  //     goTo: (url, data, title)=>{
  //         return this.goTo(url, data, title);
  //     },

  //     historyMode: this._historyMode
  // };
  this.routes.some(function(route) {
    if(this.requestPath().match(route.regExp)) {

      route.current = true;
      found = true;

      var request = {};
      request.param = this.processRequestParameters(route);
      request.query = this.query;
      request.uri = window.location.pathname;
      //return route.callback.call(route.thisArg, request, routerObj);
      return route.callback.call(route.thisArg, request);
    }
  },this);

  if(!found){
    // if(!this._notFoundFunction) return;
    // var request = {};
    // request.uri = window.location.pathname;
    //return this.notFoundFunction(request, routerObj);
    return this.notFoundFunction();
  }

};

Router.prototype.proccessParameters = function(uri) {
  var parameters = [];
  var sn = 0;

  if(this.containsParameter(uri)){
    uri.replace(/\{\w+\}/g, function(parameter) {
      sn++;
      parameter.replace(/\w+/, function(parameterName) {
        var obj = {};
        obj[parameterName] = {
          sn: sn,
          regExp: "([^\\/]+)", // catch any word except '/' forward slash
          value: null
        };
                
        parameters.push(obj);
      });
    });
  }
  return parameters;
};

Router.prototype.containsParameter = function(uri) {
  return uri.search(/{\w+}/g) >= 0;
};

Router.prototype.proccessRegExp = function(route) {
  var regExp = route.uri;

  // escape special characters
  regExp = regExp.replace(/\//g, "\\/");
  regExp = regExp.replace(/\./g, "\\.");
  regExp = regExp.replace("/", "/?");


  // If the route has {} params
  if(this.containsParameter(route.uri)){
    //replace uri parameters with their regular expression
    regExp.replace(/{\w+}/g, function(parameter) {
     
      var parameterName = parameter.replace("{","");
      parameterName = parameterName.replace("}","");
            
      route.parameters.some(function(i) {
        // If the parameter is in routes.params from get()
        if(i[parameterName] !== undefined) {
          regExp = regExp.replace(parameter, i[parameterName].regExp);
          return regExp;
        }
      });
      return parameter;
    });
        
  }
  //regExp = "^${"+regExp+"}$";
  regExp = "^" + regExp + "$";
  route.regExp = new RegExp(regExp);
  return route;
};

Router.prototype.requestPath = function() {
  return window.location.pathname;
};

Router.prototype.processRequestParameters = function(route) {
  var routeMatched = this.requestPath().match(route.regExp);
  if (!routeMatched) return;
  var param = {};
  routeMatched.forEach(function(value, index) {
    if(index !== 0){
      var key = Object.getOwnPropertyNames(route.parameters[index - 1]);
      param[key] = value;
    }
  });
  return param;
};

Router.prototype.pathFor = function(name, parameters) {
  if (parameters === undefined) parameters = {};
  var nameFound = false;
  var uri;
  this.routes.some(function(route) {
    if(route.name === name){
      nameFound = true;
      uri = route.uri;
      if(this.containsParameter(uri)){

        var array  = [];
        var values = route.uri.match(/\{(\w+)\}/g);
        for(var v in values) {
          values[v] = values[v].replace("{","");
          values[v] = values[v].replace("}","");
          array.push(values[v]);
        }
        if(array.length !== Object.getOwnPropertyNames(parameters).length) throw new Error("The route with name [" + name + "] contains " + array.length + " parameters. " + Object.getOwnPropertyNames(parameters).length + " given");
        for(var parameter in parameters){
          if (!array.includes(parameter)) throw new Error("Invalid parameter name [" + parameter + "]");
          var r = new RegExp("{" + parameter + "}","g");
          uri = uri.replace(r, parameters[parameter]);
        }
      }
    }
  });
  if (!nameFound) throw new Error("Invalid route name [" + name + "]");
  return uri;
};

Router.prototype.goTo = function(url, data, title) {
  if (data === undefined) data = {};
  if (title === undefined) title = "";
  if(!this._historyMode){
    var storage = window.localStorage;
    storage.setItem("pushState", data);
    return window.location.href= url;
  }

  window.history.pushState(data, title, url);
  return this.init();
};

window.Router = Router;