const express = require("express");
const path = require("path");
const routes = require("./src/index");
const helmet = require("helmet");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
// const bodyParser = require('body-parser');

const app = express();
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: new SQLiteStore({ db: "sessions.db", dir: "database" }),
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "shhhh, very secret",
  name: "sessionId",
}));



//app.set('views', path.join(__dirname, 'views')); //what does this exactly do?
//app.set('view engine', 'pug');

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// });


// This needs to be here so that the url would redirect to index.html 
// which will then load home.html or shows.html 
// app.get("/home", function(req, res) {
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });

// app.get("/shows", function(req, res) {
//   console.log('showssss')
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });

// app.get("/account", function(req, res) {
//   // TODO: THIS SHOULD ONLY HAPPEN WHEN A SESSION IS THERE
//   res.send( "YOU NEED TO LOG IN MATE" );
//   //res.sendFile(path.join(__dirname + "/public/index.html"));
// });

// /^stop[a-zA-Z]*/
// /^\/shows.*$/
// app.get(/^\/?shows\/([0-9]+)$/, function(req, res) {
//   //res.send( "My route worked!" );
//   console.log('sending index')
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });


//for these to work need to send resp to frontend to load
/*
app.get('/Home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.get('/Shows', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/shows.html'));
});
*/

// Serve as XHTML
// app.use(express.static("public", { //serve static files from this folder
//   setHeaders: function(res, path) {
//     // if file is a .xml file, then set content-type
//     if (path.endsWith(".html")) {
//       res.setHeader("Content-Type", "application/xhtml+xml");
//     }
//   }
// })); //serve static files from this folder

// Serve as HTML
//app.use(express.static("public")); //serve static files from this folder
app.use(express.static(__dirname + '/public'));

app.use("/api", routes);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

/*app.get('/', (req, res) => {
    res.render('index', {
        title: 'Homepage'
    });
});*/

module.exports = app;