"use strict";
document.addEventListener("DOMContentLoaded", start, false);

function start() {
  addShowsListeners();
  var param = window.parent.location.pathname.split("/").pop();
  if (param !== "shows" && param !== "") {
    getShow(param);
  }
  else {
    showAllProductions();
  }

  var showObj = document.getElementById("shows-object");
  var indexHeight = window.parent.innerHeight;
    showObj.onresize = function(){
    //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
    var height = showObj.contentDocument.body.scrollHeight;

    if (height > indexHeight) showObj.style.height = height + "px";
    else showObj.style.height = indexHeight + "px";
  };

  console.log("shows.html loaded");
}

// Globals to store show data so we don't do unnecessary requests
var loadedProductions = false;
var productionData = {};
var svg_loaded = false;
var selectedSeats = [];
var current_prod_id, current_show_id;

// for each production in db, should display the details on the Shows Page 
function getProductionDetails() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      productionData = xhr.response;
      var result = [];

      for (var p in productionData) {
        result.push(productionData[p]);
      }

      document.getElementById("shows-main").innerHTML += template.render("display-production", result, result.length);

      // !? shouldnt just clicking the button and poster take you to show-details not clicking everything?
      // yea i was just lazy and wanted to test
      var prods = document.getElementsByClassName("prod-container");
      for (var i = 0; i < prods.length; i++) {
        prods[i].addEventListener("click", showClick);
      }
      
      var posters = document.getElementsByClassName("prod-poster");
      for (i = 0; i < posters.length; i++) {
        posters[i].addEventListener("click", showClick);
      }
      loadedProductions = true;
    }
  };

  xhr.open("GET", "/api/shows/getProductionDetails", true);
  xhr.responseType = "json";
  xhr.send();
}

function showClick() {
  var prod_id = this.id.match(/\d+$/)[0];
  getShow(prod_id);
}

function getShow(prod_id) {
  current_prod_id = prod_id;
  if (productionData[prod_id]) {
    displayShow(productionData[prod_id]);
  }
  else {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
        displayShow(xhr.response); 
      }
    };
  
    xhr.open("GET", "/api/shows/getProductionDetails/" + prod_id, true);
    xhr.responseType = "json";
    xhr.send();
  }
}



// woohoo
var months = { "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR", "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC" };

function time24To12(time) {
  var hours = parseInt(time.split(":")[0], 10);
  var suffix = " AM";
  if (hours >= 12) {
    suffix = " PM";
    hours -= 12;
  }
  return hours.toString() + ":" + time.split(":")[1] + suffix;
}

function displayShow(data) {
  document.getElementById("shows-return").classList.remove("non-active");
  document.getElementById("shows-return").classList.add("active");

  // slightly confused as to why removing shows-main would hide it but active and non-active doesnt
  document.getElementById("shows-main").classList.remove("shows-main");
  document.getElementById("shows-main").classList.add("non-active");

  document.getElementById("show-details").classList.add("active");
  document.getElementById("show-details").classList.remove("non-active");
  
  // renders the data for each show details
  document.getElementById("show-details").innerHTML = template.render("show-template", data);

  // sorting through warnings, and displaying line by line into another template
  var rawWarnings = data.warnings;
  var listWarnings = rawWarnings.split("|");
  for (var i = 0; i < listWarnings.length; i++){
    var warningObj = { warning: listWarnings[i] };
    document.getElementById("show-warnings").innerHTML += template.render("warnings-template", warningObj);
  }

  // yeeting indv dates into another template 
  for (var i = 0; i < data.date.length; i++) {
    var rawDate = data.date[i];
    var parts = rawDate.split("-");
    var dateObj = { show_id: data.id[i], year: parts[0], month: months[parts[1]], day: parts[2], time: time24To12(data.doors_open[i]) };
    
    // should make showid part of id
    document.getElementById("show-dates").innerHTML += template.render("date-template", dateObj);
  }

  for (i = 0; i < data.id.length; i++) {

    document.getElementById("show-date-" + data.id[i]).addEventListener("click", function() {
      addSeatSelection(this.id.split("-").pop());
    });

  }

  // still need to actually route this properly and update URL and AAAAAAAAAAAAAAAAAAAAAH
  // nicole help
  // lol i see this now, use window.parent.history.pushState()
  var newURL = window.top.location.protocol + "//" + window.top.location.host + "/shows/" + data.production_id;
  window.top.history.pushState({id: "shows", url: "/shows/" + data.production_id}, "", newURL);
}



// for the entire seat section
function addSeatSelection(show_id){
  current_show_id = show_id;
  document.getElementById("select-section").classList.remove("non-active");
  document.getElementById("select-section").classList.add("active");

  // add listeners for dates
  // var dates = document.getElementsByClassName("show-indv-date");
  // for (var i = 0; i < dates.length; i++) {
  //   dates[i].addEventListener("click", function(){
  //     smoothScroll('select-section', 800);
  //     document.getElementById("select-section").style.opacity = 1;
  //   });
  // }

  //add listeners for each seat click
  var seatsvg = document.getElementById("seats-svg");

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var booked = xhr.response;
      if (svg_loaded) {
        updateSeatMap(booked);
      }
      else {
        seatsvg.addEventListener("load", function() {
          svg_loaded = true;
          updateSeatMap(booked);
        }, false);
      }
    }
  };

  xhr.open("GET", "/api/shows/getProductionSeatStatus/" + show_id, true);
  xhr.responseType = "json";
  xhr.send();
}

function updateSeatMap(booked) {
  var seatsvg = document.getElementById("seats-svg");
  var svgDoc = seatsvg.contentDocument;
  var gtags = svgDoc.querySelectorAll("g");
  
  for (var i = 1; i < gtags.length; i++) {
    gtags[i].firstElementChild.style.fill = "#b3b3b3";
    gtags[i].removeEventListener("click", onSeatClick, false);
    gtags[i].removeEventListener("mouseenter", onSeatHover, false);
    gtags[i].removeEventListener("mouseleave", onSeatUnhover, false);
    if (!booked.includes(gtags[i].id)) {
      gtags[i].addEventListener("click", onSeatClick, false);
      gtags[i].addEventListener("mouseenter", onSeatHover, false);
      gtags[i].addEventListener("mouseleave", onSeatUnhover, false);
    }
    else {
      gtags[i].firstElementChild.style.fill = "red";
    }
  }
  selectedSeats = [];
  document.getElementById("seat-numbers").innerHTML = "";
}

function onConfirmClick() {
  var amountElems = document.getElementsByClassName("ticket-amount");
  var amounts = {};
  var total = 0;
  for (var i = 0; i < amountElems.length; i++) {
    var id = amountElems[i].id.split("-").pop();
    amounts[id] = parseInt(amountElems[i].value);
    total += parseInt(amountElems[i].value);
  }
  if (total !== selectedSeats.length) {
    console.log("BAD TICKET AMOUNTS");
    return;
  }
  console.log(amounts);
  console.log(selectedSeats);

  // needs to actually show something after the request is done
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  formData.set("seat_numbers", JSON.stringify(selectedSeats));
  formData.set("ticket_amounts", JSON.stringify(amounts));
  xhr.open("POST", "/api/shows/buyTickets/" + current_prod_id + "/" + current_show_id, true);
  xhr.responseType = "json";
  xhr.send(formData);
}

function onSeatNumChange() {
  var amountElems = document.getElementsByClassName("ticket-amount");
  var total_tickets = 0;
  for (var i = 0; i < amountElems.length; i++) {
    total_tickets += parseInt(amountElems[i].value);
  }
  var remaining = selectedSeats.length - total_tickets;
  for (i = 0; i < amountElems.length; i++) {
    amountElems[i].max = parseInt(amountElems[i].value) + remaining;
    if (amountElems[i].max === "0") {
      amountElems[i].disabled = true;
    }
    else {
      amountElems[i].disabled = false;
    }
  }
}

function onSeatClick() {
  var curSeatID = this.id;
  var index = selectedSeats.indexOf(curSeatID);
  if (index > -1 ){
    selectedSeats.splice(index, 1);
    this.firstElementChild.style.fill = "#b3b3b3";
  }
  else {
    selectedSeats.push(curSeatID);
    this.firstElementChild.style.fill = "#5ad442";
  }
  if (selectedSeats.length > 0) {
    document.getElementById("seat-numbers").innerHTML = template.render("template-seatnumber", {seats: selectedSeats});
    document.getElementById("booking-button").addEventListener("click", onConfirmClick);
    var amountElems = document.getElementsByClassName("ticket-amount");
    for (var i = 0; i < amountElems.length; i++) {
      amountElems[i].max = selectedSeats.length;
    }
  }
  else
    document.getElementById("seat-numbers").innerHTML = "";
}

function onSeatHover() {
  var ellipse = this.firstElementChild;
  var rx = parseFloat(ellipse.getAttributeNS(null, "rx"));
  var ry = parseFloat(ellipse.getAttributeNS(null, "ry"));
  ellipse.setAttributeNS(null, "rx", rx * 1.1);
  ellipse.setAttributeNS(null, "ry", ry * 1.1);
}

function onSeatUnhover() {
  var ellipse = this.firstElementChild;
  var rx = parseFloat(ellipse.getAttributeNS(null, "rx"));
  var ry = parseFloat(ellipse.getAttributeNS(null, "ry"));
  ellipse.setAttributeNS(null, "rx", rx / 1.1);
  ellipse.setAttributeNS(null, "ry", ry / 1.1);
}

function addShowsListeners() {
  // Add back button listener
  // onclick: hide back button, display list of productions
  document.getElementById("shows-return").addEventListener("click", function() {
    showAllProductions();
    document.getElementById("select-section").classList.remove("active");
    document.getElementById("select-section").classList.add("non-active");

    document.getElementById("select-section").classList.add("non-active");
    document.getElementById("select-section").classList.remove("active");

    var newURL = window.top.location.protocol + "//" + window.top.location.host + "/shows";
    window.top.history.pushState({id: "shows", url: "/shows"}, "", newURL);
  });

  // TEMPLATING PENDING
  var amountElems = document.getElementsByClassName("ticket-amount");
  for (var i = 0; i < amountElems.length; i++) {
    amountElems[i].addEventListener("input", onSeatNumChange);
  }
}

function showAllProductions() {

  if (!loadedProductions) getProductionDetails();
  document.getElementById("show-details").innerHTML = "";

  document.getElementById("shows-return").classList.remove("active");
  document.getElementById("shows-return").classList.add("non-active");

  document.getElementById("show-details").classList.remove("active");
  document.getElementById("show-details").classList.add("non-active");

  document.getElementById("shows-main").classList.remove("non-active");
  document.getElementById("shows-main").classList.add("shows-main");
  

  // change path back to shows
  //window.parent.history.pushState("", "", "/shows");
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