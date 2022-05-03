const mongoose = require('mongoose');
const { Schema } = mongoose;


const newUser = new mongoose.Schema({
  Email: {type: String},
  Yelpdata: {type: Array},
  Reviews: {type: Array },
  TopPick: {type: String}
});

const userModel = mongoose.model('food', newUser);
module.exports = userModel;