"use strict";
//addEventListener('load', start);
document.addEventListener('DOMContentLoaded', start, false);

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
        if(xhr.readyState === 4) {
            if(xhr.status === 200) { 
                var res = JSON.parse(xhr.responseText);
                var bannerDivID = "";
                var appendBanner = "";

                var navDivID = "";
                var appendNavBut = "";

                for(var x in res["data"]) {
                    // var imagePath = console.log(res["data"][x].banner_path)
                    bannerDivID = 'carousel-banner-';
                    navDivID = 'nav-svg-';
                    if (x == 0){
                        bannerDivID += x;
                        navDivID += x;

                        appendBanner = '<div id="'+ bannerDivID+'" class="carousel-content"><img class="carousel-image" src="' + res["data"][x].banner_path + '"></img></div>';
                        document.getElementById("carousel").innerHTML = document.getElementById("carousel").innerHTML + appendBanner;

                        appendNavBut = '<button class="carousel-nav-button"><svg id="'+ navDivID+'" class="nav-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" height="50" width="50" preserveAspectRatio="none"><rect id="nav-svg-rect" x="20" y="20" width="15" height="10" stroke="black" fill="#371545" stroke-width="2"/></svg></button>';
                        document.getElementById("carousel-nav").innerHTML = document.getElementById("carousel-nav").innerHTML + appendNavBut;
                    } else {
                        bannerDivID += x;
                        navDivID += x;

                        appendBanner = '<div id="'+ bannerDivID+'" class="carousel-content-hide"><img class="carousel-image" src="' + res["data"][x].banner_path + '"></img></div>';
                        document.getElementById("carousel").innerHTML = document.getElementById("carousel").innerHTML + appendBanner;

                        appendNavBut = '<button class="carousel-nav-button"><svg id="'+ navDivID+'" class="nav-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" height="50" width="50" preserveAspectRatio="none"><rect id="nav-svg-rect" x="20" y="20" width="15" height="10" stroke="black" fill="#371545" stroke-width="2"/></svg></button>';
                        document.getElementById("carousel-nav").innerHTML = document.getElementById("carousel-nav").innerHTML + appendNavBut;
                        
                        numberOfBanners++;
                    }
                }
                
            } else {
                console.log('error getting banners');
            } 
        } 
        console.log('This always runs...');
        
    };
        
    xhr.open("GET", "http://localhost:8080/home/getBanners", true);
    xhr.send();

}

function carouselChange(direction){
    var elem = document.getElementsByClassName('carousel-content');
    var id = elem[0].id;
    id = id.split("-").pop();

    elem = document.getElementById('carousel-banner-' + id)

    if (direction == 'right') {
        id = parseInt(id, 10) + 1;

        if (id > numberOfBanners) id = 0;
        
        elem.classList.remove('carousel-content');
        elem.classList.add('carousel-content-hide');

        var newID = 'carousel-banner-' + id;
        console.log(newID);
        document.getElementById(newID).classList.remove('carousel-content-hide');
        document.getElementById(newID).classList.add('carousel-content');
    } else {
        id = parseInt(id, 10) - 1;
        if (id < 0) id = numberOfBanners;

        elem.classList.remove('carousel-content');
        elem.classList.add('carousel-content-hide');

        var newID = 'carousel-banner-' + id;
        console.log(newID);
        document.getElementById(newID).classList.remove('carousel-content-hide');
        document.getElementById(newID).classList.add('carousel-content');

    }
}

function addListeners(){
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
    var carouselNav = document.querySelectorAll('.carousel-nav-button');
    for (var i = 0; i < carouselNav.length; i++) {
        carouselNav[i].addEventListener('click', function (event) {
            // What happens when it clicks?
            // Get colour, change colour
            const elem = document.getElementById('nav-svg-rect');
            const colour = elem.style.getPropertyValue('fill');
            // nah we want the fading of a fill
            // elem.classList.toggle('fadeOut');
            if (colour == '#FFFFFF') {
                fadeColour(elem, color, '#371545');
            } else {
                fadeColour(elem, color, '#FFFFFF');
            }
            
            // svg animation
            // move to the one clicked
            console.log('nav thing is clicked', i);

        }, false);
    }    
}

function fadeColour(elem, from, to) {
    var r = parseInt(from.substr(0,2),16);
    var g = parseInt(from.substr(2,2),16);
    var b = parseInt(from.substr(4,2),16);

    var nr = parseInt(to.substr(0,2),16);
    var ng = parseInt(to.substr(2,2),16);
    var nb = parseInt(to.substr(4,2),16);

    elem.style.setProperty('fill', to);

}