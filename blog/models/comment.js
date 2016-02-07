var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        required: true
    },
    articleUID: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.create = function(username, uid, text, callback) {
    var Comment = this;

    var comment = new Comment({username: username, articleUID: uid, text: text});
    comment.save(function(err) {
        if (err) return callback(err);
        callback(null);
    });
};

schema.statics.readAll = function(uid, callback) {
    var Comment = this;

    async.waterfall([
        function(callback) {
            Comment.find({articleUID: uid}, callback);
        },
        function(comments, callback) {
            if (comments) {
                callback(null, comments);
            } else {
                callback(new Error('This user doesn\'t have articles'));
            }
        }
    ], callback);
};

exports.Comment = mongoose.model('Comment', schema);