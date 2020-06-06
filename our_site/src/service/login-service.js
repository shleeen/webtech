const userInfo = require("../service/user-info-service");
const dbHelper = require(process.cwd() + "/database/database");

exports.login = async function(req, res) {
  const user_id = await dbHelper.authenticate(req.body.email, req.body.pwd);
  if (user_id) {
    const info = await userInfo.getUserInfo(user_id);
    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(() => {
      // Store the user's primary key
      // in the session store to be retrieved
      req.session.user_id = user_id;
      if (req.body.remember === "on") {
        req.session.cookie.maxAge = 7 * 24 * 3600 * 1000; // Stay logged in for a week
      }
      res.status(200).json(info);
    });
    return info;
  } else {
    return false;
  }
};
