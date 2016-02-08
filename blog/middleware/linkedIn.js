var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;
var User = require('../models/user').User;
var config = require('../config');

module.exports = function(app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new LinkedInStrategy({
            consumerKey: config.get('passport:LinkedInAPIKey'),
            consumerSecret: config.get('passport:LinkedInSecretKey'),
            callbackURL: "http://127.0.0.1:3003/auth/linkedin/callback"
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));

    app.get('/auth/linkedin',
        passport.authenticate('linkedin', { session: false }));

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login', session: false }),
        function(req, res) {
            User.authorizeFromLinkedIn(req.user.name.familyName + req.user.name.givenName, req.user.id, function(err, user) {
                if (err) return next(err);

                req.session.user = user._id;
                res.redirect('/');
            });
        });
};