"use strict";

// ----- Globals so they can be loaded after the entire site is loaded and used throughout------------------------------------------------------------
var navbar;
// ----------------------------------------------------------------------------

addEventListener("load", start);

function start() {

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
    displayPage("shows", "/shows");
  });

  document.getElementById("home_tab").addEventListener("click", function() {
    console.log("click");
    displayPage("home", "");
  });

  document.getElementById("my-account").addEventListener("click", function() {
    console.log("click");
    if (document.getElementById("my-account").getElementsByTagName("object")[0] == null){
      document.getElementById("account").innerHTML = "<object id=\"account-object\" class=\"none-active\" type=\"text/html\" data=\"../account.html\" width=\"100%\"></object>";
    }

    displayPage("account", "/account");
  });

  document.getElementById("login-user").addEventListener("mouseover", function() {
    document.getElementById("my-account").style.display = 'block';
    document.getElementById("logout").style.display = 'block';
  });

  document.getElementById("logout").addEventListener("mouseover", function() {
    document.getElementById("my-account").style.display = 'block';
    document.getElementById("logout").style.display = 'block';
  });

  document.getElementById("logout").addEventListener("mouseout", function() {
    document.getElementById("my-account").style.display = 'none';
    document.getElementById("logout").style.display = 'none';
  });

  var pages = document.getElementsByClassName("subpage");
  for (var page = 0; page < pages.length; page++) {
    pages[page].addEventListener("transitionend", pageFadeEnd);
  }

  // This changes according to things like when back is pressed
  window.addEventListener("popstate", function (event) {
    // The URL changed...
    console.log(event.state);
    if (event.state) {
      displayPage(event.state.id, event.state.url);
    }
  });
  
}


// @nicole seeing the same function pasted 3 times made me sad
// DRYYYYYYYYYY
// Eh yea I was meant to fix that, got halfway and got bored and frustrated coz apparentl getelementbyclassname updates according to classlsit updates, tyvm
function displayPage(pageName, newURL) {
  console.log("displaying " + pageName);

  var main = document.getElementById("main");
  var currentActive = main.getElementsByClassName("active");
    
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
  
  // Could change later to have url name different to id name
  if (newURL !== undefined) {
    var state = { id: pageName, url: newURL };
    newURL = location.protocol + "//" + location.host + newURL;
    console.log(newURL);
    window.top.history.pushState(state, "", newURL);
  }
  //window.history.replaceState(stateObj, document.title, "/" + pageName);
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