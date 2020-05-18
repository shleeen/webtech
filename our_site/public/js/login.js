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
  var toLogin = document.querySelector(".modal-to-login");

  // displays the modal when 'login/register' is clicked
  loginTrigger.onclick = function() {
    modal.style.display = "block";
    drawLogin();
  };

  // close the modal using the cross button
  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  // close the modal by clicking outside
  window.onclick = function(event) {
    if (event.target === modal){
      modal.style.display = "none";
    }
  };

  toRegister.onclick = function() {
    document.getElementById('login-content').classList.add('none_active');
    document.getElementById('register-content').classList.remove('none_active');
  }

  toLogin.onclick = function(){
    // THIS DOESNT WORK
    drawLogin();
    document.getElementById('register-content').classList.add('none_active');
    document.getElementById('login-content').classList.remove('none_active');
  }

}


function drawLogin(){
  var orig = document.getElementById('login-svg');
  var svgDoc;

  orig.addEventListener("load",function() {
    svgDoc = orig.contentDocument;
    var paths = svgDoc.getElementsByTagName('path'); 
    var i;
    for (i=0; i< paths.length; i++){
      console.log(paths[i])
      startDrawingPath(paths[i]);
    }
  }, false);
}


function startDrawingPath(path){
  path.style.stroke = '#fff'
  path.style.strokeWidth = 1.5;
  path.style.strokeDasharray = path.getTotalLength() + 20;
  path.style.strokeDashoffset = path.getTotalLength();
  
  animate(path, path.getTotalLength());
}

function animate(path, len) {
  path.style.strokeDashoffset = len - 2;
  if (path.style.strokeDashoffset < 0) path.style.strokeDashoffset = 0;
  console.log(path.style.strokeDashoffset)

  if (path.style.strokeDashoffset > 0) {
    // Do another step
    setTimeout(function() { animate(path, path.style.strokeDashoffset); }, 100);
  }
  
}

function increaseLength(path, length){
  var pathLength = path.getTotalLength();
  length += 1;
  path.style.strokeDasharray = [length,pathLength].join(' ');
  if (length >= pathLength) clearInterval(timer);
}

function stopDrawingPath(){
  clearInterval(timer);
  orig.style.stroke = '';
  orig.style.strokeDasharray = '';
}