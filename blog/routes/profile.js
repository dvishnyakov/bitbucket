var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.get = function(req, res) {
    res.render('../templates/profile', {
        profileUsername: req.params.username
    });
};

exports.post = function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    User.update(username, password, function(err, user) {

    });
};

exports.put = function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    User.update(username, password, function(err, user) {
        if (err) return next(err);

        res.send({});
    });

};

exports.delete = function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    User.delete(username, password, function(err, user) {
        if (err) return next(err);

        res.send({});
    });

};