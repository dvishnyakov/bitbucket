var Article = require('../models/article').Article;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.get = function(req, res, next) {
    var username = req.params.username;
    var uid = req.params.uid;

    if (uid) {
        res.render('../templates/article', {
            articleUsername: username,
            articleUID: uid
        });
    } else {
        res.render('../templates/article', {
            articleUsername: username,
            articleUID: undefined
        });
    }
};

exports.postobj = function(req, res, next) {

    var username = req.body.username;
    var title = req.body.newarticletitle;
    var text = req.body.newarticletext;

    Article.create(username, 100, title, text, function(err, article) {
        if (err) return next(err);

        res.send(article);
    });
};

exports.getobj = function(req, res, next) {

    var username = req.params.username;
    var id = req.params.uid;

    Article.read(username, id, function(err, article) {
        if (err) return next(err);

        res.send(article);
    });
};

exports.putobj = function(req, res, next) {

    var username = req.params.username;
    var id = req.params.uid;
    var title = req.body.newarticletitle;
    var text = req.body.newarticletext;
    var rating = req.body.rating ? parseInt(req.body.rating) : undefined;

    Article.update(username, id, title, text, rating, function(err, article) {
        if (err) return next(err);

        res.send(article);
    });
};

exports.deleteobj = function(req, res, next) {

    var username = req.params.username;
    var id = req.params.uid;

    Article.delete(username, id, function(err, article) {
        if (err) return next(err);

        res.send({});
    });
};

exports.find = function(req, res, next) {
    var username = req.body.searchvalue;
    var title = req.body.searchvalue;

    Article.findArticle(username, title, function(err, articles) {
        res.send(articles);
    });
};

exports.getArticlesByUsername = function(req, res, next) {

    var username = req.body.userId;

    Article.readAll(username, function(err, articles) {
        res.send(articles);
    });

};