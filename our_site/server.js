const express = require("express");
const path = require("path");
const routes = require("./src/api");
const helmet = require("helmet");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

// Use helmet to set sensible HTTP header settings
app.use(helmet());

// Set up session cookies
app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: new SQLiteStore({ db: "sessions.db", dir: "database" }),
  cookie: { httpOnly: true, secure: "auto" }, // secure: "auto" means that cookies are set to secure when on HTTPS
  httpOnly: true,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "shhhh, very secret",
  name: "sessionId",
}));

// Serve as XHTML
app.use(express.static(__dirname + "/public", {
  setHeaders: function(res, path) {
    // if file is a .html file, then set content-type to xhtml
    if (path.endsWith(".html")) {
      res.setHeader("Content-Type", "application/xhtml+xml");
    }
  }
}));

// Serve as HTML
// app.use(express.static(__dirname + "/public"));

// Set up API routes
app.use("/api", routes);

// For anything that's not the API, just send the index page and it will figure out what to do client-side
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

module.exports = app;