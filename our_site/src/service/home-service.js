var db = require("../../database/database.js")

// THIS DOES NOT WORK
exports.getProductionBanners = async function(req, res) {
    var sql = "SELECT banner_path FROM production";
    params = [];
    db.get(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });

    // NEED TO SOMEHOW BE LIKE db.sql
    /*return new Promise((resolve, reject) => {
        query('SELECT banner_path FROM production',(err, rows) => {
            console.log('is here stuck?');
            if (err) reject(new CustomErr(`Database error: ${err}`, 500))
            else resolve(rows)
        })
    })*/
  }

