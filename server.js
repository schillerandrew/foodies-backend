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
const UserData = require('./models/UserData')
const verifyUser = require('./autho');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

//Routes

app.get('/location', getLocation);
app.get('/userData', getUserData);
app.post('/userData', postUserData);
app.delete('/userData/:id', deleteUserData);
app.put('/userData/:id',updateUserData);
app.get('/yelp', getYelp);

async function getUserData(req, res, next) {
  try {
    console.log(req.query.email);
    let queryObject = {}
    let results = await UserData.find(req.query.email);
    res.status(200).send(results);
  } catch(err) {
    next(err);
  }
}
// async function getUserData(req, res, next) {
//   verifyUser(req, async (err, user) => {
//     if (err) {
//       console.error(err);
//       res.send('invalid token');
//     } else {
//       let queryObject = {}
//       if (req.query.email){
//         queryObject.email = req.query.email;
//       }
//     }  
//   try {
//     // let queryObject = {}
//     let userDataFromDb = await UserData.find(queryObject);
//     // let results = await UserData.find(queryObject);
//     // res.status(200).send(results);
//     if (userDataFromDb.length > 0) {
//       res.status(200).send(userDataFromDb);
//     } else {
//       res.status(404).send('error');
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).send('server error');
//    }
//   });
// }

async function postUserData (req, res, next) {
  console.log(req.body);
  try {
    let createdUserData = await UserData.create(req.body);
    res.status(200).send(createdUserData);
  } catch(err) {
    next(err);
  }
}

async function deleteUserData (req, res, next) {
  let id = req.params.id;
  console.log(id)
  try {
    await UserData.findByIdAndDelete(id);
    res.status(200).send('Deleted');
  } catch(err) {
    next(err);
  }
}
async function updateUserData (req, res) {
  const updatedUserData = await UserData.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true });
  res.send(updatedUserData);
};

app.get('*', (req, res) => {
  res.status(404).send('Not available');
})

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));