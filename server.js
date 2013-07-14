var url = require('url'),
   http = require('http'),
   https = require('https'),
   express = require('express'),
   app = express(),
   message = require('./lib/message.js'),
   utils = require('./lib/utils.js'),
   couch = require('./lib/couch.js');

app.use(express.bodyParser());

var config = utils.loadConfig();
var port = process.env.PORT || config.port || 9999;

app.listen(port, null, function (err) {
   if(err)
   console.log('Error: ' + err);
   console.log('GratziCouchServer, at your service: http://localhost:' + port);
});


// Convenience for allowing CORS on routes - GET only
app.all('*', function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
});



app.post('/login', function(req, res){
   console.log("/login");
   couch.findOrCreateDB(config, req.body, function (err, db) {
      if(err) {
         console.log(err);
         res.json(err);
      }
      else {
         console.log(db);
         res.json(db);
      }

   });
});



app.post('/email', function (req, res) {
   console.log('sending email:' + JSON.stringify(req.body));
   message.email(config, req.body, function (err, token) {
      var result = err || !token ? { "error": err } : { "token": token };
      console.log(result);
      res.json(result);
   });
});


