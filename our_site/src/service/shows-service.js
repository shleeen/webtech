const db = require("../../database/database.js");

exports.getProduction = async function(prod_id) {
  let sql = "SELECT show.id, production_id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note, date, doors_open, total_seats, sold FROM production INNER JOIN show ON production.id = show.production_id";
  if (prod_id) sql += " WHERE production.id = ?";
  try {
    const rows = await db.all(sql, prod_id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.getTicketTypes = async function(prod_id) {
  let sql = "SELECT * FROM ticket_type";
  if (prod_id) sql += " WHERE production_id = ?";
  try {
    const rows = await db.all(sql, prod_id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.getSeats = async function(show_id) {
  // combine bookings and get seats that are ebought
  let sql = "SELECT b.show_id, t.seat_number FROM ticket t INNER JOIN booking b ON b.id = t.booking_id INNER JOIN show s ON b.show_id = s.id WHERE b.show_id = ?";
  try {
    const rows = await db.all(sql, show_id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.bookTickets = async function(prod_id, show_id, user_id, seat_nums, ticket_amounts) {
  let total_price = 0;
  let num_tickets = 0;
  const ticket_types = await this.getTicketTypes(prod_id);
  console.log(seat_nums);
  console.log(ticket_amounts);
  for (const type of ticket_types) {
    total_price += ticket_amounts[type.id] * type.price;
    num_tickets += ticket_amounts[type.id];
  }
  if (num_tickets !== seat_nums.length)
    throw "Seat numbers and tickets don't match";
  const booking_time = new Date();
  // Need to do something about booking ref
  const result = await db.addBooking(show_id, user_id, total_price, booking_time.toISOString(), 1, "ref6temp", 0);
  num_tickets = 0;
  for (const type of ticket_types) {
    await db.addTickets(result.lastID, type.id, seat_nums.slice(num_tickets, num_tickets + ticket_amounts[type.id]));
    num_tickets += ticket_amounts[type.id];
  }
};
