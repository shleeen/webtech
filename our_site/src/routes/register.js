const express = require("express");
const registerRouter = express.Router();
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");

registerRouter.post("/", upload.none(), async (req, res) => {
  try {
    await dbHelper.addUser(req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.pwd);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
    return;
  }
  // This is the same as in login.js, maybe it can be moved to a service or something
  const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
  if (user_id) {
    console.log("authentication success");
    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(() => {
      // Store the user's primary key
      // in the session store to be retrieved
      req.session.user_id = user_id;
      res.sendStatus(201);
    });
  } else {
    console.log("authentication failed after creating user, this is bad");
    res.sendStatus(500);
  }
});

module.exports = registerRouter;