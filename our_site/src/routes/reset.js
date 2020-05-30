const express = require("express");
const resetRouter = express.Router();
const multer = require("multer");
const upload = multer();
const dbHelper = require(process.cwd() + "/database/database");
const email = require(process.cwd() + "/email");
const { v4: uuidv4 } = require("uuid");

resetRouter.post("/", upload.none(), async (req, res) => {
  // Send OK status even if the email doesn't exist to prevent leaking user information
  res.sendStatus(204);
  
  const user = await dbHelper.get("SELECT id FROM user WHERE email = ?", [req.body.email]);
  if (user) {
    const token = uuidv4();
    const time = Math.floor(Date.now() / 1000);
    await dbHelper.run("REPLACE INTO password_reset(user_id, token, time) VALUES(?, ?, ?)", [user.id, token, time]);
    const reset_url = req.protocol + "://" + req.hostname + req.originalUrl + "/" + token;
    await email.sendForgotPassword(req.body.email, reset_url);
  }
});

module.exports = resetRouter;