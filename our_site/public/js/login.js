"use strict";
addEventListener('load', start);
function start() {
    console.log("login.html loaded");
} 


var modal = document.getElementById('modal-login');

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}