const express = require('express');
const homeService = require('../service/home-service');

exports.getBanners = async function(req, res) {
  console.log('is rip is it');
  //res.send('NOT IMPLEMENTED: Banner update GET');

  console.log('is here is it so stuck');
    var banners = await homeService.getProductionBanners();
    console.log('is here is it');
    if (banners instanceof Error){
      res.status(400).json({ errMessage: 'Unable to get banners.'})
    } else {
      console.log(banners)
      res.status(200).json({
        valid: true,
        data: banners
      });
    }
  }
    