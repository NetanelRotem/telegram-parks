const getUrl = (lat, lng) =>
  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=%D7%A4%D7%90%D7%A8%D7%A7%D7%99%D7%9D&key=${process.env.GOGGLE}&language=iw`;
module.exports = getUrl;
