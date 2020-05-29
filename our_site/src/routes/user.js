const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user-controller");
userRouter.get("/getUserInfo", userController.getUserInfo);
userRouter.get("/getUserTransactions", userController.getUserTransactions)

module.exports = userRouter;