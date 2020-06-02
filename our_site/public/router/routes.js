import Router from  "./router.js";

const router = new Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get('/', function(req, router){
    displayPage("home", "");
  });

  router.get('/shows', function(req, router){
    displayPage("shows", "/shows");
  });

  router.get('/Shows', function(req, router){
    displayPage("shows", "/shows");
  });

  // example route with params
  router.get('/shows/{showID}', function(req, router){

    // get the id from req

    // display things
    displayPage("shows");

  }).where("showID","[0-9]");

  router.get('/account', function(req, router){
    displayPage("account", "/account");
  });

  router.get('/Account', function(req, router){
    displayPage("account", "/account");
  });

  router.notFoundFunction = function() {
    displayPage("404-page");
  }


  router.init();
}

initRouter();
window.router = router;
