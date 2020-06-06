"use strict";

// ----- Globals so they can be loaded after the entire site is loaded and used throughout------------------------------------------------------------
var navbar;

window.renderFunctions = {};
// ----------------------------------------------------------------------------

addEventListener("load", start);

function start() {
  window.initRouter();
  addListeners();

  // Spash screen there so that the page loads
  setTimeout(function () {
    removeOverlaySpashScreen();
  }, 1000);

  setHeight();

  navbar = document.getElementById("navbar");
} 

// -------------------------------------------------------------------------------------------------
function setHeight(){
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

    // // TODO: make it so that resizing wouldnt hide part of it
    // var accountObj = document.getElementById("account-object");

    // accountObj.onload = function(){
    //   //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
    //   var height = accountObj.contentDocument.body.scrollHeight;

    //   if (height > indexHeight) accountObj.style.height = height + "px";
    //   else accountObj.style.height = indexHeight + "px";
    // };
    
  }, 1500);
}
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
  // window resize
  window.addEventListener("resize", function () {
    setHeight();

  }); 

  document.getElementById("shows_tab").addEventListener("click", function() {
    displayPage("shows", "/shows");
  });

  document.getElementById("home_tab").addEventListener("click", function() {
    displayPage("home", "");
  });

  document.getElementById("my-account").addEventListener("click", function() {
    displayPage("account", "/account");
  });


  var pages = document.getElementsByClassName("subpage");
  for (var page = 0; page < pages.length; page++) {
    pages[page].addEventListener("transitionend", pageFadeEnd);
  }

  // This changes according to things like when back is pressed
  window.addEventListener("popstate", function (event) {
    // The URL changed...
    if (event.state) {
      displayPage(event.state.id, event.state.url, true);
    }
  });
  
}


// @nicole seeing the same function pasted 3 times made me sad
// DRYYYYYYYYYY
// Eh yea I was meant to fix that, got halfway and got bored and frustrated coz apparentl getelementbyclassname updates according to classlsit updates, tyvm
function displayPage(pageName, newURL, popState) {
  console.log("displaying " + pageName);

  var main = document.getElementById("main");
  var currentActive = main.getElementsByClassName("active");
  
  if (newURL !== undefined && !popState) {
    var state = { id: pageName, url: newURL };
    newURL = location.protocol + "//" + location.host + newURL;
    if (!window.top.history.state) {
      window.top.history.pushState(state, "", newURL);
    }
    else if (newURL !== window.top.history.state.url) {
      window.top.history.pushState(state, "", newURL);
    }
  }

  if (window.renderFunctions[pageName]) {
    window.renderFunctions[pageName]();
  }

  if (currentActive.length === 1) {
    var old_page = currentActive[0];
    if (old_page.id === pageName) return;
    old_page.classList.add("transitioning");
    old_page.classList.remove("active");
    document.getElementById(pageName).classList.add("to-transition");
    document.getElementById(pageName).classList.remove("non-active");
    document.getElementById(pageName).style.opacity = "0";
    old_page.style.opacity = "0";
  }
  // This is a mess but it robustly handles the page transition behaviour
  //   case 1, no transitions, display page immediately
  //   case 2, target page is to-transition, do nothing
  //   case 3, target page is transitioning
  //     if to-transition tag exists, remove it and make that page non-active, set target_page opacity to 1
  //     else, do nothing
  //   case 4, target page is neither, but both exist
  //     remove to-transition tag, add non-active, and add to_transition to target page
  //   case 5, target page is neither, only transition exists
  //     add to-transition and remove non-active from target page, set transition page opacity to 0
  else {
    var transitionElems = main.getElementsByClassName("transitioning");
    var toTransitionElems = main.getElementsByClassName("to-transition");
    var haveTransition = (transitionElems.length === 1);
    var haveToTransition = (toTransitionElems.length === 1);
    if (!haveTransition && !haveToTransition) {
      document.getElementById(pageName).classList.add("active");
      document.getElementById(pageName).classList.remove("non-active");
      document.getElementById(pageName).style.opacity = "1";
    }
    else if (haveTransition && !haveToTransition) {
      if (transitionElems[0].id !== pageName) {
        document.getElementById(pageName).classList.add("to-transition");
        document.getElementById(pageName).classList.remove("non-active");
        document.getElementById(pageName).style.opacity = "0";
        transitionElems[0].style.opacity = "0";
      }
    }
    else {
      if (transitionElems[0].id === pageName) {
        toTransitionElems[0].classList.add("non-active");
        toTransitionElems[0].classList.remove("to-transition");
        document.getElementById(pageName).style.opacity = "1";

        // Maybe add in a bit where if if its 'show' then reset to default shows so it resets each time
      }
      else if (toTransitionElems[0].id !== pageName) {
        toTransitionElems[0].classList.add("non-active");
        toTransitionElems[0].classList.remove("to-transition");
        document.getElementById(pageName).classList.add("to-transition");
        document.getElementById(pageName).classList.remove("non-active");
        document.getElementById(pageName).style.opacity = "0";
      }
    }
  }
}

function pageFadeEnd(event) {
  if (event.target.style.opacity === "0") {
    event.target.classList.add("non-active");
    var new_page = document.getElementsByClassName("to-transition")[0];
    new_page.classList.add("transitioning");
    new_page.classList.remove("to-transition");
    window.setTimeout(function() {
      new_page.style.opacity = "1";
    }, 10);
  }
  else if (event.target.style.opacity === "1") {
    event.target.classList.add("active");
  }
  event.target.classList.remove("transitioning");
}

// SCROLL FUNCTION
   
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



