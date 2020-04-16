"use strict"
const express = require('express');
const router = express.Router();
// for validation
const { check, validationResult } = require('express-validator');
// db stuff
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function openDB() {
  try {
    const db = await sqlite.open({
      filename: './database/human.db',
      mode: sqlite3.OPEN_READWRITE,
      driver: sqlite3.Database
    });
    return db;
  } catch (e) { console.log(e); }
}

router.get('/', (req, res) => {
  res.render('form', { title: 'Registration form' });
});

router.post('/', 
  [ check('name')
      .isLength({ min: 2 })
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const db = await openDB();
        await db.run(`INSERT INTO human(name, email) VALUES(?, ?)`, [req.body.name, req.body.email]);
        await db.close();
      } catch (e) { console.log(e); }
      res.send('THanks for registering');
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
    console.log(req.body);
    console.log(errors);
});

module.exports = router;