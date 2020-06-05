// This has everything for the login/ register modal

"use strict";
addEventListener("load", start);
function start() {
  addLoginListeners(); // uh I dunno if this should be here of 
  checkLogin();
  console.log("login.html loaded");
}

function checkLogin() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      if (xhr.response.valid)
        showAccountMenu(xhr.response.data.first_name);
    }
  };

  xhr.open("GET", "/api/user/getUserInfo", true);
  xhr.responseType = "json";

  xhr.send();
}

function showAccountMenu(firstName) {
  document.getElementById("login").classList.add("non-active");
  document.getElementById("login-user").textContent = "WELCOME, " + firstName;
  document.getElementById("login-user").classList.remove("non-active");
  document.getElementById("login-user").classList.add("active");
  closeModal();
}

function closeModal() {
  //document.querySelector(".modal").style.display = "none";
  document.querySelector(".modal-content").classList.remove("animate-in");
  void document.querySelector(".modal-content").offsetWidth;
  document.querySelector(".modal-content").classList.add("animate-out");
  // Set back to default state for next time it is opened
  document.getElementById("login-content").classList.remove("non-active");
  document.getElementById("register-content").classList.add("non-active");
  document.getElementById("forgot-content").classList.add("non-active");
  document.getElementById("login-failed").classList.add("non-active");
  document.getElementById("reset-sent").classList.add("non-active");
}

function addLoginListeners() {
  var loginTrigger = document.getElementById("login"); //this is the trigger
  var modal = document.querySelector(".modal");
  var closeBtn = document.querySelector(".close-btn");

  var toRegister = document.getElementById("modal-to-register");
  var regToLogin = document.getElementById("modal-reg-to-login");
  var forgotToLogin = document.getElementById("modal-forgot-to-login");
  var toForget = document.getElementById("modal-to-forget");

  var loginForm = document.getElementById("login-content");
  var registerForm = document.getElementById("register-content");
  var forgotForm = document.getElementById("forgot-content");

  document.querySelector(".modal-content").addEventListener("animationend", function(event) {
    if (event.target.classList.contains("animate-out")) {
      this.classList.remove("animate-out");
      void this.offsetWidth;
      this.classList.add("animate-in");
      document.querySelector(".modal").style.display = "none";
    }
  });

  // displays the modal when 'login/register' is clicked
  loginTrigger.onclick = function() {
    modal.style.display = "block";
    draw("login");
  };

  // close the modal using the cross button
  closeBtn.onclick = closeModal;

  // close the modal by clicking outside
  window.onclick = function(event) {
    if (event.target === modal){
      closeModal();
    }
  };

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  toRegister.onclick = function() {
    document.getElementById("register-content").classList.remove("non-active");
    document.getElementById("login-content").classList.add("non-active");
    document.getElementById("login-failed").classList.add("non-active");
    draw("register");
  };

  toForget.onclick = function() {
    document.getElementById("forgot-content").classList.remove("non-active");
    document.getElementById("login-content").classList.add("non-active");
    document.getElementById("login-failed").classList.add("non-active");
    draw("reset");
  };

  regToLogin.onclick = function(){
    // seems like the remove has to come first?
    document.getElementById("login-content").classList.remove("non-active");
    document.getElementById("register-content").classList.add("non-active");
    document.getElementById("register-failed").classList.add("non-active");
    draw("login");
  };

  forgotToLogin.onclick = function(){
    // seems like the remove has to come first?
    document.getElementById("login-content").classList.remove("non-active");
    document.getElementById("forgot-content").classList.add("non-active");
    document.getElementById("reset-sent").classList.add("non-active");
    //drawLogin();
    draw("login");
  };


  document.getElementById("logout").addEventListener("click", function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 204) {
          document.getElementById("login-user").classList.add("non-active");
          document.getElementById("login-user").classList.remove("active");
          document.getElementById("login").classList.remove("non-active");
          document.getElementById("login").classList.add("active");

          // need to redirect to home page
          window.parent.displayPage("home", "");
        }
      }
    };
    request.open("POST", "/api/logout");
    request.send();
  }, false);

  // I'm super confused what this is about, can't get the logout button to stop disappearing
  // yea should sort out that css it aint the best
  document.getElementById("logout").onmouseout = function()   {
    document.getElementById("my-account").classList.add("non-active");
    document.getElementById("logout").classList.add("non-active");
  };

  // What happens when person tries to login?
  // This would be neater in separate functions
  loginForm.addEventListener("submit", function(event) {
  
    // This sends the form without reloading the page
    event.preventDefault();
    var formData = new FormData(event.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          // load account page coz logged in 
          // this needs to add classes non-active

          // i've commented this for now and put it back in the html, it was making life difficult
          // document.getElementById("account").innerHTML = "<object id=\"account-object\" class=\"none-active\" type=\"text/html\" data=\"../account.html\" width=\"100%\"></object>";

          // If success show user logged in stuff
          showAccountMenu(this.response.first_name);

          
        }
        else if (request.status === 401) {
          document.getElementById("login-failed").classList.remove("non-active");
        }
      }
    };
    request.responseType = "json";
    request.open("POST", event.target.action);
    request.send(formData);
  }, false);

  registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 201) {
          // what needs to be done here hm
          document.getElementById("account").innerHTML = "<object id=\"account-object\" class=\"none-active\" type=\"text/html\" data=\"../account.html\" width=\"100%\"></object>";
          showAccountMenu(formData.firstName);

          // clear form data

        }
        else if (request.status === 400) {
          document.getElementById("register-failed").textContent = request.responseText;
          document.getElementById("register-failed").classList.remove("non-active");
        }
      }
    };
    request.open("POST", event.target.action);
    request.send(formData);
  });

  forgotForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 204) {
          document.getElementById("reset-sent").classList.remove("non-active");
        }
        else if (request.status === 400) {
          console.log("BAD");
        }
      }
    };
    request.open("POST", event.target.action);
    request.send(formData);
  });
}

// ---- Functions --------------------------------------------------------------------------------------------------

function draw(targetID){
  var target = targetID + "-svg";
  var orig = document.getElementById(target);
  var svgDoc;
  orig.addEventListener("load",function() {
    svgDoc = orig.contentDocument;
    var paths = svgDoc.getElementsByTagName("path"); 
    var i;
    for (i=0; i< paths.length; i++){
      startDrawingPath(paths[i]);
    }
  }, false);
}


function startDrawingPath(path){
  path.style.stroke = "#371545";
  path.style.strokeWidth = 0.7;
  path.style.strokeDasharray = path.getTotalLength() + 20;
  path.style.strokeDashoffset = path.getTotalLength();
  
  animate(path, path.getTotalLength());
}

function animate(path, len) {
  path.style.strokeDashoffset = len - 2;
  if (path.style.strokeDashoffset < 0) path.style.strokeDashoffset = 0;

  if (path.style.strokeDashoffset > 0) {
    // Do another step
    setTimeout(function() { animate(path, path.style.strokeDashoffset); }, 100);
  }
}
