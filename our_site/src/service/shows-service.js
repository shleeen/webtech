const db = require("../../database/database.js");

// Get the info for a production, or all productions if no id given
exports.getProduction = async function(prod_id) {
  let sql = "SELECT show.id, production_id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note, date, doors_open, total_seats, sold FROM production INNER JOIN show ON production.id = show.production_id";
  if (prod_id) sql += " WHERE production.id = ?";
  try {
    const rows = await db.all(sql, prod_id);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

// Get the ticket types for a production
exports.getTicketTypes = async function(prod_id) {
  try {
    return await db.getTicketTypes(prod_id);
  } catch (err) {
    console.log(err);
  }
};

// Get all the currently booked seats for a show
exports.getSeats = async function(show_id) {
  try {
    return await db.getSeats(show_id);
  } catch (err) {
    console.log(err);
  }
};

// Make a booking and add tickets for it
exports.bookTickets = async function(prod_id, show_id, user_id, seat_nums, ticket_amounts) {
  return await db.bookTickets(prod_id, show_id, user_id, seat_nums, ticket_amounts);
};
