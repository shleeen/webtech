// This has everything for the login/ register modal

"use strict";
addEventListener("load", start);
function start() {
  addLoginListeners(); // uh I dunno if this should be here of 
  console.log("login.html loaded");
} 

function addLoginListeners() {
  var loginTrigger = document.getElementById("login"); //this is the trigger
  var modal = document.querySelector(".modal");
  var closeBtn = document.querySelector(".close-btn");

  var toRegister = document.getElementById("modal-to-register");
  var regToLogin = document.getElementById("modal-reg-to-login");
  var forgotToLogin = document.getElementById("modal-forgot-to-login");
  var toForget = document.getElementById("modal-to-forget");

  var loginForm = document.getElementById("login-content");
  var registerForm = document.getElementById("register-content");

  function closeModal() {
    modal.style.display = "none";
    // Set back to default state for next time it is opened
    document.getElementById("login-content").classList.remove("none_active");
    document.getElementById("register-content").classList.add("none_active");
    document.getElementById("forgot-content").classList.add("none_active");
  }
  

  // displays the modal when 'login/register' is clicked
  loginTrigger.onclick = function() {
    modal.style.display = "block";
    drawLogin();
  };

  // close the modal using the cross button
  closeBtn.onclick = closeModal;

  // close the modal by clicking outside
  window.onclick = function(event) {
    if (event.target === modal){
      closeModal();
    }
  };

  toRegister.onclick = function() {
    document.getElementById("register-content").classList.remove("none_active");
    document.getElementById("login-content").classList.add("none_active");
  };

  toForget.onclick = function() {
    document.getElementById("forgot-content").classList.remove("none_active");
    document.getElementById("login-content").classList.add("none_active");
  };

  regToLogin.onclick = function(){
    // seems like the remove has to come first?
    document.getElementById("login-content").classList.remove("none_active");
    document.getElementById("register-content").classList.add("none_active");
    drawLogin();
  };

  forgotToLogin.onclick = function(){
    // seems like the remove has to come first?
    document.getElementById("login-content").classList.remove("none_active");
    document.getElementById("forgot-content").classList.add("none_active");
    drawLogin();
  };


  document.getElementById("logout").addEventListener("mouseover", function( event ) {   
    document.getElementById("my-account").classList.remove("non-active");
    document.getElementById("logout").classList.remove("non-active");
  }, false);


  document.getElementById("logout").onmouseout = function()   {
    document.getElementById("my-account").classList.add("non-active");
    document.getElementById("logout").classList.add("non-active");
  };

  // What happens when person tries to login?
  // This would be neater in separate functions
  loginForm.addEventListener("submit", function(event) {
  
    // This sends the form without reloading the page
    event.preventDefault();
    var formData = new FormData(event.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 204) {
          // If success show user logged in stuff
          document.getElementById("login").classList.add("non-active");
          document.getElementById("login-user").classList.remove("non-active");
          document.getElementById("login-user").classList.add("active");
          closeModal();
        }
        else if (request.status === 401) {
          console.log("BAD");
        }
      }
    };
    request.open("POST", event.target.action);
    request.send(formData);

    // Save session things ..?
    // Its only just occured to me, how about web tokens
  }, false);

  registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 201) {
          // what needs to be done here hm
          alert("you're registered");

          // clear form data

          // close modal
          closeModal();
        }
        else if (request.status === 400) {
          console.log("BAD");
        }
      }
    };
    request.open("POST", event.target.action);
    request.send(formData);
  });
}

// ---- Functions --------------------------------------------------------------------------------------------------

function drawLogin(){
  var orig = document.getElementById("login-svg");
  var svgDoc;

  orig.addEventListener("load",function() {
    svgDoc = orig.contentDocument;
    var paths = svgDoc.getElementsByTagName("path"); 
    var i;
    for (i=0; i< paths.length; i++){
      console.log(paths[i]);
      startDrawingPath(paths[i]);
    }
  }, false);
}


function startDrawingPath(path){
  path.style.stroke = "#371545";
  path.style.strokeWidth = 0.7;
  path.style.strokeDasharray = path.getTotalLength() + 20;
  path.style.strokeDashoffset = path.getTotalLength();
  
  animate(path, path.getTotalLength());
}

function animate(path, len) {
  path.style.strokeDashoffset = len - 2;
  if (path.style.strokeDashoffset < 0) path.style.strokeDashoffset = 0;
  console.log(path.style.strokeDashoffset);

  if (path.style.strokeDashoffset > 0) {
    // Do another step
    setTimeout(function() { animate(path, path.style.strokeDashoffset); }, 100);
  }
}
