const express = require("express");
const resetRouter = express.Router();
const dbHelper = require(process.cwd() + "/database/database");
const email = require(process.cwd() + "/email");
const { v4: uuidv4 } = require("uuid");

resetRouter.post("/", async (req, res) => {
  // this needs error checking and probably moving into database.js or a service
  const user = await dbHelper.get("SELECT id FROM user WHERE email = ?", [req.body.email]);
  const token = uuidv4();
  const time = Math.floor(Date.now() / 1000);
  await dbHelper.run("REPLACE INTO password_reset(user_id, token, time) VALUES(?, ?, ?)", [user.id, token, time]);
  const reset_url = req.protocol + "://" + req.hostname + req.originalUrl + "/" + token;
  await email.sendForgotPassword(req.body.email, reset_url);
  res.redirect("back");
});

module.exports = resetRouter;