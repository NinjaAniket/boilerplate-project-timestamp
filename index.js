// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const bodyParser = require("bodyParser");
app.use(bodyParser());
const mongoose = require("mongoose");


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

app.get('/api/:date?', (req, res) => {
  let date = req.params.date;
  //will return invalid if date is NaN
  let isDateValid = Date.parse(date);


  let unixTimestamp;
  let utcTimestamp;

  let isValidUnixNumber = /^[0-9]+$/.test(date)

  if(isDateValid) {
    unixTimestamp = new Date(date);
    utcTimestamp = unixTimestamp.toUTCString();
    res.json({unix: unixTimestamp.valueOf(), utc: utcTimestamp})
  }else if(date == '' || date == null) {
    res.json({unix: new Date().valueOf(), utc: new Date().toUTCString()})
}
else if (isNaN(isDateValid) && isValidUnixNumber) {
  unixTimestamp = new Date(parseInt(date));
  utcTimestamp  = unixTimestamp.toUTCString();
  return res.json({unix : unixTimestamp.valueOf(), utc : utcTimestamp});
}
 else {
    res.json({error: "Invalid Date"})
  }
})

app.set('trust proxy', true);


app.get('/api/whoami', (req, res) => {
  const ipaddress = req.ip;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  let obj = {
    ipaddress,
    language,
    software
  };

  res.json({obj})


  
});

//api/shorturl

app.post("/api/shorturl", (req,res) => {
  const {url} = req.body;

  //check url is valid

  if(!url.includes("https://") && !url.includes("http://")) {
    return res.json({error: "invalid url"})
  }


  const index = orignalUrl.indexOf(url);

  if(index === -1) {
    orignalUrl.push(url);
    shortUrl.push(shortUrl.length);
    return res.json({
      original_url: url,
      short_url: shortUrl.length - 1
    })
  }

  return res.json({
    orignal_url: url,
    short_url: shortUrl[index]
  })
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const url = parseInt(req.params.short_url);
  const index = shortUrl.indexOf(url);
  console.log(index, 'index');
  if(index !== -1) {
   return res.redirect(orignalUrl[index])
  }
  return res.json({
    error: 'Request url not found'
  })

})


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  username: {type: String}
})

const exerciseSchema = new mongoose.Schema({
  description: {type: String},
  duration: {type: Number},
  date: {type: Date, default: Date.now}
})

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema)


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
  const { description, duration, date} = req.body;
  const exercise = await Exercise.create({
     description, duration, date
  })
  console.log(exercise, 'exercise')
  return res.json(exercise)

})


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



