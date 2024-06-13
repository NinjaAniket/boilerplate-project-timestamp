// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const bodyParser = require("bodyParser");
app.use(bodyParser());

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
app.post('/api/shorturl', (req, res, next) => {
  const shorturl = req.body;
  res.json({shorturl})
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
