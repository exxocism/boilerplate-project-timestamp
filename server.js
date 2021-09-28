// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

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
  res.json({greeting: 'hello API'});
});

const mWareLogger = (req, res, next) => {
  console.log(
    `${req.method} ${req.path} - ${req.ip}`
  );
  next();
};
app.use( mWareLogger );

const dateToJson = (req, res) => {
  const is_req_tickcount =
    parseFloat(req.params.datetick).toString().length ===
    req.params.datetick.length;

  let tickcount;
  let datestring;
  if( is_req_tickcount ) {
    tickcount = req.params.datetick;
    datestring = new Date(parseFloat(req.params.datetick));
  } else {
    datestring = new Date(req.params.datetick);
    tickcount = datestring.getTime();
  }

  if( !tickcount || !datestring || parseFloat(tickcount) === NaN || datestring.toUTCString() === 'Invalid Date' ) {
    res.json( { error : "Invalid Date" } );
    return ;
  }

  const response = {
    unix: parseFloat(tickcount),
    utc: datestring.toUTCString()
  };
  res.json( response );
}

const parseShit = (req, res, next) => {
  req.params.datetick = new Date();
  next();
};
 
app.get("/api", parseShit, dateToJson );
app.get("/api/:datetick", dateToJson );


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
