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
  console.log("shows.html loaded");
}

// Globals to store show data so we don't do unnecessary requests
var loadedProductions = false;
var productionData = {};

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
      
      // TODO: add listeners to all the things we want to be clickable or keep it the whole thing
      // sorry i decicded to try on jsut the poster but that one line should help
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
  
  // this currently breaks when clicked on the second time
  // is there a way to "clear template"
  document.getElementById("show-details").innerHTML = template.render("show-template", data);

  // testing to see if indv dates can be yeeted into another template 
  for (var i = 0; i < data.date.length; i++) {
    var rawDate = data.date[i];
    var parts = rawDate.split("-");
    var dateObj = { full_date: rawDate, year: parts[0], month: months[parts[1]], day: parts[2], time: time24To12(data.doors_open[i]) };
    document.getElementById("show-dates").innerHTML += template.render("date-template", dateObj);

  }

  addSeatSelection();

  // still need to actually route this properly and update URL and AAAAAAAAAAAAAAAAAAAAAH
  // nicole help
  // lol i see this now, use window.parent.history.pushState()
  var newURL = window.top.location.protocol + "//" + window.top.location.host + "/shows/" + data.production_id;
  window.top.history.pushState({id: "shows", url: "/shows/" + data.production_id}, "", newURL);
}


function addSeatSelection(){
  document.getElementById("select-section").classList.remove("non-active");
  document.getElementById("select-section").classList.add("active");

  // add listeners for dates
  var dates = document.getElementsByClassName("show-indv-date");
  for (var i = 0; i < dates.length; i++) {
    dates[i].addEventListener("click", function(){
      document.getElementById("select-section").style.opacity = 1;
    })
  }
  
}


function addShowsListeners() {
  // Add back button listener
    // onclick: hide back button, display list of productions
  document.getElementById("shows-return").addEventListener("click", function() {
    showAllProductions();
    document.getElementById("select-section").classList.remove("active");
    document.getElementById("select-section").classList.add("non-active");

    document.getElementById("select-section").style.opacity = 0;

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