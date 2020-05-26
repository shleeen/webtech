const showsService = require("../service/shows-service");

exports.getProd = async function(req, res) {
  try {
    const showData = await showsService.getProduction();
    const shows = combineShows(showData);
        
    res.status(200).json({
      valid: true,
      data: shows
    });

    console.log("details received by SHOWS controller");

  } catch (err) {
    res.status(400).json({errMessage: "Unable to get show data."});
  }
};

// Combine the separate entries from the inner join to one entry
function combineShows(shows) {
  let showMap = new Map();
  for (const i in shows) {
    if (!showMap.has(shows[i].production_id)) {
      showMap.set(shows[i].production_id, i);
      shows[i].date = [shows[i].date];
      shows[i].doors_open = [shows[i].doors_open];
      shows[i].total_seats = [shows[i].total_seats];
      shows[i].sold = [shows[i].sold];
    }
    else {
      const index = showMap.get(shows[i].production_id);
      shows[index].date.push(shows[i].date);
      shows[index].doors_open.push(shows[i].doors_open);
      shows[index].total_seats.push(shows[i].total_seats);
      shows[index].sold.push(shows[i].sold);
    }
  }
  let result = [];
  for (const i of showMap.values()) {
    result.push(shows[i]);
  }
  return result;
}
    