"use strict";
//addEventListener('load', start);
document.addEventListener("DOMContentLoaded", start, false);

// this includes 0 oops
var numberOfBanners = 0;

function start() {
  // Get banner images from server and populate html
  getBanners();

  addListeners();
  

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

        for (var x in res.data) {
          // var imagePath = console.log(res["data"][x].banner_path)
          bannerDivID = "carousel-banner-";
          navDivID = "nav-button-";
          if (x === "0") {
            bannerDivID += x;
            navDivID += x;

            document.getElementById("carousel").innerHTML += template.render("banner", { banner_id: bannerDivID, banner_class: "carousel-content", banner_img: res.data[x].banner_path });

            // appendBanner = "<div id=\""+ bannerDivID+"\" class=\"carousel-content\"><img class=\"carousel-image\" src=\"" + res.data[x].banner_path + "\"></img></div>";
            // document.getElementById("carousel").innerHTML = document.getElementById("carousel").innerHTML + appendBanner;

            // appendNavBut = "<div class=\"carousel-nav-button\"><svg id=\""+ navDivID+"\" class=\"nav-svg\" onclick=\"navCarouselChange(this)\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" height=\"50\" width=\"50\" preserveAspectRatio=\"none\"><rect id=\"nav-svg-rect\" class=\"nav-button-select\" x=\"20\" y=\"20\" width=\"15\" height=\"10\"/></svg></div>";
            document.getElementById("carousel-nav").innerHTML += template.render("nav-button", { nav_id: navDivID, nav_class: "nav-button-select" });
          } else {
            bannerDivID += x;
            navDivID += x;

            document.getElementById("carousel").innerHTML += template.render("banner", { banner_id: bannerDivID, banner_class: "carousel-content-hide", banner_img: res.data[x].banner_path });

            // appendBanner = "<div id=\""+ bannerDivID+"\" class=\"carousel-content-hide\"><img class=\"carousel-image\" src=\"" + res.data[x].banner_path + "\"></img></div>";
            // document.getElementById("carousel").innerHTML = document.getElementById("carousel").innerHTML + appendBanner;

            // appendNavBut = "<div class=\"carousel-nav-button\"><svg id=\""+ navDivID+"\" class=\"nav-svg\" onclick=\"navCarouselChange(this)\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" height=\"50\" width=\"50\" preserveAspectRatio=\"none\"><rect id=\"nav-svg-rect\" class=\"nav-button-none-select\" x=\"20\" y=\"20\" width=\"15\" height=\"10\"/></svg></div>";
            // document.getElementById("carousel-nav").innerHTML = document.getElementById("carousel-nav").innerHTML + appendNavBut;

            document.getElementById("carousel-nav").innerHTML += template.render("nav-button", { nav_id: navDivID, nav_class: "nav-button-none-select" });

            numberOfBanners++;
          }
        }
                
      } else {
        console.log("error getting banners");
      } 
    } 
        
  };
        
  xhr.open("GET", "/home/getBanners", true);
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

function addListeners() {
  // document.getElementById("join-link").addEventListener("click", function() {
  //   window.parent.document.getElementById("modal-login").style.display = "block";
  // });
    
  // -------------------------NAV ARROWS--------------------------------
  // For some reason this doesnt work but in-line on-click does 
  /*
    var carouselArrows = document.querySelectorAll('.carousel-arrow');
    for (var j = 0; j < carouselArrows.length; j++) {
        console.log('arrows');
        carouselArrows[j].addEventListener('click', function(event) {
            alert('f');
        });
    }
    */

  // -------------------------NAV BUTTONS--------------------------------
  /*var carouselNav = document.querySelectorAll('.carousel-nav-button');
    for (var i = 0; i < carouselNav.length; i++) {
        carouselNav[i].addEventListener('click', function (event) {
            //navCarouselChange.call(this, event);
            //alert(this.id);
            
            const elem = document.getElementById('nav-svg-rect');
            const colour = elem.style.getPropertyValue('fill');
          
            if (colour == '#FFFFFF') {
                fadeColour(elem, color, '#371545');
            } else {
                fadeColour(elem, color, '#FFFFFF');
            }
            
            console.log('nav thing is clicked', i);

        }, false);
    } 
    */
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