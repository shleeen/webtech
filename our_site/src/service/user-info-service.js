const db = require("../../database/database.js");

exports.getUserInfo = async function(user_id) {
  let sql = "SELECT username, first_name, last_name, email FROM user WHERE id = ?";
  try {
    const row = await db.get(sql, user_id);
    console.log(row);
    return row;
  } catch (err) {
    console.log(err);
  }
};

