const express = require("express");
const showsRouter = express.Router();

const showsController = require("../controllers/shows-controller");
showsRouter.get("/getProductionDetails", showsController.getProd);
showsRouter.get("/getProductionDetails/:prodId", showsController.getProd);

showsRouter.get("/getProductionSeatStatus/:prodId", showsController.getSeats)

// just a guess on what we need
showsRouter.post("/buyTickets/:showId/:seatNum/:ticketType", showsController.getSeats)
module.exports = showsRouter;


