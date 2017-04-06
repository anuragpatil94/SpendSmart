const userData = require("./users");
const LocalStrategy = require('passport-local').Strategy;
module.exports = {
    users: userData,
    configPassport(passport) {
        passport.use(new LocalStrategy(
            function (username, password, cb) {
                return userData.getUserById(username)
                    .then(user => {
                        if (!user) {
                            return cb(null, false, {message: 'Incorrect username.'});
                        }
                        if (user.password !== password) {
                            return cb(null, false, {message: 'Incorrect password.'});
                        }
                        return cb(null, user);
                    }).catch(err => {
                        return cb(err);
                    });
            }));
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
        passport.serializeUser(function (user, cb) {
            cb(null, user._id);
        });

        passport.deserializeUser(function (id, cb) {
            userData.getUserById(id)
                .then(user => {
                    cb(null, user);
                }, err => {
                    cb(err);
                });
        });
    }
};