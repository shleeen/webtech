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

  var toRegister = document.querySelector(".modal-to-register");
  var regToLogin = document.querySelector(".modal-reg-to-login");
  var forgotToLogin = document.querySelector(".modal-forgot-to-login");
  var toForget = document.querySelector(".modal-to-forget");

  // displays the modal when 'login/register' is clicked
  loginTrigger.onclick = function() {
    modal.style.display = "block";
    drawLogin();
  };

  function closeModal() {
    modal.style.display = "none";
    // Set back to default state for next time it is opened
    document.getElementById("login-content").classList.remove("none_active");
    document.getElementById("register-content").classList.add("none_active");
    document.getElementById("forgot-content").classList.add("none_active");
  }

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

}


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

function increaseLength(path, length){
  var pathLength = path.getTotalLength();
  length += 1;
  path.style.strokeDasharray = [length,pathLength].join(" ");
  if (length >= pathLength) clearInterval(timer);
}

function stopDrawingPath(){
  clearInterval(timer);
  orig.style.stroke = "";
  orig.style.strokeDasharray = "";
}