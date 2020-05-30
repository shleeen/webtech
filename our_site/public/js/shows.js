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
        posters[i].addEventListener("click", function(){

          // THIS IS THE LINE <3
          // need to add in history state
          window.parent.history.pushState("", "", "/shows/production");
 
        });
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
    var adate = data.date[i];
    document.getElementById("show-dates").innerHTML += template.render("date-template", {adate: adate, id: i});
  }

  // still need to actually route this properly and update URL and AAAAAAAAAAAAAAAAAAAAAH
  // nicole help
  // lol i see this now, use window.parent.history.pushState()
  window.parent.history.pushState("", "", "/shows/" + data.production_id);
}

function addShowsListeners() {
  // TODO: Add back button listener
    // onclick: hide back button, display list of productions
  document.getElementById("shows-return").addEventListener("click", function () {
    showAllProductions();
    window.parent.history.pushState("", "", "/shows");
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
