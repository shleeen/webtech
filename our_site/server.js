"use strict"
const express = require('express');
const path = require('path');
// const routes = require('./routes/index');
// const bodyParser = require('body-parser');

const app = express();

//app.set('views', path.join(__dirname, 'views')); //what does this exactly do?
//app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/navbar.html'));
});

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/', routes);

app.use(express.static('public')); //serve static files from this folder

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Homepage'
    });
});

module.exports = app;