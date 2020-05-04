"use strict";
addEventListener('load', start);

function start() {

    var path = window.location.pathname;
    console.log(path);
    if (path == '/Shows') {
        displayShows();
    } else {
        displayHome();
    }
    addContent();
    addListeners();
    setTimeout(function () {
        removeOverlaySpashScreen();
    }, 3500);
    
} 

// This gets params like url/?a=?
//var dynamicContent = getParameterByName('dc');
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function removeOverlaySpashScreen(){
    document.getElementById("overlay").classList.add('fade');
    setTimeout(function () {
        document.getElementById("overlay").style.display = 'none';
    }, 900);
}

function addListeners(){

    document.getElementById("shows_tab").addEventListener("click", function(){
        console.log('click');
        displayShows();
    });

    document.getElementById("home_tab").addEventListener("click", function(){
        console.log('click');
        displayHome();
    });

    window.addEventListener('popstate', function (event) {
        // The URL changed...
        console.log("LOO");
    });
}

function addContent(){
    document.getElementById("shows").innerHTML = '<object type="text/html" data="shows.html" ></object>';
    document.getElementById("home").innerHTML = '<object type="text/html" data="home.html" ></object>';
}

function displayHome() {
    document.getElementById("shows").classList.remove('active');
    document.getElementById("shows").classList.add('none_active');
    document.getElementById("home").classList.remove('none_active');
    document.getElementById("home").classList.add('active');

    window.history.pushState({}, '', 'Home');
}

function displayShows() {
    document.getElementById("home").classList.remove('active');
    document.getElementById("home").classList.add('none_active');
    document.getElementById("shows").classList.remove('none_active');
    document.getElementById("shows").classList.add('active');
    
    window.history.pushState({}, '', 'Shows');
}
   
