'use strict';

let axios = require('axios');

async function getLocation (req, res, next) {
try{
  console.log(req.query)
let locationName = req.query.locationName;
let locationApiUrl =`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API_KEY}&q=${locationName}&format=json`;
let locationData = await axios.get(locationApiUrl);
res.send(locationData.data[0]);
}catch(err) {
  next(err);
}
}
module.exports = getLocation;