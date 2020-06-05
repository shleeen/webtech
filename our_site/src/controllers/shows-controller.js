const showsService = require("../service/shows-service");

exports.getProd = async function(req, res) {
  try {
    const showData = await showsService.getProduction(req.params.prodId);
    const ticketTypes = await showsService.getTicketTypes(req.params.prodId);
    const shows = combineShows(showData);
    const types = combineTicketTypes(ticketTypes);
    for (const i in shows) {
      shows[i].ticket_id = types[i].ticket_id;
      shows[i].ticket_price = types[i].ticket_price;
      shows[i].ticket_category = types[i].ticket_category;
    }
    console.log(shows);

    if (req.params.prodId) {
      res.status(200).json(shows[req.params.prodId]);
    }
    else {
      res.status(200).json(shows);
    }
    console.log("details received by SHOWS controller");

  } catch (err) {
    console.log(err);
    res.status(400).json({errMessage: "Unable to get show data."});
  }
};

// Combine the separate entries from the inner join to one entry
function combineShows(shows) {
  let showMap = new Map();
  for (const i in shows) {
    if (!showMap.has(shows[i].production_id)) {
      showMap.set(shows[i].production_id, i);
      shows[i].date = [shows[i].date];
      shows[i].doors_open = [shows[i].doors_open];
      shows[i].total_seats = [shows[i].total_seats];
      shows[i].sold = [shows[i].sold];
      shows[i].id = [shows[i].id];
    }
    else {
      const index = showMap.get(shows[i].production_id);
      shows[index].date.push(shows[i].date);
      shows[index].doors_open.push(shows[i].doors_open);
      shows[index].total_seats.push(shows[i].total_seats);
      shows[index].sold.push(shows[i].sold);
      shows[index].id.push(shows[i].id);
    }
  }
  let result = {};
  for (const i of showMap.values()) {
    result[shows[i].production_id] = shows[i];
  }
  return result;
}

function combineTicketTypes(types) {
  let typeMap = new Map();
  for (const i in types) {
    if (!typeMap.has(types[i].production_id)) {
      typeMap.set(types[i].production_id, i);
      types[i].ticket_id = [types[i].id];
      types[i].ticket_price = [types[i].price];
      types[i].ticket_category = [types[i].category];
    }
    else {
      const index = typeMap.get(types[i].production_id);
      types[index].ticket_id.push(types[i].id);
      types[index].ticket_price.push(types[i].price);
      types[index].ticket_category.push(types[i].category);
    }
  }
  let result = {};
  for (const i of typeMap.values()) {
    result[types[i].production_id] = types[i];
  }
  return result;
}

exports.getSeats = async function(req, res) {
  try {
    const seatsData = await showsService.getSeats(req.params.prodId);

    // Need to combine those of the same showid together and have a list of seat numbers instead of many rows
    const seats = combineSeats(seatsData);

    console.log(seats);
    res.status(200).json(seats);

  } catch (err){
    res.status(400).json({errMessage: "Unable to get seats data."});
  }
};

exports.makeBooking = async function(req, res) {
  try {
    const booking_ref = await showsService.bookTickets(req.params.prodId, req.params.showId, req.session.user_id, JSON.parse(req.body.seat_numbers), JSON.parse(req.body.ticket_amounts));
    res.status(201).send(booking_ref);

  } catch (err){
    console.log(err);
    res.status(400).json({errMessage: "Unable to make booking."});
  }
};


function combineSeats(seats) {
  let result = [];
  for (const seat of seats) {
    result.push(seat.seat_number);
  }
  return result;
}
    