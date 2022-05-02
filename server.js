'use strict';

//Consts for backend

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const getYelp = require('./models/yelp.js');
mongoose.connect(process.env.DB_URL);
const getLocation = require('./models/location');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

//Routes

app.get('/location', getLocation);
app.get('/foods', getFoods);
app.post('/foods', postFoods);
app.delete('/foods/:id', deleteFoods);
app.put('/foods/:id',updateFoods);
app.get('/yelp', getYelp);


async function getFoods(req, res, next) {
  try {
    let queryObject = {}
    let results = await Foods.find(queryObject);
    res.status(200).send(results);
  } catch(err) {
    next(err);
  }
}

async function postFoods (req, res, next) {
  console.log(req.body);
  try {
    let createdFoods = await Foods.create(req.body);
    res.status(200).send(createdFoods);
  } catch(err) {
    next(err);
  }
}

async function deleteFoods (req, res, next) {
  let id = req.params.id;
  console.log(id)
  try {
    await Foods.findByIdAndDelete(id);
    res.status(200).send('Food Removed');
  } catch(err) {
    next(err);
  }
}
async function updateFoods (req, res) {
  const updatedFoods = await Foods.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true });
  res.send(updatedFoods);
};

app.get('*', (req, res) => {
  res.status(404).send('Not available');
})

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));