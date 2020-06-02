"use strict";
addEventListener("load", start);
function start() {
  addListeners();
  getAccountDetails();

  var accObj = window.parent.document.getElementById("account-object");
  var indexHeight = window.parent.innerHeight;
  accObj.onload = function(){
    //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
    var height = accObj.contentDocument.body.scrollHeight;
    console.log(height)
    console.log(indexHeight)

    if (height > indexHeight) accObj.style.height = height + "px";
    else accObj.style.height = indexHeight + "px";
  };


  console.log("account.html loaded");
} 

function addListeners(){

  // scrollintoview works but doesnt do a smooth scroll
  // smooth scroll does the scroll but not the right position
  document.getElementById("acc-details-nav").addEventListener("click", function(event) {
    // var target = document.getElementById('account-details')
    // target.scrollIntoView();

    smoothScroll('account-details', 600);

  })

  document.getElementById("trans-details-nav").addEventListener("click", function(event) {
    // var target = document.getElementById('trans-details')
    // target.scrollIntoView();

    smoothScroll('trans-details', 600);

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
  getTransactions();
}

function getUserInfo(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      if (res.valid) {
        document.getElementById('username').innerHTML = res.data.username;
        document.getElementById('firstname').innerHTML = res.data.first_name;
        document.getElementById('lastname').innerHTML = res.data.last_name;
        document.getElementById('email').innerHTML = res.data.email;
      }
      else {
        // Not logged in, redirect home
        window.top.displayPage("home", "");
      }
    }
  };

  xhr.open("GET", "/api/user/getUserInfo", true);
  xhr.responseType = "json";

  xhr.send();
}

function moneyToString(amount) {
  var pounds = Math.floor(amount / 100);
  var pence = (amount % 100).toString();
  if (pence.length === 1) pence = "0" + pence;
  return "£" + pounds + "." + pence;
}

function getTransactions(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      var results = [];

      for (var r in res) {
        res[r].price = moneyToString(res[r].price);
        res[r].order_total = moneyToString(res[r].order_total);
        results.push(res[r]);
      }

      // document.getElementById("trans-details").innerHTML += template.render("display-trans", {poster_img: res[x].poster_path, bookingRef: res[x].booking_ref, name: res[x].name, date: res[x].date, time: res[x].doors_open, bookTime: res[x].booking_time, paymentStat:res[x].paid,
      //  seats: res[x].seat_number, totalAmount: res[x].order_total });
      document.getElementById("trans-details").innerHTML += template.render("display-trans", results, results.length);


    }
  }


  xhr.open("GET", "/api/user/getUserTransactions", true);
  xhr.responseType = "json";

  xhr.send();

}


// listener to hide nav when scrolling down and show nav when scrolling up
var navbar = window.parent.document.getElementById("navbar");
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
    window.parent.document.getElementById("navbar").style.top = "0";

  } else {
    window.parent.document.getElementById("navbar").style.top = "-60px";
  }
  prevScrollpos = currentScrollPos;
};


