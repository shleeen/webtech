const db = require("../../database/database.js");

exports.getProduction = async function(prod_id) {
  let sql = "SELECT production_id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note, date, doors_open, total_seats, sold FROM production INNER JOIN show ON production.id = show.production_id";
  if (prod_id) sql += " WHERE production.id = ?";
  try {
    const rows = await db.all(sql, prod_id);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

exports.getShows = async function(prod_id) {
  // assuming we have a table seats with each row representing a show and 209 seats with values of 1/0(taken or not)
  // getall shows for that production, and return seats that are taken
  let sql = "";
}
