const express = require("express");
const path = require("path");
const routes = require("./src/index");
const helmet = require("helmet");
const session = require("express-session");
// const bodyParser = require('body-parser');

const app = express();
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "shhhh, very secret"
}));

//app.set('views', path.join(__dirname, 'views')); //what does this exactly do?
//app.set('view engine', 'pug');

/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});*/


// This needs to be here so that the url would redirect to index.html 
// which will then load home.html or shows.html 
app.get("/home", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/shows", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//for these to work need to send resp to frontend to load
/*
app.get('/Home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.get('/Shows', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/shows.html'));
});
*/

app.use(express.static("public")); //serve static files from this folder

app.use("/", routes);

/*app.get('/', (req, res) => {
    res.render('index', {
        title: 'Homepage'
    });
});*/

module.exports = app;