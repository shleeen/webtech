"use strict"
const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const helmet = require('helmet')
// const bodyParser = require('body-parser');

const app = express();
app.use(helmet());

app.use(express.urlencoded({ extended: false }))

//app.set('views', path.join(__dirname, 'views')); //what does this exactly do?
//app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/shows', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
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

app.use(express.static('public')); //serve static files from this folder
app.use('/', routes);

/*app.get('/', (req, res) => {
    res.render('index', {
        title: 'Homepage'
    });
});*/

module.exports = app;