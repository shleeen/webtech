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
      var res = JSON.parse(xhr.responseText);
      var prodDivID = "";

      // for each production x, create and fill the 'shows' container
      for (var x in res.data) {
        prodDivID = "prod-container-";
        prodDivID += x;

        // <input type="image" src="logg.png" name="saveForm" class="btTxt submit" id="saveForm" />

        document.getElementById("shows-main").innerHTML += template.render("display-production", { prod_id: prodDivID, poster_img: res.data[x].poster_path, 
                                                               name: res.data[x].name, blurb: res.data[x].blurb, dates: res.data[x].date });

        console.log("one prod done");
      }
    }
    else {
      // think this is happening even when there are no errors
      //console.log("error getting production details");
    } 
  };

  xhr.open("GET", "/api/shows/getProductionDetails", true);
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