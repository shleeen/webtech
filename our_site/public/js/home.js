"use strict";
addEventListener('load', start);


function start() {
    // TODO: Get banner images from server
    getBanners();

    // TODO: Add images to carousel content div
        // Set ID 

    // TODO: Add listeners to carousel arrows

    //document.getElementById('carousel-svg').style.setProperty('fill','white');
    addListeners();

    // variable to keep track of the carousel slide we're on, lets start with 1
    var carouselNum = 1;

    console.log("home.html loaded");

    
} 

function getBanners() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) { 
                console.log(xhr.response);
                var res = JSON.parse(xhr.responseText);

                // This will need a for loop to dynamically create carousel images
                var banners = res["data"].banner_path;
                
                console.log(banners);
                /*
                for(i = 0; i < arr.length; i++) {
                    out += '<a href="' + arr[i].url + '">' +
                    arr[i].display + '</a><br>';
                }
                */
            } else {
                console.log('error getting banners');
            } 
        } 
        console.log('This always runs...');
        
    };
        
    xhr.open("GET", "http://localhost:8080/home/getBanners", true);
    xhr.send();

    

}

// THIS DOES NOT WORK on the id number
function addListeners(){
    // -------------------------NAV ARROWS--------------------------------
    var carouselArrows = document.querySelectorAll('.carousel-arrow');
    for (var i = 0; i < carouselArrows.length; i++) {
        carouselArrows[i].addEventListener('click', function (event) {
            // Fade out current
            // Fade in next
        }, false);
    }

    // -------------------------NAV BUTTONS--------------------------------
    var carouselNav = document.querySelectorAll('.carousel-nav-button');
    for (var i = 0; i < carouselNav.length; i++) {
        console.log('i is', i);
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