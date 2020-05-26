import Router from  "./router.js";

"use strict";
const router = new Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get('/home', function(req, router){
    console.log(req.path);
    displayPage("home");
  });

  router.get('/shows', function(req, router){
    displayPage("shows");
  });

  router.get('/shows/{showID}', function(req, router){
    console.log('need to implement route');
    // hide all and show the show deets, ideally with id: show-[showID]
  }).where("showsID","[0,9]+");



  router.get('/account', function(req, router){
    displayPage("account");
  });


  router.init();
  console.log('init done')
}

initRouter();
window.router = router;
