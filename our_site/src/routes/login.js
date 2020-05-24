const express = require("express");
const loginRouter = express.Router();
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");

loginRouter.post("/", upload.none(), async (req, res) => {
  const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
  console.log(user_id);
  if (user_id) {
    console.log("authentication success");
    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(() => {
      // Store the user's primary key
      // in the session store to be retrieved,
      // or in this case the entire user object
      req.session.user_id = user_id;
      res.sendStatus(200);
    });
  } else {
    console.log("authentication failed");
    res.sendStatus(401);
  }
});

module.exports = loginRouter;
