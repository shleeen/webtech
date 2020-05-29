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
  let sql = "SELECT * FROM user WHERE id = ?";
  try {
    const row = await db.get(sql, user_id);
    return row;
  } catch (err) {
    console.log(err);
  }
}

