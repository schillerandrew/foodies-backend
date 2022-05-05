'use strict';
let axios = require('axios');
let cache = require('./cache.js');


class Yelp {
  constructor(dataset) {
    this.name = dataset.name;
    this.image_url = dataset.image_url;
    this.price = dataset.price;
    this.rating = dataset.rating;
    this.url = dataset.url;
    this.location = dataset.location;
  }
}

async function getYelp(req, res, next) {
  try {
    let locationLat = req.query.lat;
    let locationLon = req.query.lon;
    console.log(locationLat, locationLon);
    let yelpURL = `https://api.yelp.com/v3/businesses/search?term=food&latitude=${locationLat}&longitude=${locationLon}`;
    let key = 'restaurants-' + locationLat + locationLon;
    if (cache[key] && (Date.now() - cache[key].timestamp < 300)) {
      console.log('Cache hit');
      res.status(200).send(cache[key].data);

    } else {
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let config = {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
      }
      let yelpInfo = await axios.get(yelpURL, config)
      let yelpArray = yelpInfo.data.businesses.map(info => new Yelp(info));
      cache[key] = {
        data: yelpArray
      }
      res.status(200).send(cache[key].data);
    }
  } catch (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
}

module.exports = getYelp;