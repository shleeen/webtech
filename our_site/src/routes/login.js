const express = require("express");
const loginRouter = express.Router();
const loginService = require("../service/login-service");
const multer = require("multer");
const upload = multer();

loginRouter.post("/", upload.none(), async (req, res) => {
  const info = await loginService.login(req, res);
  if (!info) {
    res.sendStatus(401);
  }
});

module.exports = loginRouter;
