var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    linkedinid: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError('Password is incorrect.'));
                }
            } else {
                callback(new AuthError('Username is incorrect.'));
            }
        }
    ], callback);
};

schema.statics.authorizeFromLinkedIn = function(username, linkedinid, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({linkedinid: linkedinid}, callback);
        },
        function(user, callback) {
            if (user) {
                callback(null, user);
            } else {
                var user = new User({
                    username: username,
                    linkedinid: linkedinid
                });
                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            }
        }
    ], callback);
};

schema.statics.register = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                callback(new RegError('Username already exists'));
            } else {
                var user = new User({username: username, password: password});
                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            }
        }
    ], callback);
};

schema.statics.update = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                user.password = password;
                user.save(function(err) {
                    if (err) callback(new Error('Password wasn\'t updated.'));
                    callback(null, user);
                });
            } else {
                // return error
                callback(new Error('Username is incorrect.'));
            }
        }
    ], callback);
};

schema.statics.delete = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                user.remove(function(err) {
                    if (err) callback(new Error('Account wasn\'t deleted.'));
                    callback(null, user);
                });
                callback(null, user);
            } else {
                // return error
                callback(new Error('Username is incorrect.'));
            }
        }
    ], callback);
};

schema.statics.findAll = function(callback) {
    var User = this;
    User.find(function(users) {
        callback(users);
    });
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;

function RegError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(RegError, Error);

RegError.prototype.name = 'RegError';

exports.RegError = RegError;