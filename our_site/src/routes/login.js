const express = require("express");
const loginRouter = express.Router();
const userInfo = require("../service/user-info-service");
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");

loginRouter.post("/", upload.none(), async (req, res) => {
  const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
  console.log(user_id);
  if (user_id) {
    console.log("authentication success");
    const info = await userInfo.getUserInfo(user_id);
    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(() => {
      // Store the user's primary key
      // in the session store to be retrieved,
      // or in this case the entire user object
      req.session.user_id = user_id;
      res.status(200).json(info);
    });
  } else {
    console.log("authentication failed");
    res.sendStatus(401);
  }
});

module.exports = loginRouter;
