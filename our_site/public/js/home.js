"use strict";
document.addEventListener("DOMContentLoaded", start, false);

// this includes 0 oops
var numberOfBanners = 0;

function start() {
  // Get banner images from server and populate html
  getBanners();
  console.log("home.html loaded");
}

function getBanners() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) { 
        var res = JSON.parse(xhr.responseText);
        var bannerDivID = "";
        var navDivID = "";

        var prod_ids = {};

        for (var x in res.data) {
          bannerDivID = "carousel-banner-";
          navDivID = "nav-button-";
          if (x === "0") {
            bannerDivID += x;
            navDivID += x;

            document.getElementById("carousel").innerHTML += template.render("banner", { banner_id: bannerDivID, banner_class: "carousel-content", banner_img: res.data[x].banner_path });
            document.getElementById("carousel-nav").innerHTML += template.render("nav-button", { nav_id: navDivID, nav_class: "nav-button-select" });
          } else {
            bannerDivID += x;
            navDivID += x;

            document.getElementById("carousel").innerHTML += template.render("banner", { banner_id: bannerDivID, banner_class: "carousel-content-hide", banner_img: res.data[x].banner_path });
            document.getElementById("carousel-nav").innerHTML += template.render("nav-button", { nav_id: navDivID, nav_class: "nav-button-none-select" });

            numberOfBanners++;
          }
          prod_ids[x] = res.data[x].id;
        }

        var banners = document.getElementsByClassName("banner");
        for (var b = 0; b < banners.length; b++) {
          banners[b].addEventListener("click", function() {
            var url = "/shows/" + prod_ids[this.id.split("-").pop()];
            window.parent.displayPage("shows", url);
          });
        }
                
      } else {
        console.log("error getting banners");
      } 
    } 
        
  };
        
  xhr.open("GET", "/api/home/getBanners", true);
  xhr.send();

}

// This is triggered by arrows 
function carouselChange(direction) {
  var elem = document.getElementsByClassName("carousel-content");
  var id = elem[0].id;
  id = id.split("-").pop();

  elem = document.getElementById("carousel-banner-" + id);

  if (direction === "right") {
    id = parseInt(id, 10) + 1;

    if (id > numberOfBanners) id = 0;
        
    elem.classList.remove("carousel-content");
    elem.classList.add("carousel-content-hide");
    var newID = "carousel-banner-" + id;
    document.getElementById(newID).classList.remove("carousel-content-hide");
    document.getElementById(newID).classList.add("carousel-content");

    // need to update nav buttons
    // deselect current
    var currentElem = document.getElementsByClassName("nav-button-select")[0];
    currentElem.classList.remove("nav-button-select");
    currentElem.classList.add("nav-button-none-select");

    // select selected 
    var navDivID = "nav-button-" + id;
    var nextElem = document.getElementById(navDivID).childNodes;
    nextElem[1].classList.remove("nav-button-none-select");
    nextElem[1].classList.add("nav-button-select");

  } else {
    id = parseInt(id, 10) - 1;
    if (id < 0) id = numberOfBanners;

    elem.classList.remove("carousel-content");
    elem.classList.add("carousel-content-hide");

    var newID = "carousel-banner-" + id;
    document.getElementById(newID).classList.remove("carousel-content-hide");
    document.getElementById(newID).classList.add("carousel-content");

    // need to update nav buttons
    // deselect current
    var currentElem = document.getElementsByClassName("nav-button-select")[0];
    currentElem.classList.remove("nav-button-select");
    currentElem.classList.add("nav-button-none-select");

    // select selected 
    var navDivID = "nav-button-" + id;
    var nextElem = document.getElementById(navDivID).childNodes;
    nextElem[1].classList.remove("nav-button-none-select");
    nextElem[1].classList.add("nav-button-select");

  }
}

// This is triggered by the nav buttons
function navCarouselChange(elem) {
  var nextID = elem.id;
  var nextIDNum = nextID.split("-").pop();

  // deselect current nav
  var currentElem = document.getElementsByClassName("nav-button-select")[0];
  currentElem.classList.remove("nav-button-select");
  currentElem.classList.add("nav-button-none-select");

  // select selected 
  elem.childNodes[1].classList.remove("nav-button-none-select");
  elem.childNodes[1].classList.add("nav-button-select");

  // need to hget current banner id 
  var carouselElem = document.getElementsByClassName("carousel-content");
  var currentIDNum = carouselElem[0].id;
  currentIDNum = currentIDNum.split("-").pop();

  // hide current banner
  carouselElem = document.getElementById("carousel-banner-" + currentIDNum);
  carouselElem.classList.remove("carousel-content");
  carouselElem.classList.add("carousel-content-hide");

  // show selected banner
  var nextBannerID = "carousel-banner-" + nextIDNum;
  document.getElementById(nextBannerID).classList.remove("carousel-content-hide");
  document.getElementById(nextBannerID).classList.add("carousel-content");  
}

function fadeColour(elem, from, to) {
  var r = parseInt(from.substr(0,2),16);
  var g = parseInt(from.substr(2,2),16);
  var b = parseInt(from.substr(4,2),16);

  var nr = parseInt(to.substr(0,2),16);
  var ng = parseInt(to.substr(2,2),16);
  var nb = parseInt(to.substr(4,2),16);

  elem.style.setProperty("fill", to);
}