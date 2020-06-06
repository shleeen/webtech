const express = require("express");
const router = express.Router();

const homeRouter = require("./routes/home.js");
const showsRouter = require("./routes/shows.js");
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
const registerRouter = require("./routes/register.js");
const resetRouter = require("./routes/reset.js");
const userRouter = require("./routes/user.js");

router.use("/home", homeRouter);
router.use("/shows", showsRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/register", registerRouter);
router.use("/reset", resetRouter);
router.use("/user", userRouter);

// Fallback for unknown API route
router.use((req, res) => {
  res.status(404).send("Sorry can't find that!");
});

module.exports = router;