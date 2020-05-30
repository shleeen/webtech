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
  getTransactions();
}

function getUserInfo(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      console.log(res.data)

      document.getElementById('username').innerHTML = res.data.username;
      document.getElementById('firstname').innerHTML = res.data.first_name;
      document.getElementById('lastname').innerHTML = res.data.last_name;
      document.getElementById('email').innerHTML = res.data.email;
    }
  };

  xhr.open("GET", "/api/user/getUserInfo", true);
  xhr.responseType = "json";

  xhr.send();
}

function getTransactions(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      var results = [];

      for (var r in res) {
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
// var navbar = window.parent.document.getElementById("navbar");
// var prevScrollpos = window.pageYOffset;
// window.onscroll = function () {
//   if (window.scrollY == 0){
//     navbar.classList.remove("hover");
//   } else {
//     navbar.classList.add("hover");
//   }
//   var currentScrollPos = window.pageYOffset;
//   if (prevScrollpos > currentScrollPos) {
    
//     // remove hover
//     window.parent.document.getElementById("navbar").style.top = "0";

//   } else {
//     window.parent.document.getElementById("navbar").style.top = "-60px";
//   }
//   prevScrollpos = currentScrollPos;
// };


