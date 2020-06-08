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
  if (!req.session.user_id) {
    res.sendStatus(401);
    return;
  }
  try {
    const userTransactions = await userService.userTransactions(req.session.user_id);

    // Convert 1s and 0s to words
    for (const u in userTransactions) {
      if (userTransactions[u].paid === 1)
        userTransactions[u].paid = "Paid";
      else
        userTransactions[u].paid = "Not paid";

      if (userTransactions[u].collected === 1)
        userTransactions[u].collected = "Yes";
      else
        userTransactions[u].collected = "No";
    }
      
    // Combine rows of the same booking id -> so seat numbers are combined
    const transactions = combineTransactions(userTransactions);


    // Add in ticket count 
    for (const t in transactions) {
      transactions[t].prices = [];
      transactions[t].ticket_no = [];

      var current = null;
      var count = 0;
      // count the number of tickets for each price
      for (var p in transactions[t].price) {
        if (current !== transactions[t].price[p]) {
          if (count > 0) {
            transactions[t].prices.push(current);
            transactions[t].ticket_no.push(count);
          }
          count = 1;
          current = transactions[t].price[p];
          
        } else count += 1;
      } 
      if (current !== null) {
        transactions[t].prices.push(current);
        transactions[t].ticket_no.push(count);

      }
      delete transactions[t].price;
      //transactions[t].ticket_no = transactions[t].seat_number.length;
    }
    
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get user transactions."});
  }
};

// Combine separate rows from DB to get an array of seat numbers
function combineTransactions(trans) {
  let transMap = new Map();
  for (const i in trans) {
    if (!transMap.has(trans[i].id)) {
      transMap.set(trans[i].id, i);
      trans[i].seat_number = [trans[i].seat_number];
      // combine ticket type 
      trans[i].category = [trans[i].category];
      // combine ticket price
      trans[i].price = [trans[i].price];
    } 
    else {
      const index = transMap.get(trans[i].id);
      trans[index].seat_number.push(trans[i].seat_number);
      // check if exist

      trans[index].price.push(trans[i].price);
      
      trans[index].category.push(trans[i].category);
    }
  }

  let result = {};
  for (const i of transMap.values()) {
    result[trans[i].id] = trans[i];
  }
  return result;
}