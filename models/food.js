const mongoose = require('mongoose');
const { Schema } = mongoose;


const newFoods = new mongoose.Schema({
  Yelpdata: {type: Object, req : true},
  Reviews: {type: Array },
  TopPick: {type: String}
});

const foodModel = mongoose.model('food', newFoods);
module.exports = foodModel;