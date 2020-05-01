"use strict"
const express = require('express');
const router = express.Router();
const dbHelper = require('../database/database');
// for validation
const { check, validationResult } = require('express-validator');
// db stuff
// const sqlite3 = require('sqlite3');
// let db = new sqlite3.Database('./database/human.db', sqlite3.OPEN_READWRITE);  // connect to db

router.get('/', (req, res) => {
  res.render('index', {title: 'Homepage'});
});

router.post('/login', async (req, res) => {
  console.log(await dbHelper.authenticate(req.body.email, req.body.pwd, "salt"));
  res.send('Got a POST request');
});

router.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// router.post('/', 
//   [ check('name')
//       .isLength({ min: 2 })
//       .withMessage('Please enter a name'),
//     check('email')
//       .isLength({ min: 1 })
//       .withMessage('Please enter an email'),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       // insert into db
//       db.run(`INSERT INTO human(name, email) VALUES(?)`, [req.body.name, req.body.email], function(err) {
//         if (err) {
//           return console.log(err.message);
//         }
//         res.send('THanks for registering');
//         console.log(`A row has been inserted with rowid ${this.lastID}`); // get the last insert id
//       });

//       // db.close((err) => {
//       //   if (err) {
//       //     return console.error(err.message);
//       //   }
//       //   console.log('Close the database connection.');
//       // });
//     // console.log("errors, is registered");

//     } else {
//       res.render('form', {
//         title: 'Registration form',
//         errors: errors.array(),
//         data: req.body,
//       });
//     }
//     console.log(req.body);
//     console.log(errors);
// });

// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

// router.METHOD(route, (req, res) => {
//   // callback function
//      req is an object full of information that’s coming in (such as form data or query parameters)
//      res is an object full of methods for sending data back to the user
//        an optional next parameter, which is useful if you don’t actually want to send any data back, 
//         or if you want to pass the request off for something else to handle.
// });

module.exports = router;