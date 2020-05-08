const express = require('express');
const loginRouter = express.Router();
const dbHelper = require(process.cwd() + '/database/database');

loginRouter.post('/', async (req, res) => {
    console.log(await dbHelper.authenticate(req.body.email, req.body.pwd));
    res.send('Got a POST request');
});

module.exports = loginRouter;
