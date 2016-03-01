
var LocalStrategy = require('passport-local').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('../models/user').User;
var config = require('../config');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findUser(id, function (user) {
            done(null, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            process.nextTick(function() {
                User.register(username, password, function(err, user) {
                    if (err) {
                        if (err instanceof RegError) {
                            return done(new HttpError(409, err.message));
                        } else {
                            return done(err);
                        }
                    }

                    return done(null, user);
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.authorize(username, password, function (err, user) {
                if (err) {
                    if (err instanceof AuthError) {
                        return done(new HttpError(403, err.message));
                    } else {
                        return done(err);
                    }
                }

                done(null, user);
            });
        }));

    passport.use(new LinkedInStrategy({
            consumerKey: config.get('passport:LinkedInAPIKey'),
            consumerSecret: config.get('passport:LinkedInSecretKey'),
            callbackURL: "http://127.0.0.1:3003/auth/linkedin/callback",
            passReqToCallback : true
        },
        function (req, token, tokenSecret, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.authorizeFromLinkedIn(profile.name.familyName + profile.name.givenName, profile.id, function (err, user) {
                        if (err) return done(err);

                        return done(null, user);
                    });
                }
            });
        }
    ));
};