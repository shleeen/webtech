export default class Router {
    constructor() {
        // Stores all routes
        this.routes = [];
    }


    // Get a particular uri and return a callback
    get(uri, callback, thisArg){
        // Check params--------------------------------------------------------
        // Check if empty
        if(!uri || !callback) throw new Error('uri or callback must be given');

        // Check types
        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');

        // Check callback
        if(typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        thisArg = thisArg instanceof Router ? undefined : thisArg;

        let route = {
            uri: null,
            callback: null,
            thisArg: thisArg,
            parameters: null,
            regExp: null,
            name: null,
            current: false
        }
        uri = uri.startsWith("/") ? uri : `/${uri}`;

        // Check is exists
        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        });

        route.uri = uri;
        route.callback = callback;
        route.parameters = this.proccessParameters(route.uri);

        this.routes.push(route);
        return this;
    }


    // Deal with urls that have params
    where(name, regExp){

        let route = this.routes[this.routes.length - 1]; // the target route
        
        //if paramaters exists for this route
        if (route.parameters.length === 0) throw new Error(`No Parameters Found: Could not set paramater regExpression for [${route.uri}] because the route has no parameters`);
        
        regExp = regExp.replace(/\(/g,"\\(");
        regExp = regExp.replace(/\)/g,"\\)");

        regExp = `(${regExp}+)`;

        let parameterFound = false;
        route.parameters.forEach((parameter, index)=>{
            if(parameter[name] !== undefined){
                parameterFound = true;
                parameter[name].regExp = regExp;
            }
        });
 
        if(!parameterFound) throw new Error(`Invalid Parameter: Could not set paramater regExpression for [${route.uri}] because the parameter [${name}] does not exist`);

        return this;
    }

   


    
    // Compares with the current pathname
    init(){
        // for each route in the routes[]
        this.routes.forEach((route)=>{
            this.proccessRegExp(route);
        }, this);

       
        let found = false;

        // let routerObj = {
        //     pathFor: (name, parameter)=>{
        //         return this.pathFor(name, parameter);
        //     },

        //     goTo: (url, data, title)=>{
        //         return this.goTo(url, data, title);
        //     },

        //     historyMode: this._historyMode
        // };
        this.routes.some((route)=>{
            alert(this.requestPath())
            alert(route.regExp)
            if(this.requestPath().match(route.regExp)) {

                route.current = true;
                found = true;

                let request = {};
                request.param = this.processRequestParameters(route);
                request.query = this.query;
                request.uri = window.location.pathname;
                console.log(request)
                //return route.callback.call(route.thisArg, request, routerObj);
                return route.callback.call(route.thisArg, request);
            }
        },this)

        if(!found){
            if(!this._notFoundFunction) return;
            let request = {};
            request.uri = window.location.pathname;
            //return this.notFoundFunction(request, routerObj);
            return this.notFoundFunction(request);
        }
  
    }

    // Class functions ----------------------------------------------------------------------

    // This gets the {} in the uri and puts them in a []
        // returns all the params so we have a list of them stored for each route in routes
    proccessParameters(uri){
        let parameters = [];
        let sn = 0;

        if(this.containsParameter(uri)){
            uri.replace(/\{\w+\}/g,(parameter)=>{
                sn++;
                parameter.replace(/\w+/, (parameterName)=>{
                    let obj = {};
                    obj[parameterName] = {
                        sn: sn,
                        regExp: "([^\\/]+)", // catch any word except '/' forward slash
                        value: null
                    }
                    
                    parameters.push(obj);
                });
            });
        }
        return parameters;
    }

    containsParameter(uri){
        return uri.search(/{\w+}/g) >= 0;
    }


    // Check if ??
    proccessRegExp(route){
        let regExp = route.uri;

        // escape special characters
        regExp = regExp.replace(/\//g, "\\/");
        regExp = regExp.replace(/\./g, "\\.");
        regExp = regExp.replace("/", "/?");


        // If the route has {} params
        if(this.containsParameter(route.uri)){
            //replace uri parameters with their regular expression
            regExp.replace(/{\w+}/g, (parameter)=>{
         
                let parameterName = parameter.replace("{","");
                parameterName = parameterName.replace("}","");
                
                route.parameters.some((i)=>{
                    // If the parameter is in routes.params from get()
                    if(i[parameterName] !== undefined) {
                        regExp = regExp.replace(parameter, i[parameterName].regExp)
                        return regExp;
                    }
                });
                return parameter;
            });
            
        }
        //regExp = "^${"+regExp+"}$";
        regExp = `^${regExp}$`;
        route.regExp = new RegExp(regExp);
        return route;
    }

    requestPath(){
        return window.location.pathname;
    }

    processRequestParameters(route){
        let routeMatched = this.requestPath().match(route.regExp);
        if (!routeMatched) return;
        let param = {};
        routeMatched.forEach((value, index)=>{
            if(index !== 0){
                let key = Object.getOwnPropertyNames(route.parameters[index - 1]);
                param[key] = value;
            }
        });
        return param;
    }


    pathFor(name, parameters = {}){
        let nameFound = false;
        let uri;
        this.routes.some(route=>{
            if(route.name === name){
                nameFound = true;
                uri = route.uri;
                if(this.containsParameter(uri)){

                    let array  = [];
                    for(let value of route.uri.match(/\{(\w+)\}/g)){
                        value = value.replace("{","");
                        value = value.replace("}","");
                        array.push(value);
                    }
                    if(array.length !== Object.getOwnPropertyNames(parameters).length) throw new Error(`The route with name [${name}] contains ${array.length} parameters. ${Object.getOwnPropertyNames(parameters).length} given`)
                    for(let parameter in parameters){
                        if (!array.includes(parameter)) throw new Error(`Invalid parameter name [${parameter}]`);
                        let r = new RegExp(`{${parameter}}`,"g");
                        uri = uri.replace(r, parameters[parameter]);
                    }
                }
            }
        });
        if (!nameFound) throw new Error(`Invalid route name [${name}]`);
        return uri;
    }

    goTo(url, data = {}, title =""){

        if(!this._historyMode){
            let storage = window.localStorage;
            storage.setItem("pushState", data);
            return window.location.href= url;
        }

        window.history.pushState(data, title, url);
        return this.init();
    }
}
