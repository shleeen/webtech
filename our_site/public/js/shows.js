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

  // @nicole I tried fixing this but it doesn't seem to do anything
  // var showObj = window.top.document.getElementById("shows-object");
  // var indexHeight = window.top.innerHeight;
  //   showObj.onresize = function(){
  //   //showObj.style.height = showObj.contentWindow.document.body.scrollHeight + 'px';
  //   var height = showObj.contentDocument.body.scrollHeight;

  //   if (height > indexHeight) showObj.style.height = height + "px";
  //   else showObj.style.height = indexHeight + "px";
  // };

  console.log("shows.html loaded");
}

// Globals to store show data so we don't do unnecessary requests
var loadedProductions = false;
var productionData = {};
var svg_loaded = false;
var selectedSeats = [];
var current_prod_id, current_show_id;

//**************************************************************************** */
//                          PRODUCTION PAGE
//**************************************************************************** */
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

//**************************************************************************** */
//                         SHOW PAGE
//**************************************************************************** */
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
      addSeatSelection(this.id.split("-").pop(), data);
    });
  }

  var newURL = window.top.location.protocol + "//" + window.top.location.host + "/shows/" + data.production_id;
  window.top.history.pushState({id: "shows", url: "/shows/" + data.production_id}, "", newURL);
}

function moneyToString(amount) {
  var pounds = Math.floor(amount / 100);
  var pence = (amount % 100).toString();
  if (pence.length === 1) pence = "0" + pence;
  return "£" + pounds + "." + pence;
}

// for the entire seat section
function addSeatSelection(show_id, data){
  current_show_id = show_id;
  document.getElementById("seat-box1").classList.remove("non-active");
  document.getElementById("seat-box2").classList.remove("non-active");
  document.getElementById("seat-box1").classList.add("active");
  document.getElementById("seat-box2").classList.add("active");

  // add listeners for dates
  // var dates = document.getElementsByClassName("show-indv-date");
  // for (var i = 0; i < dates.length; i++) {
  //   dates[i].addEventListener("click", function(){
  //     smoothScroll('select-section', 800);
  //     document.getElementById("select-section").style.opacity = 1;
  //   });
  // }

  // show ticket categories in a template
  var prices = {};
  document.getElementById("ticket-types").innerHTML = "";
  for (var i = 0; i < data.ticket_category.length; i++) {
    var price = moneyToString(data.ticket_price[i]);
    prices[data.ticket_id[i]] = data.ticket_price[i];
    var ticketDetails = {t_id: data.ticket_id[i], t_category: data.ticket_category[i], t_price: price};
    document.getElementById("ticket-types").innerHTML += template.render("template-ticket-types", ticketDetails);
  }
  // add listeners for the button arrows
  ticketArrowListeners(prices);

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
      gtags[i].style.cursor = "pointer";
    }
    else {
      gtags[i].firstElementChild.style.fill = "red";
    }
  }
  selectedSeats = [];
  document.getElementById("seat-numbers").innerHTML = "";
}

function getAmountOfTickets() {
  var amountElems = document.getElementsByClassName("ticket-amount");
  var total = 0;
  for (var i = 0; i < amountElems.length; i++) {
    total += parseInt(amountElems[i].value);
  }
  return total;
}

function updateConfirmButton() {
  var button = document.getElementById("booking-button");
  if (button) {
    if (getAmountOfTickets() === selectedSeats.length && selectedSeats.length > 0) {
      button.classList.remove("booking-button-inactive");
      button.classList.add("booking-button-active");
    } else {
      button.classList.add("booking-button-inactive");
      button.classList.remove("booking-button-active");
    }
  }
}

function onConfirmClick() {
  if (this.classList.contains("booking-button-inactive")) {
    return;
  }
  var amountElems = document.getElementsByClassName("ticket-amount");
  var amounts = {};
  for (var i = 0; i < amountElems.length; i++) {
    var id = amountElems[i].id.split("-").pop();
    amounts[id] = parseInt(amountElems[i].value);
  }

  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  formData.set("seat_numbers", JSON.stringify(selectedSeats));
  formData.set("ticket_amounts", JSON.stringify(amounts));
  xhr.open("POST", "/api/shows/buyTickets/" + current_prod_id + "/" + current_show_id, true);
  xhr.responseType = "text";

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
      document.getElementById("seat-box1").classList.remove("active");
      document.getElementById("seat-box2").classList.remove("active");
      document.getElementById("seat-box1").classList.add("non-active");
      document.getElementById("seat-box2").classList.add("non-active");
      alert("Booking successful! Your reference is " + xhr.response + ", visit your account page for details.");
    }
  };

  xhr.send(formData);
}

function onSeatClick() {
  var curSeatID = this.id;
  var index = selectedSeats.indexOf(curSeatID);
  if (index > -1 ) {
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
  updateConfirmButton();
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
    // i hate that this is repeated so much
    document.getElementById("seat-box1").classList.remove("active");
    document.getElementById("seat-box2").classList.remove("active");
    document.getElementById("seat-box1").classList.add("non-active");
    document.getElementById("seat-box2").classList.add("non-active");

    var newURL = window.top.location.protocol + "//" + window.top.location.host + "/shows";
    window.top.history.pushState({id: "shows", url: "/shows"}, "", newURL);
  });
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


// function for filtering the show names for search bar
function filterProd() {
  var input = document.getElementById("prod-filter");
  var filter = input.value.toUpperCase();
  var prodNames = document.getElementsByClassName("prod-name");

  for (var i = 0; i < prodNames.length; i++) {
    var name = prodNames[i].innerHTML.toUpperCase(); //get name of the show
    var prodContainer = prodNames[i].parentElement.parentElement; //get the parent container to hide
    if (name.indexOf(filter) > -1) {
      prodContainer.style.display = "";
    } else {
      prodContainer.style.display = "none";
    }
  }
}

function ticketArrowListeners(prices){
  var inputs = document.getElementsByClassName("ticket-amount");
  var up_btns = document.getElementsByClassName("ticket-up");
  var down_btns = document.getElementsByClassName("ticket-down");

  for(var i = 0; i < inputs.length; i++) {

    // listener for UP BUTTON
    up_btns[i].addEventListener("click", function() {
      console.log("clicked up");
      var t_id = this.id.split("-").pop();
      var inputElem = document.getElementById("ticket-type-" + t_id);
      var max = parseInt(inputElem.max);
      var oldval = parseInt(inputElem.value);
      if (oldval >= max) {
        var newval = oldval;
      } else {
        var newval = oldval + 1;
      }
      inputElem.value = newval;
      var amountElem = document.getElementById("ticket-sum-" + t_id);
      amountElem.textContent = moneyToString(newval * prices[t_id]);
      updateConfirmButton();
    });

    // listener for DOWN BUTTON
    down_btns[i].addEventListener("click", function() {
      console.log("clicked down");
      var t_id = this.id.split("-").pop();
      var inputElem = document.getElementById("ticket-type-" + t_id);
      var min = parseInt(inputElem.min);
      var oldval = parseInt(inputElem.value);
      if (oldval <= min) {
        var newval = oldval;
      } else {
        var newval = oldval - 1;
      }
      inputElem.value = newval;
      var amountElem = document.getElementById("ticket-sum-" + t_id);
      if (newval > 0) {
        amountElem.textContent = moneyToString(newval * prices[t_id]);
      }
      else {
        amountElem.textContent = "None";
      }
      updateConfirmButton();
    });
  }
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