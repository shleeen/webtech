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