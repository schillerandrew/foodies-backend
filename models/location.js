'use strict';

let axios = require('axios');

async function getLocation (req, res, next) {
try{
  console.log(req.query)
let locationName = req.query.q;
let locationApiUrl =`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API_KEY}&q=${locationName}&format=json`;
console.log(locationApiUrl);
let locationData = await axios.get(locationApiUrl);
res.send(locationData.data);
}catch(err) {
  next(err);
}
}
module.exports = getLocation;