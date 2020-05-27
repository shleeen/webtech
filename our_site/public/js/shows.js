"use strict";
document.addEventListener("DOMContentLoaded", start, false);

function start() {
  getProductionDetails();
  addShowsListeners();
  console.log("shows.html loaded");
}


// for each production in db, should display the details on the Shows Page 
function getProductionDetails() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      var prodDivID = "";

      // for each production x, create and fill the 'shows' container
      for (var x in res) {
        prodDivID = "prod-container-";
        prodDivID += res[x].production_id;

        document.getElementById("shows-main").innerHTML += template.render("display-production", { prod_id: prodDivID, poster_img: res[x].poster_path, 
          name: res[x].name, blurb: res[x].blurb, dates: res[x].date });

        console.log("one prod done");
      }

      var prods = document.getElementsByClassName("prod-container");
      for (var i = 0; i < prods.length; i++) {
        prods[i].addEventListener("click", displayShow);
      }
    }
  };

  xhr.open("GET", "/api/shows/getProductionDetails", true);
  xhr.responseType = "json";
  xhr.send();

}

function displayShow() {
  var prod_id = this.id.match(/\d+$/)[0];
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
      var res = xhr.response;
      document.getElementById("shows-main").classList.add("non-active");
      document.getElementById("shows-main").classList.remove("shows-main");
      document.getElementById("show-details").innerHTML = template.render("show-template", res);

      // still need to actually route this properly and update URL and AAAAAAAAAAAAAAAAAAAAAH
      // nicole help
    }
  };

  xhr.open("GET", "/api/shows/getProductionDetails/" + prod_id, true);
  xhr.responseType = "json";
  xhr.send();
}


function addShowsListeners() {
  var showPageTrigger = document.getElementById("show-btn"); //this is the trigger
  // var modal = document.querySelector(".modal");

  // // close the modal using the cross button
  // showPageTrigger.onclick = function() {
  //   //go to a different page
  //   console.log("clickk!!");
  // };

}