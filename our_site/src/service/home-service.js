var db = require("../../database/database.js")

// THIS DOES NOT WORK
exports.getProductionBanners = async function(req, res) {
    let sql = "SELECT banner_path FROM production";
    params = [];
    try {
        const rows = await db.get(sql, params);
        console.log(rows);
        res.json({
            "message": "success",
            "data": rows
        });
    } catch (err) {
        res.status(500).json({"error":`Database error: ${err}`});
    }

    // NEED TO SOMEHOW BE LIKE db.sql
    /*return new Promise((resolve, reject) => {
        query('SELECT banner_path FROM production',(err, rows) => {
            console.log('is here stuck?');
            if (err) reject(new CustomErr(`Database error: ${err}`, 500))
            else resolve(rows)
        })
    })*/
  }

