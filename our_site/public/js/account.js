"use strict";
addEventListener("load", start);
function start() {
  addListeners();
  getAccountDetails();
  console.log("account.html loaded");
} 

function addListeners(){

  // scrollintoview works but doesnt do a smooth scroll
  // smooth scroll does the scroll but not the right position
  document.getElementById("acc-details-nav").addEventListener("click", function(event) {
    var target = document.getElementById('account-details')
    target.scrollIntoView();


    //smoothScroll('account-details', 600);

  })

  document.getElementById("trans-details-nav").addEventListener("click", function(event) {
    var target = document.getElementById('trans-details')
    target.scrollIntoView();

    
    //smoothScroll('trans-details', 600);

  })
}

// Functions --------------------------------------------------------------

function smoothScroll(target, duration){
  var target = document.getElementById(target)
  var targetPosition = target.getBoundingClientRect().top;
  var startPosition = window.pageYOffset;
  var distance = targetPosition - startPosition;
  var startTime = null;

  console.log(targetPosition)
  console.log(startPosition)


  function animation(currentTime){
    if (startTime === null) startTime = currentTime;
    var timeElapsed = currentTime - startTime;
    var run = ease(timeElapsed, startPosition, distance, duration);
    
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
    
  }

  function ease(t, b, c, d){
    t /= d;
    return c*t*t + b;
  };

  requestAnimationFrame(animation);
}


function getAccountDetails(){
  getUserInfo();

  // get transaction deets as well
}

function getUserInfo(){

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      console.log(res)
    }
  };

  xhr.open("GET", "/api/user/getUserInfo", true);
  xhr.responseType = "json";
  xhr.send();
}


