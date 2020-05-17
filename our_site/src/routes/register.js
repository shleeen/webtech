const express = require('express');
const session = require('express-session');
const registerRouter = express.Router();
const dbHelper = require(process.cwd() + '/database/database');

registerRouter.post('/', async (req, res) => {
    console.log(req.body.pwd);
    try {
        await dbHelper.addUser(req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.pwd);
    } catch (err) {
        console.log(err);
        res.redirect('back');
        return;
    }
    // This is the same as in login.js, maybe it can be moved to a service or something
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

module.exports = registerRouter;