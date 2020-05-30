const userService = require("../service/user-info-service");

exports.getUserInfo = async function(req, res) {
  try {
    const userInfo = await userService.getUserInfo(req.session.user_id);
    if (userInfo) {
      res.status(200).json({
        valid: true,
        data: userInfo
      });
    }
    else res.sendStatus(401);
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get userInfo."});
  }
};

exports.getUserTransactions = async function(req, res) {
  try {
    const userTransactions = await userService.userTransactions(req.session.user_id);

    // convert 1s and 0s to words
    for (var u in userTransactions){
      if (userTransactions[u].paid == "1") userTransactions[u].paid = "paid";
      else userTransactions[u].paid = "not paid";

      if (userTransactions[u].collected == "1") userTransactions[u].collected = "yes";
      else userTransactions[u].collected = "no";
    }
      
    // conbine rows of the same booking id -> so deat numbers are combined
    const transactions = combineTransactions(userTransactions);
    console.log(transactions)


    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get user transactions."});
  }
}

function combineTransactions(trans){
  let transMap = new Map();
  for (const i in trans) {
    if (!transMap.has(trans[i].id)){
      transMap.set(trans[i].id, i);

      // trans[i].order_total = [trans[i].order_total];
      // trans[i].booking_time = [trans[i].booking_time];
      // trans[i].paid = [trans[i].paid];
      // trans[i].booking_ref = [trans[i].booking_ref];
      // trans[i].collected = [trans[i].collected];
      // trans[i].name = [trans[i].name];
      // trans[i].poster_path = [trans[i].poster_path];
      // trans[i].category = [trans[i].category];
      // trans[i].price = [trans[i].price];
      // trans[i].date = [trans[i].date];
      // trans[i].doors_open = [trans[i].doors_open];
      // trans[i].venue = [trans[i].venue];
      trans[i].seat_number = [trans[i].seat_number];
    } 
    else {
      const index = transMap.get(trans[i].id);
      trans[index].seat_number.push(trans[i].seat_number);

    }
  }

  let result = {};
  for (const i of transMap.values()) {
    result[trans[i].id] = trans[i];
  }
  return result;

}