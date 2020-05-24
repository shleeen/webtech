"use strict";
// ----- Globals so they can be loaded after the entire site is loaded and used throughout------------------------------------------------------------
var navbar;
// ----------------------------------------------------------------------------

addEventListener('load', start);

function start() {

    initRouter();
    addListeners();

    // Spash screen there so that the page loads
    setTimeout(function () {
        removeOverlaySpashScreen();
    }, 3500);

    setTimeout(function () {
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
    }, 1500);


    
    
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

  document.getElementById("my-account").addEventListener("click", function() {
    console.log("click");
    displayAccount();
  });


  // This changes according to things like when back is pressed
  window.addEventListener("popstate", function (event) {
    // The URL changed...
    if (history.state && history.state.id === "home"){
      console.log("LOO");
      displayHome();
    } else if (history.state && history.state.id == "shows"){
      console.log("LOOnns");
      displayShows();
    }
  });
  
}


// Display pages

function displayHome() {
    console.log('displaying home');

    var main = document.getElementById("main");
    var currentActive = main.getElementsByClassName("active");

    if (currentActive.length == 1){
      setTimeout(function() {
        var i = 9;
        currentActive[0].style.opacity = 1;
        var k = window.setInterval(function() {
          if (i <= 0) {
            clearInterval(k);
            currentActive[0].classList.add('none_active');
            currentActive[0].classList.remove('active');
            
            document.getElementById("home").classList.add('active');
            document.getElementById("home").classList.remove('none_active');
            document.getElementById("home").style.opacity = 0;
            
          } else {
            currentActive[0].style.opacity = i / 10;
            i--;
          }
        }, 20);
      }, 400);

      
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
        }, 60);
      }, 600);
    }
  var stateObj = { id: "home" };
  window.history.pushState(stateObj, "", "Home");
}

function displayShows() {
    console.log('displaying shows');

    var main = document.getElementById("main");
    var currentActive = main.getElementsByClassName("active");
    
    if (currentActive.length == 1){
      
      setTimeout(function() {
        var i = 9;
        currentActive[0].style.opacity = 1.0;
        var k = window.setInterval(function() {
          
          if (i == 1) {
            clearInterval(k);
            currentActive[0].classList.add('none_active');
            currentActive[0].classList.remove('active');

            document.getElementById("shows").classList.remove('none_active');
            document.getElementById("shows").style.opacity = 0;
            
            
          } else {
            currentActive[0].style.opacity = i / 10;
            i--;
          }
        }, 20);
      }, 400);
      
      // fade in
      setTimeout(function() {
        var i = 0;
        document.getElementById("shows").classList.add('active');
        
        var k = window.setInterval(function() {
          if (i >= 10) {
            clearInterval(k);
            
            document.getElementById("shows").style.opacity = 1;

          } else {
            document.getElementById("shows").style.opacity = i / 10;
            i++;
          }
        }, 60);
      }, 600);
    }
  var stateObj = { id: "shows" };
  window.history.pushState(stateObj, "", "Shows");
}

function displayAccount() {
  console.log('displaying account');

  var main = document.getElementById("main");
  var currentActive = main.getElementsByClassName("active");

  if (currentActive.length == 1){
    setTimeout(function() {
      var i = 9;
      currentActive[0].style.opacity = 1;
      var k = window.setInterval(function() {
        if (i <= 0) {
          clearInterval(k);
          currentActive[0].classList.add('none_active');
          currentActive[0].classList.remove('active');
          
          document.getElementById("account").classList.add('active');
          document.getElementById("account").classList.remove('none_active');
          document.getElementById("account").style.opacity = 0;
          
        } else {
          currentActive[0].style.opacity = i / 10;
          i--;
        }
      }, 20);
    }, 400);

    
    // fade in
    setTimeout(function() {
      var i = 0;
      var k = window.setInterval(function() {
        if (i >= 10) {
          clearInterval(k);
          
          document.getElementById("account").style.opacity = 1;

        } else {
          document.getElementById("account").style.opacity = i / 10;
          i++;
        }
      }, 60);
    }, 600);
  }
window.history.pushState({}, "", "MyAccount");
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