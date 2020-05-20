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
    if (xhr.readyState === 4 && xhr.status === 200) { 
      var res = JSON.parse(xhr.responseText);
      var showsDiv = "";
      var posterDiv = "";
      var infoDiv = "";
      var nameDiv = "";
      var blurbDiv = "";
      var timingsDiv = "";
      var divStart = "";
      var divEnd = "";

      divStart = "<div class=\"show-container\">";
      divEnd = "</div></div></div>";

      // console.log("reaching here");
      // console.log(res["data"]);

      // for each production x, create and fill the container
      for (var x in res.data) {

        // <input type="image" src="logg.png" name="saveForm" class="btTxt submit" id="saveForm" />

        posterDiv = "<div class=\"show-poster\"> <input type=\"image\" src=\"" + res.data[x].poster_path + "\"id=\"show-btn\"/></div>"; 
        infoDiv = "<div class=\"show-info\">";
        nameDiv = "<div class=\"show-name\">" + res.data[x].name + "</div>";
        blurbDiv = "<div class=\"show-details\"> <div class=\"show-blurb\">" + res.data[x].blurb + "</div>";
        timingsDiv = "<div class=\"show-timings\">" + res.data[x].date + "</div>";
        showsDiv = divStart + posterDiv + infoDiv + nameDiv + blurbDiv + timingsDiv + divEnd;
        document.getElementById("shows-main").innerHTML = document.getElementById("shows-main").innerHTML + showsDiv;

        console.log("one prod done");
      }
    }
    else {
      console.log("error getting production details");
    } 
  };

  xhr.open("GET", "/shows/getProductionDetails", true);
  xhr.send();

}


function addShowsListeners() {
  var showPageTrigger = document.getElementById("show-btn"); //this is the trigger
  // var modal = document.querySelector(".modal");

  // close the modal using the cross button
  showPageTrigger.onclick = function() {
    //go to a different page
    console.log("clickk!!");
  };

}