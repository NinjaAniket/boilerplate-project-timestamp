// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI is not defined');
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));



// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello APIsss'});
});







// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  username: {type: String}
})

const exerciseSchema = new mongoose.Schema({
  description: {type: String},
  duration: {type: Number},
  date: {type: Date, default: Date.now},
  userName: String,
  userId: String 
})

const logsSchema = new mongoose.Schema({
  description: {type: String},
  count: {type: Number},
  log: [exerciseSchema]

})

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
const Logs = mongoose.model('Logs', logsSchema)


app.post('/api/users', async(req, res, next) => {
  const {username} = req.body;

  const user = await User.create({
    username
  })
  return res.json({username: user.username, _id: user._id})

})

app.get('/api/users', async(req, res) => {
  const user = await User.find({}, 'username _id');
  console.log(user, 'user')
  return res.json(user)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const {_id} = req.params;
  const {description, duration, date} = req.body;
  const exercise = await Exercise.create({
    _id,
    description,
    duration,
    date: date ? new Date(date) : new Date()
  });

  
  //find user by id
  const user = User.findById(_id);

  if(user) {
    return res.json({
      _id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date

    })
  }

  return res.json({'error': 'user not found!'})

})

app.get('/api/users/:_id/logs', async(req, res) => {
  const {_id} = req.params;
  //find exercise
  const user = await User.findById(_id);
  const exercise = await Exercise.find({_id});

  return res.json({
    _id: exercise._id,
    username: user.username,
    count: exercise.length,
    log: exercise
  })
})


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



