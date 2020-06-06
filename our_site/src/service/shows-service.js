const db = require("../../database/database.js");

// Get the info for a production, or all productions if no id given
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

// Get the ticket types for a production
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

// Get all the currently booked seats for a show
exports.getSeats = async function(show_id) {
  const sql = "SELECT b.show_id, t.seat_number FROM ticket t INNER JOIN booking b ON b.id = t.booking_id INNER JOIN show s ON b.show_id = s.id WHERE b.show_id = ?";
  try {
    const rows = await db.all(sql, show_id);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

// Make a booking and add tickets for it
exports.bookTickets = async function(prod_id, show_id, user_id, seat_nums, ticket_amounts) {
  let taken_seats = await this.getSeats(show_id);
  taken_seats = taken_seats.map(x => x.seat_number);
  // Check we're not trying to book seats that are already taken
  if (taken_seats.some(v => seat_nums.includes(v))) {
    throw "Seat already taken";
  }
  let total_price = 0;
  let num_tickets = 0;
  const ticket_types = await this.getTicketTypes(prod_id);
  for (const type of ticket_types) {
    total_price += ticket_amounts[type.id] * type.price;
    num_tickets += ticket_amounts[type.id];
  }
  // Check if we have the same amount of tickets and seat numbers
  if (num_tickets !== seat_nums.length)
    throw "Seat numbers and tickets don't match";
  const booking_time = new Date();
  const booking_ref = "REF-" + randomString(8, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const result = await db.addBooking(show_id, user_id, total_price, booking_time.toISOString(), 1, booking_ref, 0);
  num_tickets = 0;
  for (const type of ticket_types) {
    await db.addTickets(result.lastID, type.id, seat_nums.slice(num_tickets, num_tickets + ticket_amounts[type.id]));
    num_tickets += ticket_amounts[type.id];
  }
  return booking_ref;
};

// Used for booking reference
function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
