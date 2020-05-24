"use strict";
// ----- Globals so they can be loaded after the entire site is loaded and used throughout------------------------------------------------------------
var navbar;
// ----------------------------------------------------------------------------

addEventListener('load', start);

function start() {

    initRouter();
    addContent();
    addListeners();

    // Spash screen there so that the page loads
    setTimeout(function () {
        removeOverlaySpashScreen();
    }, 3500);


    // Set height of contents
    var homeObj = document.getElementById("home-object");
    var indexHeight = window.innerHeight;
    homeObj.onload = function(){
        //homeObj.style.height = homeObj.contentWindow.document.body.scrollHeight + 'px';

        // This gets the height of embedded html
        var height = homeObj.contentDocument.body.scrollHeight;

        if (height > indexHeight) homeObj.style.height = height + 'px';
        else homeObj.style.height = indexHeight + 'px';
    }

    var showObj = document.getElementById("shows-object");
    showObj.onload = function(){
        //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
        var height = showObj.contentDocument.body.scrollHeight;

        if (height > indexHeight) showObj.style.height = height + 'px';
        else showObj.style.height = indexHeight + 'px';
    }
    navbar = document.getElementById('navbar');
    
} 

// -------------------------------------------------------------------------------------------------

// This gets params like url/?a=?
//var dynamicContent = getParameterByName('dc');
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function removeOverlaySpashScreen() {
  document.getElementById("overlay").classList.add("fade");
  setTimeout(function() {
    var i = 9;
    document.getElementById("overlay").style.opacity = 1;
    var k = window.setInterval(function() {
      if (i <= 0) {
        clearInterval(k);
        document.getElementById("overlay").style.display = "none";
      } else {
        document.getElementById("overlay").style.opacity = i / 10;
        i--;
      }
    }, 100);
        
  }, 900);
}

function addListeners() {

  document.getElementById("shows_tab").addEventListener("click", function() {
    console.log("click");
    displayShows();
  });

  document.getElementById("home_tab").addEventListener("click", function() {
    console.log("click");
    displayHome();
  });

  window.addEventListener("popstate", function () {
    // The URL changed...
    console.log("LOO");
  });
  
}

function addContent() {
  document.getElementById("shows").innerHTML = "<object id=\"shows-object\" type=\"text/html\" data=\"shows.html\" width=\"100%\"></object>";
  document.getElementById("home").innerHTML = "<object id=\"home-object\" type=\"text/html\" data=\"home.html\" width=\"100%\"></object>";
}

function displayHome() {
    console.log('displaying home');

    setTimeout(function() {
      var i = 9;
      document.getElementById("shows").style.opacity = 1;
      var k = window.setInterval(function() {
        if (i <= 0) {
          clearInterval(k);
          document.getElementById("shows").classList.remove('active');
          document.getElementById("shows").classList.add('none_active');
          document.getElementById("home").style.opacity = 0;
          document.getElementById("home").classList.remove('none_active');
          document.getElementById("home").classList.add('active');

        } else {
          document.getElementById("shows").style.opacity = i / 10;
          i--;
        }
      }, 50);
          
    }, 300);

    // fade in
    setTimeout(function() {
      var i = 0;
      
      var k = window.setInterval(function() {
        if (i >= 10) {
          clearInterval(k);
          
          document.getElementById("home").style.opacity = 1;

        } else {
          document.getElementById("home").style.opacity = i / 10;
          i++;
        }
      }, 100);
    }, 600);
    
   
  window.history.pushState({}, "", "Home");
}

function displayShows() {
    console.log('displaying shows');

     setTimeout(function() {
      var i = 9;
      document.getElementById("home").style.opacity = 1;
      var k = window.setInterval(function() {
        if (i <= 0) {
          clearInterval(k);
          document.getElementById("home").classList.remove('active');
          document.getElementById("home").classList.add('none_active');

          document.getElementById("shows").style.opacity = 0;
          document.getElementById("shows").classList.remove('none_active');
          document.getElementById("shows").classList.add('active');

        } else {
          document.getElementById("home").style.opacity = i / 10;
          i--;
        }
      }, 50);  
    }, 300);

    // fade in
    setTimeout(function() {
      var i = 0;
      var k = window.setInterval(function() {
        if (i >= 10) {
          clearInterval(k);
          
          document.getElementById("shows").style.opacity = 1;

        } else {
          document.getElementById("shows").style.opacity = i / 10;
          i++;
        }
      }, 100);
    }, 600);

  window.history.pushState({}, "", "Shows");
}


// ----------------------------------------------------------------------------------------

   
// listener to hide nav when scrolling down and show nav when scrolling up
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  if (window.scrollY == 0){
    navbar.classList.remove('hover');
  } else {
    navbar.classList.add('hover');
  }
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    
    // remove hover
    window.document.getElementById("navbar").style.top = "0";

  } else {
    window.document.getElementById("navbar").style.top = "-60px";
  }
  prevScrollpos = currentScrollPos;
};