"use strict";
addEventListener('load', start);
function start() {
    console.log("home.html loaded");

    //document.getElementById('carousel-svg').style.setProperty('fill','white');
    addListeners();
    
} 

// THIS DOES NOT WORK on the id number
function addListeners(){
    var carouselNav = document.querySelectorAll('.carousel-nav-button');
    for (var i = 0; i < carouselNav.length; i++) {
        carouselNav[i].addEventListener('click', function (event) {
            // What happens when it clicks?
            // Change colour
                // if it swhite fade to purple, if its purple fade to whte
            const elem = document.getElementById('nav-svg-rect');
            const colour = elem.style.getPropertyValue('fill');
            if (colour == 'white') {
                elem.style.setProperty('fill', '#371545');
            } else {
                elem.style.setProperty('fill', 'white');
            }
            
            // svg animation
            // move to the one clicked
            console.log('nav thing is clicked', i);

        }, false);
}
 
}