var db = require("../../database/database.js")

exports.getProduction = async function(req, res) {
    let sql = "SELECT * FROM production";
    params = [];
    try {
        const rows = await db.all(sql, params);
        console.log(rows)
        return rows
    } catch (err) {
        res.status(500).json({"error":`Database error: ${err}`});
    }
  }
