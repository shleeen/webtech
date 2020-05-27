const express = require("express");
const logoutRouter = express.Router();

logoutRouter.post("/", async (req, res) => {
  req.session.destroy(function() {
    res.sendStatus(204);
  });
});

module.exports = logoutRouter;
