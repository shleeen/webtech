const express = require('express');
const showsRouter = express.Router();

const showsController = require("../controllers/shows-controller");
showsRouter.get('/getProductionDetails', showsController.getProd);

module.exports = showsRouter;


