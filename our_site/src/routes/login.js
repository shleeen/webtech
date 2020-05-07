const express = require('express');
const loginRouter = express.Router();
const dbHelper = require('../../database/database'); // surely theres a better way than '../..'

loginRouter.post('/login', async (req, res) => {
    console.log(await dbHelper.authenticate(req.body.email, req.body.pwd, "salt"));
    res.send('Got a POST request');
});

module.exports = loginRouter;
