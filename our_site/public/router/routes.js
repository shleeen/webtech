import Router from  "./router.js";

const router = new Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get('/', function(req, router){
    displayPage("home", true);
  });

  router.get('/home', function(req, router){
    displayPage("home", true);
  });

  router.get('/Home', function(req, router){
    displayPage("home", true);
  });

  router.get('/shows', function(req, router){
    displayPage("shows", true);
  });

  router.get('/Shows', function(req, router){
    displayPage("shows", true);
  });

  // example route with params
  router.get('/shows/{showID}', function(req, router){

    // get the id from req

    // display things
    displayPage("shows", false);

  }).where("showID","[0-9]");

  // router.get('/account', function(req, router){
  //   displayPage("account");
  // });

  // router.get('/Account', function(req, router){
  //   displayPage("account");
  // });


  router.init();
}

initRouter();
window.router = router;
