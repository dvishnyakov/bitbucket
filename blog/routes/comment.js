var Comment = require('../models/comment').Comment;
var async = require('async');

exports.getAll = function(req, res, next) {
    var uid = req.params.articleuid;

    Comment.readAll(uid, function(err, comments) {
        if (err) return next(err);

        res.send(comments);
    });
};

exports.post = function(req, res, next) {
    var uid = req.params.articleuid;
    var username = req.body.username;
    var text = req.body.text;

    Comment.create(username, uid, text, function(err) {
        if (err) return next(err);
        res.send({});
    });
};