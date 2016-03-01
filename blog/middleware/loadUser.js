var User = require('../models/user').User;

module.exports = function(req, res, next) {
    res.locals.user = null;

    if (!req.user) return next();

    User.findById(req.user._id, function(err, user) {
        if (err) return next(err);

        res.locals.user = user;
        next();
    });
};