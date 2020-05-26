const homeService = require("../service/home-service");

exports.getBanners = async function(req, res) {
  try {
    const banners = await homeService.getProductionBanners();
    res.status(200).json({
      valid: true,
      data: banners
    });
  } catch (err) {
    res.status(400).json({errMessage: "Unable to get banners."});
  }
};
    