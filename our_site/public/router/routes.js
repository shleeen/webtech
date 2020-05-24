const router = new Router();

function initRouter() {
  router.get('/Home', function(req, router){
    displayHome();
  });

  router.get('/Shows', function(req, router){
    displayShows();
  });

  router.get('/MyAccount', function(req, router){
    displayAccount();
  });

  router.init();
}
  
window.router = router;