var db = require("../../database/database.js")

exports.getProductionBanners = async function(req, res) {
    let sql = "SELECT banner_path FROM production";
    params = [];
    try {
        const rows = await db.get(sql, params);
        // Why does it get stuck at res.json
        /*res.json({
            "message": "success",
            "data": rows
        });*/
        return rows
    } catch (err) {
        res.status(500).json({"error":`Database error: ${err}`});
    }
  }

