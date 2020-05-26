export default class Router {
    constructor() {
        // Stores all routes
        this.routes = [];
    }


    // Get a particular uri and return a callback
    get(uri, callback){
        // Check params--------------------------------------------------------
        // Check if empty
        if(!uri || !callback) throw new Error('uri or callback must be given');

        // Check types
        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');

        // Check callback
        if(typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        


        // Then we add routes
        // const route = {
        //     uri, 
        //     callback
        // }

        let route = {
            uri: null,
            callback: null,
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
    }

    where(name, regExp){
        
        //validate type
        if(!Utils.isSet(name)) throw new ArgNotFound("name");
        if(!Utils.isSet(regExp)) throw new ArgNotFound("regExp");
        if(!Utils.isString(name)) throw new ArgTypeError("name", "string", name);
        if(!Utils.isString(regExp)) throw new ArgTypeError("regExp", "string", regExp);

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


    
    // Compares with the current pathname
    init(){
        this.routes.some(route=>{

            let regEx = new RegExp(`^${route.uri}$`); // Convert to regular express
            let path = window.location.pathname; // get current path

            // Check if the current path is a match in the list of routes we have
            if(path.match(regEx)){

                let req = { path } 
                return route.callback.call(this, req);
            }
        })
    }
}
