var q = require('q');

exports.findOrCreateDB = function (config, creds, cb) {

   var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
   var users = nano.use('_users');

   var user = {
      _id: "org.couchdb.user:" + creds.username,
      name: creds.username,
      roles: [],
      type: "user",
      password: creds.password
   };

   var userDB = nano.use(creds.username);
   var secObj = {
      admins: {
         names: [],
         roles: []
      },
      members: {
         names: [creds.username],
         roles: []
      }
   };

   console.log(user);


   function createUser() {
      var deferred = q.defer();

      users.insert(user, creds._id, function (err, body) {
         if (err) {
            deferred.reject(new Error("Error message: " + err.message));
         }
         else {
            deferred.resolve(body);
         }
      });

      return deferred.promise;
   }

   function createDB() {
      var deferred = q.defer();

      nano.db.create(creds.username, function (err, body) {
         if (err) {
            deferred.reject(new Error("Error message: " + err.message));
         }
         else {
            deferred.resolve(body);
         }
      });
      return deferred.promise;
   }


   function updateSecurity() {
      var deferred = q.defer();

      userDB.insert(secObj, "_security", function (err, body) {
         if (err) {
            deferred.reject(new Error("Error message: " + err.message));
         }
         else {
            deferred.resolve(body);
         }
      });
      return deferred.promise;
   }


   createUser()
      .then(createDB())
      .then(updateSecurity())
      .then(function (response) {
          console.log(response);
         cb(response);
      }, function (error) {
         console.log(error);
         cb("failed");
      });


};


