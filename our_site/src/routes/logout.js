const express = require("express");
const logoutRouter = express.Router();

// Logout handler, just deletes session
logoutRouter.post("/", async (req, res) => {
  req.session.destroy(function() {
    res.clearCookie("sessionId");
    res.sendStatus(204);
  });
});

module.exports = logoutRouter;
