const showsService = require("../service/shows-service");

exports.getProd = async function(req, res) {
  try {
    const showData = await showsService.getProduction();
        
    res.status(200).json({
      valid: true,
      data: showData
    });

    console.log("details received by SHOWS controller");

  } catch (err) {
    res.status(400).json({errMessage: "Unable to get show data."});
  }
};
    