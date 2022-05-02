const mongoose = require('mongoose');
const { Schema } = mongoose;


const newFoods = new mongoose.Schema({
  Yelpdata: {type: Object, req : true},
  Review: {type: Array },
});

const foodModel = mongoose.model('food', newFoods);
module.exports = foodModel;