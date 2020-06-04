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
  if (prod_id) sql += " WHERE production.id = ?";
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
