"use strict";
addEventListener('load', start);
function start() {
    addListeners();
    document.getElementById("shows").click();
} 

// he says do not use
/*window.onload = function() {
    console.log("getting index(homepage) data stuff");

    loadNavbar();
    console.log("load done");
    
};*/


function addListeners(){
    document.getElementById("shows").addEventListener("click", function(){
        console.log('click');
        var element = document.getElementById("content");
        console.log(element);
        element.innerHTML ='<object type="text/html" data="shows.html" ></object>';
    });

    document.getElementById("home").addEventListener("click", function(){
        console.log('click');
        var element = document.getElementById("content");
        console.log(element);
        element.innerHTML ='<object type="text/html" data="home.html" ></object>';
    });
}
   

