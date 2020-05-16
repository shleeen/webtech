"use strict";
document.addEventListener('DOMContentLoaded', start, false);

function start() {
    getProductionDetails();
    console.log("shows.html loaded");
} 


// for each production in db, should display the details on the Shows Page 
function getProductionDetails() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status === 200) { 
            var res = JSON.parse(xhr.responseText);
            var showsDiv = ""
            var posterDiv = ""
            var infoDiv = ""
            var nameDiv = ""
            var blurbDiv = ""
            var timingsDiv = ""
            var divStart = ""
            var divEnd = ""

            divStart = '<div class="show-container">'
            divEnd = '</div></div></div>'

            // console.log("reaching here");
            // console.log(res["data"]);

            // for each production x, create and fill the container
            for(var x in res["data"]) {
                console.log("and reaching here");

                posterDiv = '<div class="show-poster"> <img src="' + res["data"][x].poster_path + '"></img></div>'; 
                infoDiv = '<div class="show-info">';
                nameDiv = '<div class="show-name">' + res["data"][x].name + '</div>';
                blurbDiv = '<div class="show-details"> <div class="show-blurb">' + res["data"][x].blurb + '</div>';
                timingsDiv = '<div class="show-timings">' + res["data"][x].date + '</div>';
                showsDiv = divStart + posterDiv + infoDiv + nameDiv + blurbDiv + timingsDiv + divEnd
                document.getElementById("shows-main").innerHTML = document.getElementById("shows-main").innerHTML + showsDiv;

                console.log("one prod done");
            }
        }
        else {
            console.log('error getting production details');
        } 
    }

    xhr.open("GET", "http://localhost:8080/shows/getProductionDetails", true);
    xhr.send();

}