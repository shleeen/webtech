const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user-controller");
userRouter.get("/getUserInfo", userController.getUserInfo);

module.exports = userRouter;