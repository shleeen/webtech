import Router from './router.js'
//import { displayHome, displayShows} from '../js/index.js'

const router = new Router();

router.get('/home', function(req, router){
    //displayHome();
    console.log(req.path); // outputs /about-me to the console
    console.log('displaying home');

    document.getElementById("shows").classList.remove('active');
    document.getElementById("shows").classList.add('none_active');
    document.getElementById("home").classList.remove('none_active');
    document.getElementById("home").classList.add('active');
   
    window.history.pushState({}, '', 'Home');

    console.log('ho' + req.path); // outputs /about-me to the console
});

router.get('/shows', function(req, router){
    //displayShows();
    console.log('displaying shows');

    document.getElementById("home").classList.remove('active');
    document.getElementById("home").classList.add('none_active');
    document.getElementById("shows").classList.remove('none_active');
    document.getElementById("shows").classList.add('active');
    
    window.history.pushState({}, '', 'Shows');
    console.log(req.path); 
});

router.init();