const express = require('express');
const session = require('express-session');
const loginRouter = express.Router();
const dbHelper = require(process.cwd() + '/database/database');

loginRouter.post('/', async (req, res) => {
    const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
    if (user_id) {
        console.log("authentication success");
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function(){
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.user_id = user_id;
            res.redirect('back');
        });
    } else {
        console.log("authentication failed");
        res.redirect('back');
    }
});

module.exports = loginRouter;
