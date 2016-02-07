var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var RegError = require('../models/user').RegError;

exports.post = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.register(username, password, function(err, user) {
        if (err) {
            if (err instanceof RegError) {
                return next(new HttpError(409, err.message));
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    });
};