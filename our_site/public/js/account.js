"use strict";
addEventListener("load", start);
function start() {
  addListeners();
  console.log("account.html loaded");
} 

function addListeners(){

  // maybe this can be one fucntion oops
  document.getElementById("acc-details-nav").addEventListener("click", function(event) {

    // element to scroll to
    // var dest = document.getElementById("account-details");
    smoothScroll('account-details', 600);

  })

  document.getElementById("trans-details-nav").addEventListener("click", function(event) {

    // element to scroll to
    // var dest = document.getElementById("account-details");
    smoothScroll('trans-details', 600);

  })
}


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


