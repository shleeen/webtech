const express = require("express");
const registerRouter = express.Router();
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");
const email = require(process.cwd() + "/email");
const { v4: uuidv4 } = require("uuid");

registerRouter.post("/", upload.none(), async (req, res) => {
  try {
    await dbHelper.addUser(req.body.username, "normal", req.body.first_name, req.body.last_name, req.body.email, req.body.pwd);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
    return;
  }
  // This is the same as in login.js, maybe it can be moved to a service or something
  const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
  if (user_id) {
    console.log("authentication success");
    const token = uuidv4();
    await dbHelper.run("REPLACE INTO email_verify(user_id, token) VALUES(?, ?)", [user_id, token]);
    const verify_url = req.protocol + "://" + req.hostname + req.originalUrl + "/" + token;
    await email.sendVerifyLink(req.body.email, verify_url);
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

registerRouter.get("/:token", async (req, res) => {
  try {
    const result = await dbHelper.get("SELECT user_id FROM email_verify WHERE token = ?", req.params.token);
    if (result) {
      await dbHelper.run("UPDATE user SET activated = 1 WHERE id = ?", result.user_id);
      await dbHelper.run("DELETE FROM email_verify WHERE user_id = ?", result.user_id);
      console.log("Email verified");
      res.status(200).send("Account activated!");
    }
    else {
      res.status(404).send("Invalid link");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = registerRouter;