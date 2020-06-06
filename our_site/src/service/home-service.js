const db = require("../../database/database.js");

exports.getProductionBanners = async function(req, res) {
  const sql = "SELECT banner_path FROM production";
  try {
    const rows = await db.all(sql);
    return rows;
  } catch (err) {
    res.status(500).json({"error":`Database error: ${err}`});
  }
};

