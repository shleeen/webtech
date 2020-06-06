const express = require("express");
const registerRouter = express.Router();
const loginService = require("../service/login-service");
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");
const email = require(process.cwd() + "/email");
const { v4: uuidv4 } = require("uuid");

registerRouter.post("/", upload.none(), async (req, res) => {
  // Add user
  let user_id;
  try {
    user_id = await dbHelper.addUser(req.body.username, "normal", req.body.first_name, req.body.last_name, req.body.email, req.body.pwd);
  } catch (err) {
    res.status(400).send(err);
    return;
  }
  // Login the new user
  const info = await loginService.login(req, res);
  if (info) {
    // Generate email verification link and email it
    const token = uuidv4();
    await dbHelper.run("REPLACE INTO email_verify(user_id, token) VALUES(?, ?)", [user_id, token]);
    const verify_url = req.protocol + "://" + req.hostname + req.originalUrl + "/" + token;
    await email.sendVerifyLink(req.body.email, verify_url);
  } else {
    console.log("authentication failed after creating user, this is bad");
    res.sendStatus(500);
  }
});

// Handler for email verification
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