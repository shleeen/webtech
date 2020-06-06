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
    // Still send an OK even if the session is invalid, so it can be used as a login-check by the client
    else {
      res.status(200).json({
        valid: false
      });
    }
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get userInfo."});
  }
};

exports.getUserTransactions = async function(req, res) {
  try {
    const userTransactions = await userService.userTransactions(req.session.user_id);

    // Convert 1s and 0s to words
    for (const u in userTransactions){
      if (userTransactions[u].paid === "1")
        userTransactions[u].paid = "Paid";
      else
        userTransactions[u].paid = "Not paid";

      if (userTransactions[u].collected === "1")
        userTransactions[u].collected = "Yes";
      else
        userTransactions[u].collected = "No";
    }
      
    // Combine rows of the same booking id -> so seat numbers are combined
    const transactions = combineTransactions(userTransactions);

    // Add in ticket count 
    for (const t in transactions){
      transactions[t].ticket_no = transactions[t].seat_number.length;
    }
    
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get user transactions."});
  }
};

// Combine separate rows from DB to get an array of seat numbers
function combineTransactions(trans){
  let transMap = new Map();
  for (const i in trans) {
    if (!transMap.has(trans[i].id)){
      transMap.set(trans[i].id, i);
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