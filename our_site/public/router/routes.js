

var router = new window.Router();

// I changed the url to match page names for now, can always do something better later
function initRouter() {
  router.get("/", function() {
    window.displayPage("home", "");
  });

  router.get("/shows", function() {
    window.displayPage("shows", "/shows");
  });

  router.get("/Shows", function() {
    window.displayPage("shows", "/shows");
  });

  // example route with params
  router.get("/shows/{showID}", function() {

    // get the id from req

    // display things
    window.displayPage("shows");

  }).where("showID","[0-9]");

  router.get("/account", function() {
    window.displayPage("account", "/account");
  });

  router.get("/Account", function() {
    window.displayPage("account", "/account");
  });

  router.notFoundFunction = function() {
    window.displayPage("404-page");
  };


  router.init();
}

window.initRouter = initRouter;
