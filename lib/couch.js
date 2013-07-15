var http = require('http'),
   qs = require('querystring');

exports.findOrCreateDB = function(config, creds, cb){

   console.log("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ":" + config.couch_port);
   var reqOptions = {
      host: config.couch_host,
      port: config.couch_port,
      path: config.couch_db,
      method: "PUT"
   };

    var nano = require('nano')('http://' + config.couch_host + ':' + config.couch_port);
    var gratzi = nano.use('gratzi');

    gratzi.insert(req.body, 'grat', function(err, body, header) {
        if (err) {
            console.log('[gratzi.insert] ', err.message);
            return;
        }
        console.log('you have inserted the grat.')
        console.log(body);
    });



};


