'use strict';

//Const for backend

require('dotenv').config();
let express = require('express');
let cors = require('cors');
let app = express();

// const corsOptions = {
//   origin: '*',
//   allowedHeaders: 'Access-Control-Allow-Headers,Authorization,X-API-KEY, Origin,X-Requested-With,Content-Type,Accept, Access-Control-Allow-Request-Method',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: true
// };

app.use(cors());
app.use(express.json());

// adds Access Control Allow Origin headers
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//   next();
// });

const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const getYelp = require('./models/yelp.js');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const getLocation = require('./models/location');
const UserData = require('./models/UserData')
const verifyUser = require('./autho');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

//Routes

app.get('/', (req, res) => {
  res.status(200).send('Looks good!');
});

app.get('/location', getLocation);
app.get('/userData', getUserData);
app.post('/userData', postUserData);
app.delete('/userData/:id', deleteUserData);
app.put('/userData/:id', updateUserData);
app.get('/yelp', getYelp);


async function getUserData(req, res, next) {
  verifyUser(req, async (err, user) => {
    try {
      if (err) {
        console.error(err);
        res.send('invalid token');
      } else {
        let queryObject = {}
        if (req.query.email) {
          queryObject.Email = req.query.email;
        }
        let results = await UserData.find(queryObject);
        console.log(results);
        if (results.length > 0) {
          res.status(200).send(results);
        } else {
          res.status(200).send([]);
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('server error');
    }
  });
}

async function postUserData(req, res, next) {
  verifyUser(req, async (err, user) => {
    try {
      if (err) {
        console.error(err);
        res.send('invalid token');
      } else {
        let createdUserData = await UserData.create(req.body);
        res.status(200).send(createdUserData);
      }
    } catch (err) {
      next(err);
    }
  });
}

async function deleteUserData(req, res, next) {
  verifyUser(req, async (err, user) => {
    let id = req.params.id;
    try {
      if (err) {
        console.error(err);
        res.send('invalid token');
      } else {
        await UserData.findByIdAndDelete(id);
        res.status(200).send('Deleted');
      }
    } catch (err) {
      next(err);
    }
  });
}
async function updateUserData(req, res, next) {
  verifyUser(req, async (err, user) => {
    try {
      if (err) {
        console.error(err);
        res.send('invalid token');
      } else {
        console.log('here');
        const updatedUserData = await UserData.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true });
        res.send(updatedUserData);
      }
    } catch (err) {
      next(err);
    }
  });
}

app.get('*', (req, res) => {
  res.status(404).send('Not available');
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});