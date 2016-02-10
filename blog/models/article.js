var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    uid: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numberOfVotes: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.create = function(username, uid, title, text, callback) {
    var Article = this;
    var article = new Article({username: username, uid: uid, title: title, text: text});
    article.save(function(err) {
        if (err) return callback(err);
        callback(null, article);
    });
};

schema.statics.readAll = function(username, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.find({username: username}, callback);
        },
        function(articles, callback) {
            if (articles) {
                callback(null, articles);
            } else {
                callback(new Error('This user doesn\'t have articles'));
            }
        }
    ], callback);
};

schema.statics.read = function(username, id, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.findById(id, callback);
        },
        function(article, callback) {
            if (article) {
                callback(null, article);
            } else {
                callback(new Error('This user doesn\'t have articles'));
            }
        }
    ], callback);
};

schema.statics.findArticle = function(username, title, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.find({
                $or: [
                    {username: new RegExp(username, "i")},
                    {title: new RegExp(title, "i")}
                ]},
                callback);
        },
        function(articles, callback) {
            if (articles) {
                callback(null, articles);
            } else {
                callback(new Error('Can\'t find any article.'));
            }
        }
    ], callback);
};

/*schema.statics.findByUsername = function(username, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.find({username: username}, callback);
        },
        function(articles, callback) {
            if (articles) {
                callback(null, articles);
            } else {
                callback(new Error('Can\'t find any article.'));
            }
        }
    ], callback);
};

schema.statics.findByTitle = function(title, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.find({title: title}, callback);
        },
        function(articles, callback) {
            if (articles) {
                callback(null, articles);
            } else {
                callback(new Error('Can\'t find any article.'));
            }
        }
    ], callback);
};*/

schema.statics.update = function(username, id, title, text, rating, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.findById(id, callback);
        },
        function(article, callback) {
            if (article) {
                if (title) {
                    article.title = title;
                }
                if (text) {
                    article.text = text;
                }
                if (rating) {
                    article.numberOfVotes += 1;
                    article.rating += rating;
                }
                article.save(function(err) {
                    if (err) callback(new Error('Article wasn\'t updated.'));
                    callback(null, article);
                });
            } else {
                callback(new Error('Article can\'t be find.'));
            }
        }
    ], callback);
};

schema.statics.delete = function(username, id, callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.findById(id, callback);
        },
        function(article, callback) {
            if (article) {
                article.remove(function(err) {
                    if (err) callback(new Error('Article wasn\'t deleted.'));
                    callback(null);
                });
            } else {
                // return error
                callback(new Error('Article can\'t be find.'));
            }
        }
    ], callback);
};

schema.statics.findAll = function(callback) {
    var Article = this;

    async.waterfall([
        function(callback) {
            Article.find(callback);
        },
        function(articles, callback) {
            if (users) {
                callback(null, users);
            } else {
                // return error
                callback(new Error('Username is incorrect.'));
            }
        }
    ], callback);
};

exports.Article = mongoose.model('Article', schema);