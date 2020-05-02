"use strict";
addEventListener('load', start);
function start() {
    console.log("shows.html loaded");

    for (i=0; i<420; i++ ){
        tstroke_2.style.setProperty('--stroke-dashoffset', i)
    }
    
} 