const db = require("../../database/database.js");

exports.getUserInfo = async function(user_id) {
  let sql = "SELECT username, first_name, last_name, email FROM user WHERE id = ?";
  try {
    const row = await db.get(sql, user_id);
    return row;
  } catch (err) {
    console.log(err);
  }
};


// Need DO
exports.userTransactions = async function(user_id) {
  // max's masterpiece
  let sql = "SELECT b.*, p.name, p.poster_path, tt.category, tt.price, t.seat_number, s.date, s.doors_open, p.venue " 
              + "FROM production p INNER JOIN show s ON s.production_id = p.id "
              + "INNER JOIN booking b ON b.show_id = s.id INNER JOIN ticket t ON t.booking_id = b.id INNER JOIN ticket_type tt ON tt.id = t.ticket_type_id WHERE b.user_id = ?";
  //let sql = "SELECT * FROM booking INNER JOIN show ON booking.show_id = show.id INNER JOIN production ON production.id = show.production_id INNER JOIN ticket ON booking.id = ticket.booking_id INNER JOIN ticket_type ON ticket_type.id = ticket.ticket_type_id WHERE booking.id = ?";
  try {
    const rows = await db.all(sql, user_id);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

