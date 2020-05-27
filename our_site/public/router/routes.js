import Router from  "./router.js";

const router = new Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get('/home', function(req, router){
    displayPage("home");
  });

  router.get('/shows', function(req, router){
    displayPage("shows");
  });

  // router.get('/shows/{showID}', function(req, router){
  //   console.log('need to implement route');

  //   //displayPage("shows");
  // }).where("showID","[0-9]");

  router.get('/account', function(req, router){
    displayPage("account");
  });


  router.init();
}

initRouter();
window.router = router;
