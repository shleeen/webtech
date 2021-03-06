"use strict";

// import { raw } from "body-parser";

addEventListener("load", start);
function start() {
  addListeners();
  getAccountDetails();

  var accObj = window.parent.document.getElementById("account-object");
  var indexHeight = window.parent.innerHeight;
  accObj.onresize = function(){
    //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
    var height = accObj.contentDocument.body.scrollHeight;

    if (height > indexHeight) {
      accObj.style.height = height + "px"; alert("here");
    }
      else accObj.style.height = indexHeight + "px";
  };

  console.log("account.html loaded");
} 

function render() {
  getAccountDetails();
}
window.top.renderFunctions["account"] = render;

function addListeners(){
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
var months = { "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR", "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC" };

function formatDate(rawdate){
  var formattedDate = "";
  var parts = rawdate.split("-");
  var formattedDate = parts[2] + " " + months[parts[1]] + " " + parts[0];
  return formattedDate;
}

function smoothScroll(target, duration){
  var target = document.getElementById(target)
  var targetPosition = target.getBoundingClientRect().top;
  var startPosition = window.pageYOffset;
  var distance = targetPosition - startPosition;
  var startTime = null;

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
      var res = JSON.parse(xhr.responseText);
      if (res.valid) {
        document.getElementById("account-content").innerHTML = template.render("account-template", res.data);
      }
      else {
        // Not logged in, redirect home
        if (window.top.location.pathname === "/account")
          window.top.displayPage("home", "");
      }
    }
  };
  xhr.open("GET", "/api/user/getUserInfo", true);

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
      var res = JSON.parse(xhr.responseText);
      var results = [];

      for (var r in res) {
        for (var p in res[r].prices){
          res[r].prices[p] = moneyToString(res[r].prices[p]);
        }
        
        res[r].order_total = moneyToString(res[r].order_total);
        res[r].date = formatDate(res[r].date);
        res[r].booking_time = res[r].booking_time.substr(0, 19).replace("T", " ");
        results.push(res[r]);
      }

      document.getElementById("trans-details-content").innerHTML = template.render("display-trans", results, results.length);
    }
  };
  xhr.open("GET", "/api/user/getUserTransactions", true);

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


