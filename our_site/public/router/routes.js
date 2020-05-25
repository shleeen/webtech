const router = new Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get('/home', function(req, router){
    displayPage("home");
  });

  router.get('/shows', function(req, router){
    displayPage("shows");
  });

  router.get('/account', function(req, router){
    displayPage("account");
  });

  router.init();
}
  
window.router = router;