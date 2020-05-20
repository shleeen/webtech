class Router {
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

        // Check is exists
        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        });


        // Then we add routes
        const route = {
            uri, 
            callback
        }
        this.routes.push(route);

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