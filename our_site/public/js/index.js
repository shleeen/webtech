"use strict";
// ----- Globals so they can be loaded after the entire site is loaded and used throughout------------------------------------------------------------
var navbar;
// ----------------------------------------------------------------------------

addEventListener("load", start);

function start() {

  // initRouter();
  addListeners();

  // Spash screen there so that the page loads
  setTimeout(function () {
    removeOverlaySpashScreen();
  }, 1000);

  setTimeout(function () {
    // Set height of contents
    var homeObj = document.getElementById("home-object");
    var indexHeight = window.innerHeight;
    homeObj.onload = function(){
      //homeObj.style.height = homeObj.contentWindow.document.body.scrollHeight + 'px';

      // This gets the height of embedded html
      var height = homeObj.contentDocument.body.scrollHeight;

      if (height > indexHeight) homeObj.style.height = height + "px";
      else homeObj.style.height = indexHeight + "px";
    };

    var showObj = document.getElementById("shows-object");
    showObj.onload = function(){
      //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
      var height = showObj.contentDocument.body.scrollHeight;

      if (height > indexHeight) showObj.style.height = height + "px";
      else showObj.style.height = indexHeight + "px";
    };
    navbar = document.getElementById("navbar");
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
  var splash = document.getElementById("overlay");
  splash.style.opacity = "0";
  splash.addEventListener("transitionend", function() {document.getElementById("overlay").style.display = "none"; });
}

function addListeners() {

  document.getElementById("shows_tab").addEventListener("click", function() {
    console.log("click");
    displayPage("shows");
  });

  document.getElementById("home_tab").addEventListener("click", function() {
    console.log("click");
    displayPage("home");
  });

  document.getElementById("my-account").addEventListener("click", function() {
    console.log("click");
    displayPage("account");
  });


  // This changes according to things like when back is pressed
  window.addEventListener("popstate", function (event) {
    // The URL changed...
    if (history.state) {
      console.log("LOO");
      displayPage(history.state.id);
    }
  });
  
}


// @nicole seeing the same function pasted 3 times made me sad
// DRYYYYYYYYYY
// Eh yea I was meant to fix that, got halfway and got bored and frustrated coz apparentl getelementbyclassname updates according to classlsit updates, tyvm
function displayPage(pageName) {
  console.log("displaying " + pageName);

  var main = document.getElementById("main");
  var currentActive = main.getElementsByClassName("active");
    
  if (currentActive.length == 1){
      
    setTimeout(function() {
      var i = 9;
      currentActive[0].style.opacity = 1.0;
      var k = window.setInterval(function() {
          
        if (i == 1) {
          clearInterval(k);
          currentActive[0].classList.add("none_active");
          currentActive[0].classList.remove("active");

          document.getElementById(pageName).classList.remove("none_active");
          document.getElementById(pageName).style.opacity = 0;
            
            
        } else {
          currentActive[0].style.opacity = i / 10;
          i--;
        }
      }, 20);
    }, 400);
      
    // fade in
    setTimeout(function() {
      var i = 0;
      document.getElementById(pageName).classList.add("active");
        
      var k = window.setInterval(function() {
        if (i >= 10) {
          clearInterval(k);
            
          document.getElementById(pageName).style.opacity = 1;

        } else {
          document.getElementById(pageName).style.opacity = i / 10;
          i++;
        }
      }, 60);
    }, 600);
  }
  var stateObj = { id: pageName };
  // Could change later to have url name different to id name
  window.history.pushState(stateObj, "", pageName);
}

   
// listener to hide nav when scrolling down and show nav when scrolling up
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  if (window.scrollY == 0){
    navbar.classList.remove("hover");
  } else {
    navbar.classList.add("hover");
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