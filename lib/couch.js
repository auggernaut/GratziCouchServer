var http = require('http'),
   https = require('https'),
   qs = require('querystring');

exports.findOrCreateDB = function(config, creds, cb){

   console.log("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ":" + config.couch_port);
   var reqOptions = {
      host: config.couch_host,
      port: config.couch_port,
      path: config.couch_db,
      method: "PUT"
   };

   var body = "";
   var req = http.request(reqOptions, function (res) {
      console.log(res);
      //res.setEncoding('utf8');
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
         cb(null, qs.parse(body));
      });
   });

   req.on('error', function (e) { cb(e); });

   req.write('data\n');
   req.end();


};


